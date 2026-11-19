import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/icons";
import { stats } from "@/lib/data";

export function Stats() {
  return (
    <section id="stats" className="relative px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="panel group relative overflow-hidden rounded-lg px-5 py-5"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-md border border-line bg-cyan/5 text-cyan">
                    <Icon name={s.icon} className="size-4" />
                  </span>
                  <span className="led" />
                </div>
                <dd className="mt-4 text-3xl font-semibold tracking-tight text-gradient tabular-nums sm:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-1 font-mono text-[11px] tracking-[0.1em] text-faint uppercase">
                  {s.label}
                </dt>
                {/* Thin activity bar at the base. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-cyan),transparent)] bg-[length:200%_100%] opacity-60"
                  style={{ animation: "line-sweep 6s linear infinite" }}
                />
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
