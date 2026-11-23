"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useFinePointer } from "@/lib/useMediaQuery";

/**
 * Flat (2D) HUD panel with a cursor-tracking spotlight and corner brackets.
 * No 3D tilt — the card stays in the plane; only a background gradient moves,
 * which stays off the layout path. Disabled entirely for touch pointers.
 *
 * `glow-ring` and `corner-frame` both draw with ::before, so the brackets live
 * on a nested span to avoid the pseudo-element clash.
 */
export function TiltCard({
  children,
  className = "",
  glow = "#22d3ee",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
  /** Retained for call-site compatibility; the 3D tilt it drove was removed. */
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${px}% ${py}%, color-mix(in oklab, ${glow} 20%, transparent), transparent 72%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 100);
    py.set(((e.clientY - r.top) / r.height) * 100);
  };

  const onLeave = () => {
    px.set(50);
    py.set(50);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`panel glow-ring group relative overflow-hidden rounded-xl ${className}`}
    >
      {fine && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}
      <span aria-hidden className="corner-frame pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </div>
  );
}
