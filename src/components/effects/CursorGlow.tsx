"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer, useIsDesktop } from "@/lib/useMediaQuery";

/** Cursor halo plus a ring that grows over interactive elements. */
export function CursorGlow() {
  const fine = useFinePointer();
  const wide = useIsDesktop();
  const [hot, setHot] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const gx = useSpring(x, { stiffness: 160, damping: 20 });
  const gy = useSpring(y, { stiffness: 160, damping: 20 });
  const rx = useSpring(x, { stiffness: 520, damping: 30 });
  const ry = useSpring(y, { stiffness: 520, damping: 30 });

  useEffect(() => {
    if (!fine || !wide) return;

    let frame = 0;
    let px = 0;
    let py = 0;
    let pending = false;

    const flush = () => {
      frame = 0;
      x.set(px);
      y.set(py);
      if (pending) {
        pending = false;
        const el = document.elementFromPoint(px, py) as HTMLElement | null;
        setHot(Boolean(el?.closest('a, button, [role="button"], input, textarea')));
      }
    };

    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      pending = true;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, [fine, wide, x, y]);

  if (!fine || !wide) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[60] size-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-blue)_16%,transparent),transparent_66%)]"
        style={{ x: gx, y: gy, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[61] rounded-full border border-cyan/60 transition-[width,height] duration-200"
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          width: hot ? 46 : 20,
          height: hot ? 46 : 20,
        }}
      />
    </>
  );
}
