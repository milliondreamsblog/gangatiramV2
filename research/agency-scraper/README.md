# Agency Research Scraper (side project — not part of the Ganga Tiram app)

Scripts and outputs from a one-off research task (June 2026): scraping Google and
LinkedIn search results to build a ranked list of UX/design agencies.

- `scripts/` — Playwright/BeautifulSoup scrapers (Python) and one HTML-extraction script (TypeScript)
- `data/` — JSON/CSV outputs (extracted agencies, ranked search results, final list)
- `reports/` — generated Markdown research sheets
- `debug/` — raw saved HTML pages used while debugging selectors (git-ignored)

None of this is imported by the web app. It can be moved out of this repository
entirely without affecting anything.
