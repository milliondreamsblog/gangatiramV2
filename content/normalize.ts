/** Collapse author-slug variants to a known author; unknown/blank → "sid". */
export function normalizeAuthor(a: string): string {
  const known = new Set(["sid"]);
  const s = (a || "").trim().toLowerCase();
  return known.has(s) ? s : "sid";
}

/** "10 Min Read" -> "10 min read"; blank -> computed at ~200 wpm (min 1). */
export function normalizeReadTime(raw: string, wordCount: number): string {
  const match = (raw || "").match(/\d+/);
  const n = match ? parseInt(match[0], 10) : Math.max(1, Math.round(wordCount / 200));
  return `${n} min read`;
}

/** "2026-06-23" -> "Jun 23, 2026" (UTC to avoid TZ drift). */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
