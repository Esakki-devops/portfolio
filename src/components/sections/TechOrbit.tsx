"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { orbitTech } from "@/lib/data";

// Ring diameters are fractions of --orbit so the whole system scales with the
// viewport instead of overflowing narrow screens at a fixed pixel radius.
// Ring 0 must clear the centre hub (0.23 of --orbit), so its radius stays
// comfortably outside the hub's 0.115 radius.
const RINGS = [
  { scale: 0.48, duration: 26 },
  { scale: 0.68, duration: 38, reverse: true },
  { scale: 0.88, duration: 52 },
];

const diameter = (s: number) => `calc(var(--orbit) * ${s})`;
const radiusNeg = (s: number) => `calc(var(--orbit) * ${s} / -2)`;

export function TechOrbit() {
  return (
    <section id="stack" className="relative scroll-mt-24 px-6 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Technology"
          title="The tools I reach for"
          description="Systems, cloud, containers and monitoring — the stack behind my support work and personal projects."
        />

        <Reveal className="mt-14 flex justify-center">
          <div
            className="relative grid size-[var(--orbit)] place-items-center"
            style={{ ["--orbit" as string]: "min(30rem, 82vw)" }}
            role="img"
            aria-label={`Technology stack: ${orbitTech.map((t) => t.name).join(", ")}`}
          >
            <div
              aria-hidden
              className="absolute size-56 rounded-full bg-blue/14 blur-[70px]"
            />

            {RINGS.map((ring, ri) => (
              <div
                key={ri}
                aria-hidden
                className="absolute rounded-full border border-line"
                style={{ width: diameter(ring.scale), height: diameter(ring.scale) }}
              />
            ))}

            {RINGS.map((ring, ri) => {
              const items = orbitTech.filter((t) => t.ring === ri);
              return (
                <motion.div
                  key={ri}
                  className="absolute"
                  style={{ width: diameter(ring.scale), height: diameter(ring.scale) }}
                  animate={{ rotate: ring.reverse ? -360 : 360 }}
                  transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
                >
                  {items.map((tech, i) => {
                    const angle = (i / items.length) * 360;
                    return (
                      <div
                        key={tech.name}
                        className="absolute top-1/2 left-1/2 size-0"
                        style={{
                          transform: `rotate(${angle}deg) translateY(${radiusNeg(ring.scale)})`,
                        }}
                      >
                        {/* Cancels both the ring's spin and this item's own
                            positioning angle, so labels stay upright.
                            Deliberately NOT .glass: a backdrop-filter on a
                            continuously rotating element forces the browser to
                            re-blur the region behind it every frame, twelve
                            times over. At this chip size the blur is invisible
                            anyway, so a flat fill costs nothing visually. */}
                        <motion.span
                          className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border bg-white/6 px-2.5 py-1.5 font-mono text-[10px] whitespace-nowrap sm:text-[11px]"
                          style={{
                            color: tech.color,
                            borderColor: `color-mix(in oklab, ${tech.color} 35%, transparent)`,
                            boxShadow: `0 0 24px -8px ${tech.color}`,
                          }}
                          initial={{ rotate: -angle }}
                          animate={{ rotate: ring.reverse ? -angle + 360 : -angle - 360 }}
                          transition={{
                            duration: ring.duration,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          {tech.name}
                        </motion.span>
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}

            {/* Scales with the orbit. Pinned at a fixed 112px it was wider than
                ring 0 on phones, burying the inner labels underneath. */}
            <div className="glass relative z-10 grid size-[calc(var(--orbit)*0.23)] place-items-center rounded-full text-center">
              <div>
                <p className="text-[0.6rem] tracking-[0.2em] text-faint uppercase sm:text-xs">
                  Dev
                </p>
                <p className="text-base font-semibold text-gradient sm:text-lg">
                  Ops
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
