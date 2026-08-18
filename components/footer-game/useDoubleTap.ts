"use client";

import { useCallback, useRef } from "react";

export const DOUBLE_TAP_WINDOW_MS = 400;
export const DOUBLE_TAP_COUNT = 2;

export function registerClick(
  times: number[],
  now: number,
  windowMs: number = DOUBLE_TAP_WINDOW_MS,
  needed: number = DOUBLE_TAP_COUNT
): { times: number[]; triggered: boolean } {
  const kept = times.filter((t) => now - t < windowMs);
  kept.push(now);
  if (kept.length >= needed) return { times: [], triggered: true };
  return { times: kept, triggered: false };
}

export function useDoubleTap(
  onTrigger: () => void
): (e: { target: EventTarget | null }) => void {
  const timesRef = useRef<number[]>([]);
  return useCallback(
    (e: { target: EventTarget | null }) => {
      const el = e.target as Element | null;
      if (el && typeof el.closest === "function" && el.closest("a, button")) {
        return; // real links/buttons keep working
      }
      const res = registerClick(timesRef.current, Date.now());
      timesRef.current = res.times;
      if (res.triggered) onTrigger();
    },
    [onTrigger]
  );
}
