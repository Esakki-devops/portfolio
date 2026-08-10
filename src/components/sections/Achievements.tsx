import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Icon } from "@/components/icons";
import { achievements } from "@/lib/data";

export function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeading
        eyebrow="Achievements"
        title="Beyond the job description"
        description="Volunteering, community work and the activities that shaped how I work with people and pressure."
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item, i) => {
          const [from, to] = item.accent;
          return (
            <Reveal key={item.title} delay={(i % 3) * 0.07}>
              <TiltCard glow={from} intensity={6} className="h-full overflow-hidden p-6">
                <div
                  aria-hidden
                  className="absolute -top-16 -right-16 size-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                />

                <div className="flex items-start justify-between gap-4">
                  <span
                    className="grid size-11 place-items-center rounded-xl border border-line"
                    style={{
                      background: `color-mix(in oklab, ${from} 16%, transparent)`,
                      color: from,
                    }}
                  >
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <span className="rounded-full border border-line bg-white/4 px-2.5 py-1 text-[10px] tracking-wider text-muted uppercase">
                    {item.group}
                  </span>
                </div>

                <h3 className="mt-5 text-base leading-snug font-medium tracking-tight text-fg text-balance">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {item.detail}
                </p>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
