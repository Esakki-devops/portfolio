import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      // scroll-mt clears the fixed navbar when jumping to an anchor.
      className={`relative scroll-mt-24 px-6 py-24 sm:py-28 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** Command-line divider between sections — a hairline bus with a mono node. */
export function Divider() {
  return (
    <div aria-hidden className="mx-auto max-w-6xl px-6">
      <div className="flex items-center gap-3 opacity-60">
        <span
          className="h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--color-line-bright))]"
        />
        <span className="led" style={{ ["--led" as string]: "var(--color-cyan)" }} />
        <span className="font-mono text-[10px] tracking-[0.3em] text-faint uppercase">
          //
        </span>
        <span className="led" style={{ ["--led" as string]: "var(--color-purple)" }} />
        <span
          className="h-px flex-1 bg-[linear-gradient(90deg,var(--color-line-bright),transparent)]"
        />
      </div>
    </div>
  );
}
