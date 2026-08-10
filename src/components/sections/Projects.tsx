"use client";

import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Icon, GithubIcon } from "@/components/icons";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { projects, type Project } from "@/lib/data";

function ProjectCard({ p }: { p: Project }) {
  const [from, to] = p.accent;

  return (
    <TiltCard className="h-full p-6" glow={from}>
      {/* Stand-in for a screenshot: a gradient plate with the project glyph. */}
      <div
        className="relative mb-5 grid h-32 place-items-center overflow-hidden rounded-xl border border-line"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${from} 22%, transparent), color-mix(in oklab, ${to} 14%, transparent))`,
        }}
      >
        <div
          aria-hidden
          className="grid-bg absolute inset-0 opacity-30"
        />
        <span
          className="relative grid size-12 place-items-center rounded-xl border border-line bg-ink/50"
          style={{ color: from }}
        >
          <Icon name={p.icon} className="size-6" />
        </span>

        {p.featured && (
          <span className="absolute top-2.5 left-2.5 rounded-full border border-line bg-ink/70 px-2.5 py-1 text-[10px] tracking-wider text-cyan uppercase">
            Featured
          </span>
        )}

        <dl className="absolute bottom-2.5 right-2.5 flex gap-3">
          {p.stats.map((s) => (
            <div key={s.label} className="text-right">
              <dd className="font-mono text-xs font-medium text-fg">{s.value}</dd>
              <dt className="text-[10px] tracking-wider text-faint uppercase">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <h3 className="text-base font-medium tracking-tight text-fg">{p.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
        {p.summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {p.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-line bg-white/4 px-2.5 py-1 font-mono text-[11px] text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-4 border-t border-line pt-4">
        {p.repo ? (
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-cyan"
            aria-label={`${p.title} source on GitHub`}
          >
            <GithubIcon className="size-3.5" />
            View code
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-faint">
            <GithubIcon className="size-3.5" />
            Repository not published
          </span>
        )}
        <ArrowUpRight className="ml-auto size-4 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
      </div>
    </TiltCard>
  );
}

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        description="Monitoring, containers and telephony from work and study, plus IoT systems from my engineering degree."
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.07}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>

      <GitHubActivity />
    </Section>
  );
}
