"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "@/lib/useMediaQuery";

/**
 * HUD panel with pointer tilt, a cursor-tracking spotlight and corner brackets.
 *
 * Only transform and a background gradient change, both of which stay off the
 * layout path. Disabled entirely for touch and reduced-motion users.
 *
 * `glow-ring` and `corner-frame` both draw with ::before, so the brackets live
 * on a nested span to avoid the pseudo-element clash.
 */
export function TiltCard({
  children,
  className = "",
  glow = "#22d3ee",
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  const rx = useSpring(0, { stiffness: 190, damping: 20 });
  const ry = useSpring(0, { stiffness: 190, damping: 20 });
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${px}% ${py}%, color-mix(in oklab, ${glow} 20%, transparent), transparent 72%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    px.set(nx * 100);
    py.set(ny * 100);
    ry.set((nx - 0.5) * intensity * 2);
    rx.set((0.5 - ny) * intensity * 2);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    px.set(50);
    py.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX: fine ? rx : 0,
        rotateY: fine ? ry : 0,
        transformPerspective: 1100,
      }}
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
    </motion.div>
  );
}
