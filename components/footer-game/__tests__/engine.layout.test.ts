import { describe, it, expect } from "vitest";
import { buildBricks } from "@/components/footer-game/engine";
import { buildWordGrid } from "@/components/footer-game/glyphs";

const FIELD = { w: 1000, h: 600 };

describe("buildBricks", () => {
  it("creates exactly one brick per lit cell", () => {
    const grid = buildWordGrid();
    const lit = grid.flat().reduce((a, b) => a + b, 0);
    expect(buildBricks(grid, FIELD).length).toBe(lit);
  });

  it("keeps every brick inside the field and in the top 60%", () => {
    const bricks = buildBricks(buildWordGrid(), FIELD);
    for (const b of bricks) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w).toBeLessThanOrEqual(FIELD.w + 0.001);
      expect(b.y + b.h).toBeLessThanOrEqual(FIELD.h * 0.6 + 0.001);
      expect(b.alive).toBe(true);
    }
  });

  // A wide, short field would otherwise size cells from width alone and push
  // the wordmark down onto the paddle.
  it("clamps the band into the top 60% even on a wide, short field", () => {
    const wide = { w: 2400, h: 420 };
    const bricks = buildBricks(buildWordGrid(), wide);
    for (const b of bricks) {
      expect(b.y + b.h).toBeLessThanOrEqual(wide.h * 0.6 + 0.001);
    }
  });

  it("is horizontally centered", () => {
    const bricks = buildBricks(buildWordGrid(), FIELD);
    const minX = Math.min(...bricks.map((b) => b.x));
    const maxX = Math.max(...bricks.map((b) => b.x + b.w));
    const leftGap = minX;
    const rightGap = FIELD.w - maxX;
    expect(Math.abs(leftGap - rightGap)).toBeLessThan(1);
  });
});
