"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view for nav highlighting.
 *
 * Uses a probe line a third of the way down the viewport rather than an
 * IntersectionObserver, because sections here differ wildly in height and
 * "whichever crosses the probe last" matches what a reader perceives as
 * current. The last section also wins outright once the page is bottomed out,
 * otherwise a short final section can never become active.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;

      const probe = window.scrollY + window.innerHeight / 3;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}
