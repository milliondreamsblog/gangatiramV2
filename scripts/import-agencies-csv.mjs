// Dev-only. Usage:
//   node scripts/import-agencies-csv.mjs "/absolute/path/to/UX Agencies (1).csv" [--limit N]
import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import matter from "gray-matter";

const csvPath = process.argv[2];
const limitFlag = process.argv.indexOf("--limit");
const limit = limitFlag > -1 ? parseInt(process.argv[limitFlag + 1], 10) : Infinity;
if (!csvPath) {
  console.error("Pass the CSV path as the first argument.");
  process.exit(1);
}

const BLOG_DIR = path.join(process.cwd(), "content", "agencies");
const COVER_DIR = path.join(process.cwd(), "public", "agencies");
fs.mkdirSync(BLOG_DIR, { recursive: true });
fs.mkdirSync(COVER_DIR, { recursive: true });

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
// The CSV export has HTML <table> markup (comparison tables); without GFM table
// support, Turndown drops the grid and each cell becomes its own paragraph.
// Register the plugin so tables round-trip as Markdown tables.
td.use(gfm);
// Framer wraps every table cell's text in <p>, whose default block rule adds
// blank lines around the content; inside a table row that breaks the single-line
// pipe syntax. Flatten <p> inside td/th back to inline text.
td.addRule("flattenTableCellParagraphs", {
  filter: (node) => node.nodeName === "P" && ["TD", "TH"].includes(node.parentNode?.nodeName),
  replacement: (content) => content.trim() + " ",
});
// Preserve links/images as Markdown; strip empty spans Framer adds.
td.addRule("stripEmptyAnchors", {
  filter: (node) => node.nodeName === "A" && !node.getAttribute("href"),
  replacement: (content) => content,
});

// Framer exports some subheadings as <ol><li><h3>…</h3></li></ol>, which Turndown
// renders as "1.  ### Heading" — a stray numbered bullet beside the heading.
// Collapse any list-item line that is purely a heading back to a bare heading.
function unwrapHeadingListItems(md) {
  return md.replace(/^[ \t]*\d+\.[ \t]+(#{1,6}[ \t]+.*)$/gm, "$1");
}

/** Derive the directory facet from the (messy) slug/title. Order matters.
 * Inlined from content/agencyNormalize.ts (kept in sync manually — this is a
 * plain .mjs script and cannot import the .ts module). */
function agencyCategory(slug, title) {
  const s = `${slug} ${title}`.toLowerCase();
  if (/product-design|digital-product-design/.test(s)) return "Product Design";
  if (/saas-design/.test(s)) return "SaaS Design";
  if (/web-design/.test(s)) return "Web Design";
  if (/mobile|android|ios|desktop|electron/.test(s)) return "Mobile & Desktop";
  if (/usability|user-research|ux-research|user-testing/.test(s)) return "User Research";
  return "UX Agencies";
}

const KNOWN_CATEGORIES = new Set([
  "Product Design",
  "SaaS Design",
  "Web Design",
  "Mobile & Desktop",
  "User Research",
  "UX Agencies",
]);

const raw = fs.readFileSync(csvPath, "utf8");
const { data: rows } = Papa.parse(raw, { header: true, skipEmptyLines: true });

let written = 0;
let nonIndexed = 0;
let missingCover = 0;
let downloadFailures = 0;
const seen = new Set();
const unknownCats = new Set();

const COVER_EXTS = ["png", "jpg", "jpeg", "webp", "avif", "gif"];

async function downloadCover(url, slug) {
  // Skip re-downloading covers that already exist on disk.
  for (const ext of COVER_EXTS) {
    const existing = path.join(COVER_DIR, `${slug}.${ext}`);
    if (fs.existsSync(existing)) {
      return `/agencies/${slug}.${ext}`;
    }
  }

  if (!url) {
    missingCover++;
    return "";
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (url.split("?")[0].match(/\.(png|jpe?g|webp|avif|gif)$/i)?.[1] || "png").toLowerCase();
    const rel = `/agencies/${slug}.${ext}`;
    fs.writeFileSync(path.join(process.cwd(), "public", rel), buf);
    return rel;
  } catch (e) {
    console.warn(`  cover failed for ${slug}: ${e.message}`);
    missingCover++;
    downloadFailures++;
    return "";
  }
}

async function processRow(r) {
  const slug = (r["Slug"] || "").trim();
  if (!slug) return;
  if (seen.has(slug)) {
    console.warn(`  DUPLICATE slug skipped: ${slug}`);
    return;
  }
  seen.add(slug);

  const title = (r["Title"] || "").trim();
  const index = (r["Index?"] || "").trim().toLowerCase() === "true";
  if (!index) nonIndexed++;

  const cover = await downloadCover((r["Cover Image"] || "").trim(), slug);

  const sections = [
    td.turndown(r["Content"] || ""),
    td.turndown(r["Content After Freebie"] || ""),
    td.turndown(r["Content After Call"] || ""),
    td.turndown(r["Content After Call 2"] || ""),
  ].map((s) => unwrapHeadingListItems(s).trim());

  const body = sections[0]
    + "\n\n<!--cta:freebie-->\n\n" + sections[1]
    + "\n\n<!--cta:call-->\n\n" + sections[2]
    + "\n\n<!--cta:call2-->\n\n" + sections[3];

  const category = agencyCategory(slug, title);
  if (!KNOWN_CATEGORIES.has(category)) unknownCats.add(category);

  const frontmatter = {
    slug,
    title,
    excerpt: (r["Description"] || "").trim(),
    cover,
    coverAlt: (r["Cover Image:alt"] || "").trim(),
    date: (r["Date"] || "").slice(0, 10),
    readTime: (r["Read Time"] || "").trim(),
    month: (r["Month"] || "").trim(),
    author: (r["Author Slug"] || "").trim(),
    category,
    index,
  };

  const file = matter.stringify(`\n${body}\n`, frontmatter);
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), file);
  written++;
}

// Process rows through a concurrency pool so cover downloads run in parallel
// (the fetch is the bottleneck). Node is single-threaded, so the shared counter
// mutations are safe; slugs are unique so the dedup race is moot.
const list = rows.slice(0, limit);
const CONCURRENCY = 24;
let cursor = 0;
async function worker() {
  while (cursor < list.length) {
    await processRow(list[cursor++]);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\nWrote ${written} files (${nonIndexed} non-indexed). Missing covers: ${missingCover} (download failures: ${downloadFailures}).`);
if (unknownCats.size) {
  console.log(`Unknown categories encountered: ${[...unknownCats].join(", ")}`);
}
