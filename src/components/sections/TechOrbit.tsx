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

/**
 * Desktop shows the animated orbit; mobile shows a static chip grid instead.
 * The two are toggled purely by breakpoint (`hidden md:flex` / `md:hidden`), so
 * the orbit is `display:none` on phones — its CSS spin animations never tick and
 * cost nothing there — and there's no JS/hydration swap. No "use client" needed.
 */
export function TechOrbit() {
  return (
    <section id="stack" className="relative scroll-mt-24 px-6 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Technology"
          title="The tools I reach for"
          description="Systems, cloud, containers and monitoring — the stack behind my support work and personal projects."
        />

        {/* Mobile: static HUD grid of the stack. */}
        <Reveal className="mt-12 md:hidden">
          <ul className="mx-auto grid max-w-md grid-cols-2 gap-2.5 sm:grid-cols-3">
            {orbitTech.map((tech) => (
              <li
                key={tech.name}
                className="panel flex items-center gap-2 rounded-md px-2.5 py-2.5 font-mono text-[11px]"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{
                    background: tech.color,
                    boxShadow: `0 0 8px -1px ${tech.color}`,
                  }}
                />
                <span className="truncate text-fg">{tech.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Desktop: animated orbit. */}
        <Reveal className="mt-14 hidden justify-center md:flex">
          <div
            className="relative grid size-[var(--orbit)] place-items-center"
            style={{ ["--orbit" as string]: "min(32rem, 70vw)" }}
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
              // Ring spin + label counter-spin are plain CSS animations
              // (spin-slow keyframe) — compositor-only, no per-frame JS. The
              // counter-spin cancels the ring's rotation; the inner static
              // rotate(-angle) keeps each label upright. (reduced-motion halts.)
              const spin = `spin-slow ${ring.duration}s linear infinite${
                ring.reverse ? " reverse" : ""
              }`;
              const counter = `spin-slow ${ring.duration}s linear infinite${
                ring.reverse ? "" : " reverse"
              }`;
              return (
                <div
                  key={ri}
                  aria-hidden
                  className="absolute"
                  style={{
                    width: diameter(ring.scale),
                    height: diameter(ring.scale),
                    animation: spin,
                    willChange: "transform",
                  }}
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
                        <div className="absolute -translate-x-1/2 -translate-y-1/2">
                          <span
                            className="block"
                            style={{ animation: counter, willChange: "transform" }}
                          >
                            <span
                              className="block rounded-lg border bg-white/6 px-2.5 py-1.5 font-mono text-[11px] whitespace-nowrap"
                              style={{
                                transform: `rotate(${-angle}deg)`,
                                color: tech.color,
                                borderColor: `color-mix(in oklab, ${tech.color} 35%, transparent)`,
                                boxShadow: `0 0 24px -8px ${tech.color}`,
                              }}
                            >
                              {tech.name}
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

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
