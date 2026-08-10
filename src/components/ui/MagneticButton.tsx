"use client";

import { useRef, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";
import { useFinePointer } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  download?: boolean;
  ariaLabel?: string;
};

/** Button that leans slightly toward the cursor. Transform-only. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "ghost",
  className = "",
  download = false,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();

  const x = useSpring(0, { stiffness: 260, damping: 18 });
  const y = useSpring(0, { stiffness: 260, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors",
    variant === "primary"
      ? "bg-[linear-gradient(100deg,var(--color-blue),var(--color-cyan))] text-[#03121f] hover:brightness-110"
      : "glass text-fg hover:bg-white/8",
    className,
  );

  const inner = (
    <>
      {children}
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_38px_-6px_var(--color-cyan)] transition-opacity duration-400 hover:opacity-100"
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        download={download || undefined}
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ x, y }}
        className={classes}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}
