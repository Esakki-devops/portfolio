import { Reveal, RevealWords } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          <span className="size-1.5 rounded-full bg-cyan" />
          {eyebrow}
        </span>
      </Reveal>

      <h2 className="mt-5 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
        <RevealWords text={title} />
      </h2>

      {description && (
        <Reveal delay={0.12}>
          <p className="mt-4 leading-relaxed text-muted text-pretty">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
