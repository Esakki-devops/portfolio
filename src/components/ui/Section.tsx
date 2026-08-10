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

/** Animated hairline between sections. */
export function Divider() {
  return (
    <div aria-hidden className="mx-auto max-w-6xl px-6">
      <div
        className="h-px w-full bg-[linear-gradient(90deg,transparent,var(--color-blue),var(--color-cyan),var(--color-purple),transparent)] bg-[length:200%_100%] opacity-45"
        style={{ animation: "line-sweep 9s linear infinite" }}
      />
    </div>
  );
}
