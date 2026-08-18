import { describe, it, expect } from "vitest";
import { registerClick, DOUBLE_TAP_WINDOW_MS } from "@/components/footer-game/useDoubleTap";

describe("registerClick (double tap)", () => {
  it("triggers on two clicks within the window", () => {
    let s = registerClick([], 0);
    expect(s.triggered).toBe(false);
    s = registerClick(s.times, 100);
    expect(s.triggered).toBe(true);
    expect(s.times).toEqual([]); // reset after trigger
  });

  it("does not trigger when the two clicks are spaced beyond the window", () => {
    let s = registerClick([], 0);
    s = registerClick(s.times, DOUBLE_TAP_WINDOW_MS + 100);
    expect(s.triggered).toBe(false);
    expect(s.times.length).toBe(1); // only the last click remains in-window
  });

  it("drops stale timestamps outside the window", () => {
    let s = registerClick([], 0);
    s = registerClick(s.times, DOUBLE_TAP_WINDOW_MS * 3); // first click now stale
    expect(s.triggered).toBe(false);
    expect(s.times).toEqual([DOUBLE_TAP_WINDOW_MS * 3]);
  });
});
