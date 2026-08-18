import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getHighScore,
  setHighScore,
  getMuted,
  setMuted,
} from "@/components/footer-game/storage";

function mockStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: () => null,
    length: 0,
  } as unknown as Storage;
}

beforeEach(() => {
  vi.stubGlobal("localStorage", mockStorage());
});

describe("high score", () => {
  it("defaults to 0", () => {
    expect(getHighScore()).toBe(0);
  });
  it("persists only when higher", () => {
    setHighScore(50);
    expect(getHighScore()).toBe(50);
    setHighScore(20);
    expect(getHighScore()).toBe(50);
    setHighScore(80);
    expect(getHighScore()).toBe(80);
  });
});

describe("muted", () => {
  it("defaults to false and round-trips", () => {
    expect(getMuted()).toBe(false);
    setMuted(true);
    expect(getMuted()).toBe(true);
  });
});

describe("safety", () => {
  it("never throws when localStorage is unavailable", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(() => setHighScore(10)).not.toThrow();
    expect(getHighScore()).toBe(0);
    expect(getMuted()).toBe(false);
  });
});
