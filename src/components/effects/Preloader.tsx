"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useMediaQuery";
import { Avatar } from "@/components/ui/Avatar";

const BOOT_LINES = [
  "checking services",
  "mounting volumes",
  "starting containers",
  "system ready",
];

const DURATION = 1900;

/** Boot sequence shown once on first paint. */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  // `done` MUST stay in the dependency list. Without it the effect never
  // re-runs, its cleanup never fires, and the scroll lock below survives for
  // the entire session — which silently kills touch and keyboard scrolling.
  // (Lenis hides this on desktop by scrolling programmatically on wheel, so
  // it looks fine on a laptop and is completely broken on a phone.)
  useEffect(() => {
    if (reduced || done) return;

    document.body.style.overflow = "hidden";

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setProgress(t * 100);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDone(true);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [reduced, done]);

  const activeLine = Math.min(
    BOOT_LINES.length - 1,
    Math.floor((progress / 100) * BOOT_LINES.length),
  );

  return (
    <AnimatePresence>
      {!done && !reduced && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-label="Loading portfolio"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-7"
          >
            <div className="relative grid size-24 place-items-center">
              <div className="absolute inset-0 rounded-full border border-line" />
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan border-r-blue"
                style={{ animation: "spin-slow 1s linear infinite" }}
              />
              <div className="absolute inset-3 rounded-full bg-blue/20 blur-xl" />
              <Avatar size={56} eager ring={false} />
            </div>

            <div className="h-px w-56 overflow-hidden bg-line">
              <div
                className="h-full bg-[linear-gradient(90deg,var(--color-blue),var(--color-cyan),var(--color-purple))]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
              {BOOT_LINES[activeLine]}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
