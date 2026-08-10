"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "01{}[]<>/\\$#&|=+-*_:;kubectlterraformdockeransible";

/** Falling-glyph canvas behind the hero. Purely decorative. */
export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip the second canvas entirely on phones.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const FONT = 14;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let columns: number[] = [];
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT}px ui-monospace, monospace`;
      columns = Array.from({ length: Math.ceil(width / FONT) }, () =>
        Math.floor((Math.random() * -height) / FONT),
      );
    };

    const draw = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);

      // Glyph rain reads better slower than 60Hz, and it costs less.
      if (now - last < 78) return;
      last = now;

      ctx.clearRect(0, 0, width, height);

      columns.forEach((y, i) => {
        const px = i * FONT;
        const py = y * FONT;
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

        ctx.fillStyle = "rgba(34, 211, 238, 0.75)";
        ctx.fillText(glyph, px, py);
        ctx.fillStyle = "rgba(34, 211, 238, 0.16)";
        ctx.fillText(glyph, px, py - FONT * 2);

        columns[i] = py > height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    // Visibility must be recomputed from both signals. The observer only fires
    // on a threshold crossing, so if it were the only way to resume, returning
    // to the tab with the hero still on screen would leave the canvas frozen on
    // its last painted frame for the rest of the session.
    let visible = false;

    const sync = () => {
      const shouldRun = visible && !document.hidden;
      if (shouldRun === running) return;
      running = shouldRun;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);

    document.addEventListener("visibilitychange", sync);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    resize();
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-[0.13]"
    />
  );
}
