"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
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

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => (
          <Reveal key={cat.title} delay={(i % 3) * 0.07}>
            <TiltCard className="h-full p-6" glow="#22d3ee" intensity={6}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl border border-line bg-white/5 text-cyan">
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
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-blue),var(--color-cyan))]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{
                          duration: 1.1,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.1,
                        }}
                      />
                    </div>
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
