"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useFinePointer } from "@/lib/useMediaQuery";

/** Side of the square patch of grid lit around the cursor, in px. */
const GRID_PATCH = 760;

/**
 * Fixed page backdrop: drifting aurora blobs with pointer parallax, a grid that
 * lights up around the cursor, and a vignette. Sits behind all content.
 */
export function Backdrop() {
  const fine = useFinePointer();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 55, damping: 22 });
  const sy = useSpring(my, { stiffness: 55, damping: 22 });

  // Opposing depths keep the layers reading as separate planes.
  const blobAx = useTransform(sx, [0, 1], [-40, 40]);
  const blobAy = useTransform(sy, [0, 1], [-30, 30]);
  const blobBx = useTransform(sx, [0, 1], [32, -32]);
  const blobBy = useTransform(sy, [0, 1], [24, -24]);
  const blobCx = useTransform(sx, [0, 1], [-18, 18]);
  const blobCy = useTransform(sy, [0, 1], [16, -16]);

  // The lit grid patch follows the cursor by TRANSFORM, not by rewriting a
  // mask-image. mask-image is paint-invalidating: animating it re-rasterised
  // the whole viewport on every pointer event.
  const gridX = useMotionValue(-9999);
  const gridY = useMotionValue(-9999);
  const gridLeft = useTransform(gridX, (v) => v - GRID_PATCH / 2);
  const gridTop = useTransform(gridY, (v) => v - GRID_PATCH / 2);

  useEffect(() => {
    if (!fine) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    // Coalesce to one write per frame; high-poll-rate mice fire pointermove
    // well above 60Hz.
    const flush = () => {
      frame = 0;
      mx.set(px / window.innerWidth);
      my.set(py / window.innerHeight);
      gridX.set(px);
      gridY.set(py);
    };

    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, [fine, mx, my, gridX, gridY]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
    >
      {/* Each blob is two elements on purpose: the CSS drift animation and the
          pointer parallax both write `transform`, and an animation always beats
          an inline style — on one element the parallax is silently dead.
          Outer drifts, inner parallaxes.
          Smaller radii and lighter blur on phones: a 120px blur over a 46rem
          element is a large texture for a mobile GPU to keep resident. */}
      <div
        className="absolute top-[-18%] left-[-8%] size-[24rem] md:size-[46rem]"
        style={{ animation: "aurora-drift 26s ease-in-out infinite" }}
      >
        <motion.div
          className="size-full rounded-full bg-blue/20 blur-[70px] md:blur-[120px]"
          style={{ x: blobAx, y: blobAy }}
        />
      </div>
      <div
        className="absolute top-[20%] right-[-14%] size-[22rem] md:size-[40rem]"
        style={{ animation: "aurora-drift 32s ease-in-out -7s infinite" }}
      >
        <motion.div
          className="size-full rounded-full bg-purple/18 blur-[70px] md:blur-[120px]"
          style={{ x: blobBx, y: blobBy }}
        />
      </div>
      <div
        className="absolute bottom-[-16%] left-[24%] hidden size-[38rem] md:block"
        style={{ animation: "aurora-drift 38s ease-in-out -14s infinite" }}
      >
        <motion.div
          className="size-full rounded-full bg-cyan/14 blur-[120px]"
          style={{ x: blobCx, y: blobCy }}
        />
      </div>

      <div className="grid-bg absolute inset-0 opacity-40" />

      {fine && (
        <motion.div
          className="absolute top-0 left-0"
          style={{
            x: gridLeft,
            y: gridTop,
            width: GRID_PATCH,
            height: GRID_PATCH,
            // Anchoring the pattern to the viewport keeps the grid lines still
            // while only the lit window travels with the cursor.
            backgroundAttachment: "fixed",
            backgroundSize: "64px 64px",
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--color-cyan) 30%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-cyan) 30%, transparent) 1px, transparent 1px)",
            WebkitMaskImage:
              "radial-gradient(circle at center, #000 0%, transparent 72%)",
            maskImage:
              "radial-gradient(circle at center, #000 0%, transparent 72%)",
          }}
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,var(--color-ink)_94%)]" />
    </div>
  );
}
