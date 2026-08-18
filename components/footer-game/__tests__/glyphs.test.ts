import { describe, it, expect } from "vitest";
import { GLYPHS, GLYPH_ROWS, WORD, buildWordGrid } from "@/components/footer-game/glyphs";

describe("glyphs", () => {
  it("every glyph is GLYPH_ROWS tall with rectangular rows", () => {
    for (const [ch, rows] of Object.entries(GLYPHS)) {
      expect(rows.length, `${ch} height`).toBe(GLYPH_ROWS);
      const w = rows[0].length;
      for (const r of rows) expect(r.length, `${ch} row width`).toBe(w);
    }
  });

  it("has a glyph for every distinct letter in the word", () => {
    for (const ch of new Set(WORD.split(""))) {
      expect(GLYPHS[ch], `missing glyph ${ch}`).toBeDefined();
    }
  });

  it("assembles the word into a 0/1 grid GLYPH_ROWS tall", () => {
    const grid = buildWordGrid();
    expect(grid.length).toBe(GLYPH_ROWS);
    const width = grid[0].length;
    for (const row of grid) {
      expect(row.length).toBe(width);
      for (const cell of row) expect(cell === 0 || cell === 1).toBe(true);
    }
    // width == sum(glyph widths) + 1-col gaps between letters
    const widths = WORD.split("").map((c) => GLYPHS[c][0].length);
    const expected = widths.reduce((a, b) => a + b, 0) + (WORD.length - 1);
    expect(width).toBe(expected);
  });

  it("contains at least one lit cell (non-empty word)", () => {
    const grid = buildWordGrid();
    const lit = grid.flat().reduce((a, b) => a + b, 0);
    expect(lit).toBeGreaterThan(0);
  });
});
