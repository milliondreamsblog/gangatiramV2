/** Client-safe UX-agencies metadata: types + facet constants. NO fs. */
export const agencyCategories = [
  "All", "UX Agencies", "Product Design", "SaaS Design",
  "Web Design", "Mobile & Desktop", "User Research",
] as const;

export type AgencyCategory = (typeof agencyCategories)[number];

export type TocEntry = { text: string; id: string };

export type AgencySummary = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  coverAlt: string;
  date: string;      // display, "Jul 4, 2026"
  isoDate: string;   // "2026-07-04"
  readTime: string;  // "4 min read"
  month: string;     // "July, 2026"
  author: string;
  category: Exclude<AgencyCategory, "All">;
  index: boolean;
};

export type AgencyPage = AgencySummary & {
  sections: string[]; // rendered HTML, one per content block (length 4)
  toc: TocEntry[];
};

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
