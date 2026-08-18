"use client";

import { useSyncExternalStore } from "react";

const QUERIES = ["(hover: hover)", "(pointer: fine)"] as const;

function subscribe(onChange: () => void) {
  const mqs = QUERIES.map((q) => window.matchMedia(q));
  mqs.forEach((mq) => mq.addEventListener("change", onChange));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", onChange));
}

// Both conditions, deliberately: some phones report `hover: hover`, and
// trusting that alone hid the play button on those devices entirely. A real
// pointer device also reports a fine pointer.
const getSnapshot = () => QUERIES.every((q) => window.matchMedia(q).matches);

/**
 * True on pointer devices, false on touch-only ones. Drives both the footer's
 * "Click to Play" chip (which must stay visible where there is no hover) and
 * the game's start hint copy. Server snapshot assumes hover.
 */
export function useCanHover(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
