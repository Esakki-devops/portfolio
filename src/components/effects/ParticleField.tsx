"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DISTANCE = 120;
const LINK_SQ = LINK_DISTANCE * LINK_DISTANCE;
const CELL = LINK_DISTANCE; // spatial hash cell == link radius

/**
 * Canvas particle constellation with cursor repulsion.
 *
 * Linking uses a uniform spatial grid rather than comparing every pair — the
 * naive O(n^2) version burned ~6k distance checks per frame and was the main
 * source of scroll jank on the hero.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Decorative only — not worth the battery on phones.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.round((width * height) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r: Math.random() * 1.3 + 0.6,
      }));
    };

    const draw = () => {
      if (!running) return;
      raf = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, width, height);

      const cols = Math.max(1, Math.ceil(width / CELL));
      const rows = Math.max(1, Math.ceil(height / CELL));
      const grid: number[][] = Array.from({ length: cols * rows }, () => []);

      // All dots share one path and one fill.
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 14400 && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const push = (120 - dist) / 120;
          p.x += (dx / dist) * push * 1.5;
          p.y += (dy / dist) * push * 1.5;
        }

        const cx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / CELL)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / CELL)));
        grid[cy * cols + cx].push(i);

        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(148, 190, 255, 0.45)";
      ctx.fill();

      // Compare against the current cell plus four already-visited neighbours,
      // so each pair is considered exactly once.
      ctx.lineWidth = 0.6;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const bucket = grid[cy * cols + cx];
          if (bucket.length === 0) continue;

          for (let n = 0; n < 5; n++) {
            const nx = cx + [0, 1, -1, 0, 1][n];
            const ny = cy + [0, 0, 1, 1, 1][n];
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;

            const other = grid[ny * cols + nx];
            const sameCell = n === 0;

            for (let a = 0; a < bucket.length; a++) {
              for (let b = sameCell ? a + 1 : 0; b < other.length; b++) {
                const p1 = particles[bucket[a]];
                const p2 = particles[other[b]];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dSq = dx * dx + dy * dy;
                if (dSq > LINK_SQ) continue;

                ctx.strokeStyle = `rgba(90, 150, 240, ${
                  (1 - Math.sqrt(dSq) / LINK_DISTANCE) * 0.18
                })`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
      }
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    // Don't burn frames once the hero scrolls away or the tab is hidden.
    // `visible` has to be tracked separately: the observer only fires on a
    // threshold crossing, so on tab refocus it cannot tell us the canvas is
    // still off-screen, and an unguarded start() would run the loop forever.
    let visible = false;

    const sync = () => {
      if (visible && !document.hidden) start();
      else stop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    document.addEventListener("visibilitychange", sync);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(seed, 150);
    };

    seed();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stop();
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-70"
    />
  );
}
