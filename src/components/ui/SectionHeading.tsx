import { Reveal, RevealWords } from "@/components/ui/Reveal";

/**
 * Command-center section header. Left-aligned like a console readout: a mono
 * "path" prompt with a live status LED, the title, and a scanning hairline.
 * Props are unchanged from the old centered version so no caller needs editing.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  // The eyebrow doubles as a shell path segment, e.g. "skills" → "~/skills".
  const slug = eyebrow.trim().toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="max-w-3xl">
      <Reveal>
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-line bg-panel/60 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em]">
          <span
            className="led"
            style={{ ["--led" as string]: "var(--color-cyan)" }}
          />
          <span className="text-faint">esakki@portfolio</span>
          <span className="text-faint">:</span>
          <span className="text-cyan">~/{slug}</span>
          <span className="text-faint">$</span>
          <span className="text-muted uppercase">{eyebrow}</span>
        </span>
      </Reveal>

      <h2 className="mt-5 text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.85rem]">
        <RevealWords text={title} />
      </h2>

      {description && (
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted text-pretty">
            {description}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.18}>
        <div
          aria-hidden
          className="mt-7 h-px w-full bg-[linear-gradient(90deg,var(--color-cyan),color-mix(in_oklab,var(--color-cyan)_20%,transparent)_30%,transparent)] bg-[length:200%_100%]"
          style={{ animation: "line-sweep 7s linear infinite" }}
        />
      </Reveal>
    </div>
  );
}
