"use client";

import { motion } from "framer-motion";
import { Download, FolderGit2, Mail } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Avatar } from "@/components/ui/Avatar";
import { ParticleField } from "@/components/effects/ParticleField";
import { CodeRain } from "@/components/effects/CodeRain";
import { TerminalWindow } from "@/components/sections/TerminalWindow";
import { site } from "@/lib/site";
import { useReducedMotion } from "@/lib/useMediaQuery";

const rise = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Factual command-center readouts — all true of the real fleet. */
const hud = [
  { k: "nodes", v: "4" },
  { k: "mesh", v: "WireGuard" },
  { k: "pipeline", v: "CI/CD" },
  { k: "uptime", v: "24/7" },
];

export function Hero() {
  const reduced = useReducedMotion();
  // Let the preloader finish before the hero animates in.
  const introDelay = reduced ? 0 : 2.15;

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-28 pb-20"
    >
      <ParticleField />
      <CodeRain />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.11, delayChildren: introDelay } },
          }}
          className="flex flex-col items-start gap-6"
        >
          <motion.div
            variants={rise}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <Avatar size={52} eager />
            <span className="inline-flex items-center gap-2.5 rounded-md border border-line bg-panel/60 px-3.5 py-2 font-mono text-xs tracking-tight text-muted">
              <span className="led" />
              open to DevOps &amp; Cloud roles
            </span>
          </motion.div>

          <div className="space-y-3">
            <motion.p
              variants={rise}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-sm text-cyan"
            >
              <span className="text-faint">$</span> whoami
            </motion.p>

            <motion.h1
              variants={rise}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              <span className="text-gradient">{site.name}</span>
            </motion.h1>

            <motion.p
              variants={rise}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pt-1 font-mono text-lg tracking-tight text-fg sm:text-2xl"
            >
              {site.roleLong}
              <span
                className="ml-1 inline-block h-5 w-2.5 translate-y-0.5 bg-cyan align-middle"
                style={{ animation: "caret 1.1s step-end infinite" }}
              />
            </motion.p>
          </div>

          <motion.p
            variants={rise}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg"
          >
            {site.tagline}
          </motion.p>

          {/* HUD stat strip — the "super DevOps" readout. */}
          <motion.dl
            variants={rise}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid w-full max-w-xl grid-cols-4 overflow-hidden rounded-lg border border-line bg-panel/50 font-mono"
          >
            {hud.map((h, i) => (
              <div
                key={h.k}
                className={`px-3 py-3 ${i > 0 ? "border-l border-line" : ""}`}
              >
                <dd className="text-lg font-semibold text-cyan sm:text-xl">
                  {h.v}
                </dd>
                <dt className="mt-0.5 text-[10px] tracking-[0.12em] text-faint uppercase">
                  {h.k}
                </dt>
              </div>
            ))}
          </motion.dl>

          <motion.div
            variants={rise}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3"
          >
            <MagneticButton href={site.resumeHref} download variant="primary">
              <Download className="size-4" />
              resume.pdf
            </MagneticButton>
            <MagneticButton href="#projects">
              <FolderGit2 className="size-4" />
              ./projects
            </MagneticButton>
            <MagneticButton href="#contact">
              <Mail className="size-4" />
              ./contact
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1,
            delay: introDelay + 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <TerminalWindow />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: introDelay + 0.9 }}
        className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-2 text-faint"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
          scroll
        </span>
        <span className="h-9 w-px bg-[linear-gradient(to_bottom,var(--color-cyan),transparent)]" />
      </motion.div>
    </section>
  );
}
