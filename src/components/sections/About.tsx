"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { aboutTimeline } from "@/lib/data";
import { site } from "@/lib/site";

export function About() {
  const railRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 55%"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About"
        title="Keeping systems running, and learning to automate them"
        description="An electronics graduate working in IT support — Windows, Linux, networks and cloud — with a clear path toward DevOps."
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-5">
          <Reveal>
            <p className="text-lg leading-relaxed text-fg text-pretty">
              I&apos;m an {site.role} at Five Two Supports, where I keep
              desktops, servers and networks working for the people who depend
              on them every day.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="leading-relaxed text-muted text-pretty">
              That means Windows and Ubuntu administration, Active Directory and
              user access, backup verification, and tracking down the VPN, DNS,
              DHCP and hardware faults that stop people working. It&apos;s the
              kind of job where you learn how systems actually fail.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="leading-relaxed text-muted text-pretty">
              Alongside it I&apos;m building toward DevOps — running services in
              Docker, working through AWS fundamentals, serving with Nginx, and
              using Wazuh for log and security visibility. The goal is to move
              from fixing systems by hand to defining them in code.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7">
              {[
                { k: "Based in", v: site.location },
                { k: "Focus", v: "IT Support · Cloud · DevOps" },
                { k: "Education", v: "B.E. ECE, 2021–2025" },
                { k: "Open to", v: "DevOps & Cloud roles" },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">
                    {item.k}
                  </dt>
                  <dd className="mt-1 text-sm text-fg">{item.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <ol ref={railRef} className="relative space-y-8 pl-8">
          <div
            aria-hidden
            className="absolute top-1 left-[7px] h-full w-px bg-line"
          />
          <motion.div
            aria-hidden
            style={{ height: railHeight }}
            className="absolute top-1 left-[7px] w-px bg-[linear-gradient(to_bottom,var(--color-blue),var(--color-cyan))] shadow-[0_0_12px_var(--color-cyan)]"
          />

          {aboutTimeline.map((item, i) => (
            <li key={item.year} className="relative">
              <span
                aria-hidden
                className="absolute top-1.5 -left-8 grid size-3.5 place-items-center rounded-full border border-cyan/60 bg-ink"
              >
                <span className="size-1.5 rounded-full bg-cyan" />
              </span>
              <Reveal delay={i * 0.08}>
                <p className="font-mono text-xs tracking-[0.16em] text-cyan uppercase">
                  {item.year}
                </p>
                <h3 className="mt-1.5 text-base font-medium tracking-tight text-fg">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted text-pretty">
                  {item.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
