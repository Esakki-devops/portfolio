import { BadgeCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Icon } from "@/components/icons";
import { certifications } from "@/lib/data";

export function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading
        eyebrow="Certifications"
        title="Certifications and training"
        description="Completed programmes, plus the AWS Cloud Practitioner track I'm currently working through."
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => {
          const [from, to] = c.accent;
          return (
            <Reveal key={c.title} delay={(i % 3) * 0.07}>
              <TiltCard glow={from} className="h-full overflow-hidden p-6">
                <div
                  aria-hidden
                  className="absolute -top-14 -right-14 size-36 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                />

                <div className="flex items-start justify-between gap-3">
                  <span
                    className="grid size-11 place-items-center rounded-xl border border-line"
                    style={{
                      background: `color-mix(in oklab, ${from} 16%, transparent)`,
                      color: from,
                    }}
                  >
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                      c.status === "Certified"
                        ? "border-cyan/40 bg-cyan/10 text-cyan"
                        : "border-line bg-white/4 text-muted"
                    }`}
                  >
                    {c.status === "Certified" && <BadgeCheck className="size-3" />}
                    {c.status}
                  </span>
                </div>

                <h3 className="mt-5 text-base leading-snug font-medium tracking-tight text-fg text-balance">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{c.issuer}</p>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
