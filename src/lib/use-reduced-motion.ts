/** use-reduced-motion.ts subscribes to the browser's live motion preference. */
"use client";

import { useSyncExternalStore } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Subscribes the supplied callback to preference changes and returns its cleanup. */
function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Takes no arguments and returns the current browser motion preference. */
function getSnapshot() {
  return window.matchMedia(MOTION_QUERY).matches;
}

/** Takes no arguments and returns the hydration fallback preference. */
function getServerSnapshot() {
  return false;
}

/** Takes no arguments and returns whether the user currently requests reduced motion. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
