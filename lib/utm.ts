/**
 * Lightweight attribution capture. UTM/click params usually arrive on the
 * landing page (often the homepage), so we persist them to localStorage the
 * first time we see them and read them back when the Book a Call form submits —
 * they survive the navigation into /book-a-call.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  referrer?: string;
  landing_page?: string;
};

const STORAGE_KEY = "bricx_attribution";

/**
 * Runs on every page load. If the current URL carries any UTM/gclid param,
 * store the whole set (last-touch) plus the referrer and landing page. If it
 * doesn't, we keep whatever was captured earlier.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    let hasUtm = false;
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        found[key] = value;
        hasUtm = true;
      }
    }
    if (!hasUtm) return;
    found.referrer = document.referrer || "";
    found.landing_page = window.location.href;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    /* private mode / storage disabled — attribution is best-effort */
  }
}

/** The stored attribution (or {} if none / unavailable). */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
