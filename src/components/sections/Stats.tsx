import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/icons";
import { stats } from "@/lib/data";

export function Stats() {
  return (
    <section id="stats" className="relative px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <dl className="relative grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <span className="mx-auto grid size-10 place-items-center rounded-xl border border-line bg-white/5 text-cyan">
                  <Icon name={s.icon} className="size-4" />
                </span>
                <dd className="mt-3 text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-1.5 text-xs tracking-wide text-muted">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
