"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useMediaQuery";

/**
 * Proficiency bar. The fill width is a plain CSS width in `%` (never a framer
 * px→% tween, which could fail to interpolate and leave the bar stuck blank).
 * It grows when scrolled into view, and — as a safety net if the observer never
 * fires on some mobile scroll setups — also after a short mount timeout, so the
 * bar is never left empty. Reduced-motion users get the final width instantly.
 */
export function SkillBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (reduced || inView) {
      setFilled(true);
      return;
    }
    const t = setTimeout(() => setFilled(true), 1400);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  return (
    <div
      ref={ref}
      className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]"
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-blue),var(--color-cyan))] shadow-[0_0_10px_-1px_var(--color-cyan)] motion-safe:transition-[width] motion-safe:duration-[1100ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: filled ? `${level}%` : "0%" }}
      />
    </div>
  );
}
