/** Page tokens with ellipses, e.g. [1,2,3,'…',8,9,10]. Shared by the blog and
 *  agency listing grids. */
export function pageTokens(page: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, 2, count - 1, count, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

/** Canonical-friendly listing URL: default values (All / empty / page 1) are
 *  omitted so page 1 of the unfiltered list is the bare base path. */
export function listingHref(
  basePath: string,
  state: { category?: string; q?: string; page?: number },
): string {
  const sp = new URLSearchParams();
  if (state.category && state.category !== "All") sp.set("category", state.category);
  if (state.q) sp.set("q", state.q);
  if (state.page && state.page > 1) sp.set("page", String(state.page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
