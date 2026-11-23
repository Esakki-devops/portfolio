"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { SkillBar } from "@/components/sections/SkillBar";
import { Icon } from "@/components/icons";
import { skillCategories } from "@/lib/data";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="What I work with"
        description="Tools I use in support work day to day, plus the cloud and container skills I'm actively building. Levels are honest self-assessments, not exam scores."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {skillCategories.map((cat, i) => (
          <Reveal key={cat.title} delay={(i % 2) * 0.08}>
            <TiltCard className="h-full p-6" glow="#22d3ee" intensity={6}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md border border-line bg-cyan/5 text-cyan">
                  <Icon name={cat.icon} className="size-5" />
                </span>
                <h3 className="text-base font-medium tracking-tight text-fg">
                  {cat.title}
                </h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
                {cat.blurb}
              </p>

              <ul className="mt-5 space-y-3.5">
                {cat.skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-fg">{skill.name}</span>
                      <span className="font-mono text-[11px] text-faint tabular-nums">
                        {skill.level}%
                      </span>
                    </div>
                    <SkillBar level={skill.level} />
                  </li>
                ))}
              </ul>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
