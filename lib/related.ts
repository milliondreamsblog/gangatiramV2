/** Stable djb2 string hash — deterministic across builds and processes. */
function hashSeed(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Pick `count` consecutive items (wrapping) from a relevance-ordered pool,
 * starting at an offset derived from a stable hash of `seed` (the current
 * page's slug). The content corpus has near-uniform categories/tags, so a pure
 * "most similar" sort gives every page the same top matches — rotating by slug
 * instead spreads internal links across the whole archive while staying
 * deterministic for SSG.
 */
export function rotatedPick<T>(pool: T[], seed: string, count: number): T[] {
  if (pool.length <= count) return pool;
  const start = hashSeed(seed) % pool.length;
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}
