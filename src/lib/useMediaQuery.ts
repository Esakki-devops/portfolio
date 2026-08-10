"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query as an external store. useSyncExternalStore keeps the server
 * snapshot explicit, so there's no hydration mismatch and no post-mount flash.
 */
export function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True only for mouse/trackpad users who haven't asked for reduced motion. */
export function useFinePointer() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  return fine && !reduced;
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 768px)");
}
