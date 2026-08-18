import { describe, it, expect } from "vitest";
import { pageTokens, listingHref } from "@/lib/pagination";

describe("pageTokens", () => {
  it("returns every page when count <= 7 (no ellipsis)", () => {
    expect(pageTokens(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageTokens(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
  it("collapses the middle with a single ellipsis near the start", () => {
    expect(pageTokens(1, 10)).toEqual([1, 2, "…", 9, 10]);
  });
  it("shows ellipses on both sides for a middle page", () => {
    expect(pageTokens(5, 10)).toEqual([1, 2, "…", 4, 5, 6, "…", 9, 10]);
  });
  it("never emits out-of-range or duplicate tokens", () => {
    const toks = pageTokens(10, 10);
    const nums = toks.filter((t): t is number => t !== "…");
    expect(nums.every((n) => n >= 1 && n <= 10)).toBe(true);
    expect(new Set(nums).size).toBe(nums.length);
  });
});

describe("listingHref", () => {
  it("omits default state (All / empty q / page 1) → bare base path", () => {
    expect(listingHref("/blogs", { category: "All", q: "", page: 1 })).toBe("/blogs");
    expect(listingHref("/blogs", {})).toBe("/blogs");
  });
  it("includes non-default category and page", () => {
    expect(listingHref("/blogs", { category: "Design", page: 2 })).toBe(
      "/blogs?category=Design&page=2",
    );
  });
  it("includes q and URL-encodes it", () => {
    expect(listingHref("/ux-agencies", { q: "b2b saas" })).toBe(
      "/ux-agencies?q=b2b+saas",
    );
  });
  it("omits page=1 even when a category is set", () => {
    expect(listingHref("/blogs", { category: "UX", page: 1 })).toBe(
      "/blogs?category=UX",
    );
  });
});
