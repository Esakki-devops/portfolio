"use client";

import { useEffect, useRef, useState } from "react";
import { terminalScript } from "@/lib/data";
import { useReducedMotion } from "@/lib/useMediaQuery";

const TYPE_MS = 42;
const HOLD_AFTER_CMD = 480;
const HOLD_AFTER_OUT = 620;

const toneClass: Record<string, string> = {
  cyan: "text-cyan",
  blue: "text-blue",
  purple: "text-purple",
};

type Line = { kind: "cmd" | "out"; text: string; tone: string };

/** The whole script, shown at once when motion is reduced. */
const STATIC_LINES: Line[] = terminalScript.flatMap((s) => [
  { kind: "cmd" as const, text: s.cmd, tone: s.tone },
  { kind: "out" as const, text: s.out, tone: s.tone },
]);

/** Factual one-line fleet readout for the console status bar. */
const statusBar = [
  { label: "nodes", value: "4/4", tone: "text-ok" },
  { label: "mesh", value: "up", tone: "text-ok" },
  { label: "lb", value: "round-robin", tone: "text-cyan" },
  { label: "ci", value: "passing", tone: "text-ok" },
];

/** Live terminal console: types the command list on a loop, framed as a real
    monitoring shell with window chrome and a fleet status bar. */
export function TerminalWindow() {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion renders the full script directly (see `shownLines`)
    // instead of setting state here, which would cascade a render.
    if (reduced) return;

    const entry = terminalScript[step % terminalScript.length];
    let char = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      char += 1;
      setTyping(entry.cmd.slice(0, char));

      if (char >= entry.cmd.length) {
        clearInterval(interval);

        timeout = setTimeout(() => {
          setTyping("");
          setLines((prev) => {
            const next: Line[] = [
              ...prev,
              { kind: "cmd", text: entry.cmd, tone: entry.tone },
              { kind: "out", text: entry.out, tone: entry.tone },
            ];
            // Clear the log when the script wraps so it can't grow unbounded.
            return next.length > terminalScript.length * 2 ? [] : next;
          });

          timeout = setTimeout(() => setStep((s) => s + 1), HOLD_AFTER_OUT);
        }, HOLD_AFTER_CMD);
      }
    }, TYPE_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step, reduced]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  const shownLines: Line[] = reduced ? STATIC_LINES : lines;

  return (
    <div className="panel glow-ring corner-frame relative w-full overflow-hidden rounded-xl shadow-[0_30px_80px_-40px_#000]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <p className="ml-3 font-mono text-xs text-faint">
          esakki@platform: ~/infra
        </p>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-ok uppercase">
          <span className="led" /> live
        </span>
      </div>

      {/* Log */}
      <div
        ref={scrollRef}
        className="h-[18rem] overflow-hidden p-4 font-mono text-[13px] leading-relaxed sm:text-sm"
        aria-hidden
      >
        {shownLines.map((line, i) =>
          line.kind === "cmd" ? (
            <p key={i} className="text-fg">
              <span className="text-cyan">$ </span>
              {line.text}
            </p>
          ) : (
            <p
              key={i}
              className={`mb-2 ${toneClass[line.tone] ?? "text-muted"}`}
            >
              <span className="text-faint">↳ </span>
              {line.text}
            </p>
          ),
        )}

        {!reduced && (
          <p className="text-fg">
            <span className="text-cyan">$ </span>
            {typing}
            <span
              className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-cyan"
              style={{ animation: "caret 1s step-end infinite" }}
            />
          </p>
        )}
      </div>

      {/* Fleet status bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line bg-ink/40 px-4 py-2.5 font-mono text-[11px]">
        {statusBar.map((c) => (
          <span key={c.label} className="inline-flex items-center gap-1.5">
            <span className="text-faint">{c.label}</span>
            <span className={c.tone}>{c.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
