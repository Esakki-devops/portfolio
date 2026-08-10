"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/icons";
import { experience } from "@/lib/data";

const kindLabels = {
  work: "Full-time",
  internship: "Internship",
  education: "Education",
} as const;

const kindStyles = {
  work: "border-cyan/40 bg-cyan/10 text-cyan",
  internship: "border-purple/40 bg-purple/10 text-purple",
  education: "border-blue/40 bg-blue/10 text-blue",
} as const;

export function Experience() {
  const railRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Experience"
        title="Work, internship and education"
        description="From hardware diagnostics and an electronics degree to supporting production systems day to day."
      />

      <ol ref={railRef} className="relative mt-16 space-y-6 pl-12 sm:pl-16">
        <div
          aria-hidden
          className="absolute top-2 left-[15px] h-full w-px bg-line sm:left-[23px]"
        />
        <motion.div
          aria-hidden
          style={{ height: railHeight }}
          className="absolute top-2 left-[15px] w-px bg-[linear-gradient(to_bottom,var(--color-blue),var(--color-cyan),var(--color-purple))] shadow-[0_0_12px_var(--color-cyan)] sm:left-[23px]"
        />

        {experience.map((job, i) => (
          <li key={`${job.company}-${job.role}`} className="relative">
            <span
              aria-hidden
              className="glass absolute top-1 -left-12 grid size-8 place-items-center rounded-xl text-cyan sm:-left-16 sm:size-11"
            >
              <Icon name={job.icon} className="size-4" />
            </span>

            <Reveal delay={i * 0.06}>
              <article className="glass glow-ring rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-medium tracking-tight text-fg sm:text-lg">
                      {job.role}
                    </h3>
                    <p className="mt-1 text-sm text-cyan">{job.company}</p>
                    <p className="mt-0.5 font-mono text-xs text-faint">
                      {job.period} · {job.location}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] tracking-wider uppercase ${kindStyles[job.kind]}`}
                  >
                    {kindLabels[job.kind]}
                  </span>
                </div>

                <ul className="mt-4 space-y-2">
                  {job.achievements.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue"
                      />
                      <span className="text-pretty">{point}</span>
                    </li>
                  ))}
                </ul>

                {job.tech.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {job.tech.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line bg-white/4 px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
