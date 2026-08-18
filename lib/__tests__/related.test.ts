import { describe, it, expect } from "vitest";
import { rotatedPick } from "@/lib/related";

const POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("rotatedPick", () => {
  it("returns the whole pool unchanged when pool.length <= count", () => {
    expect(rotatedPick([1, 2], "x", 3)).toEqual([1, 2]);
    expect(rotatedPick([1, 2, 3], "x", 3)).toEqual([1, 2, 3]);
  });
  it("returns exactly `count` items drawn from the pool", () => {
    const picked = rotatedPick(POOL, "some-slug", 3);
    expect(picked).toHaveLength(3);
    expect(picked.every((n) => POOL.includes(n))).toBe(true);
    expect(new Set(picked).size).toBe(3); // consecutive, no repeats when count < pool
  });
  it("is deterministic for the same seed", () => {
    expect(rotatedPick(POOL, "abc", 3)).toEqual(rotatedPick(POOL, "abc", 3));
  });
  it("picks consecutive items (wrapping) from the hash-derived offset", () => {
    // hashSeed('a') % 10 === 0 → starts at index 0
    expect(rotatedPick(POOL, "a", 3)).toEqual([1, 2, 3]);
  });
  it("wraps around the end of the pool", () => {
    const picked = rotatedPick(POOL, "abc", 3);
    const start = POOL.indexOf(picked[0]);
    expect(picked).toEqual([
      POOL[start % 10],
      POOL[(start + 1) % 10],
      POOL[(start + 2) % 10],
    ]);
  });
  it("spreads different seeds across different offsets (not all identical)", () => {
    const seeds = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"];
    const firsts = new Set(seeds.map((s) => rotatedPick(POOL, s, 3)[0]));
    expect(firsts.size).toBeGreaterThan(1);
  });
});
