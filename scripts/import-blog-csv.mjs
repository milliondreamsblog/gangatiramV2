// Dev-only. Usage:
//   node scripts/import-blog-csv.mjs "/absolute/path/to/Blog (1).csv" [--limit N]
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

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const COVER_DIR = path.join(process.cwd(), "public", "blog");
fs.mkdirSync(BLOG_DIR, { recursive: true });
fs.mkdirSync(COVER_DIR, { recursive: true });

const ALLOWED = new Set([
  "Product Design",
  "Website Design",
  "Insights",
  "Practices",
  "Resource",
]);

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
// The CSV export has HTML <table> markup (comparison tables, ~76/211 posts);
// without GFM table support, Turndown drops the grid and each cell becomes
// its own paragraph. Register the plugin so tables round-trip as Markdown tables.
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

const raw = fs.readFileSync(csvPath, "utf8");
const { data: rows } = Papa.parse(raw, { header: true, skipEmptyLines: true });

let written = 0;
let drafts = 0;
let missingCover = 0;
const seen = new Set();
const unknownCats = new Set();

function toIso(v) {
  // "2026-06-23T00:00:00.000Z" -> "2026-06-23"
  return (v || "").slice(0, 10);
}

// Framer exports some subheadings as <ol><li><h3>…</h3></li></ol>, which Turndown
// renders as "1.  ### Heading" — a stray numbered bullet beside the heading.
// Collapse any list-item line that is purely a heading back to a bare heading.
function unwrapHeadingListItems(md) {
  return md.replace(/^[ \t]*\d+\.[ \t]+(#{1,6}[ \t]+.*)$/gm, "$1");
}

const COVER_EXTS = ["png", "jpg", "jpeg", "webp", "avif", "gif"];

async function downloadCover(url, slug) {
  // Skip re-downloading covers that already exist on disk.
  for (const ext of COVER_EXTS) {
    const existing = path.join(COVER_DIR, `${slug}.${ext}`);
    if (fs.existsSync(existing)) {
      return `/blog/${slug}.${ext}`;
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
    const rel = `/blog/${slug}.${ext}`;
    fs.writeFileSync(path.join(process.cwd(), "public", rel), buf);
    return rel;
  } catch (e) {
    console.warn(`  cover failed for ${slug}: ${e.message}`);
    missingCover++;
    return "";
  }
}

const list = rows.slice(0, limit);
for (const r of list) {
  const slug = (r["Slug"] || "").trim();
  if (!slug) continue;
  if (seen.has(slug)) {
    console.warn(`  DUPLICATE slug skipped: ${slug}`);
    continue;
  }
  seen.add(slug);

  const cat1 = (r["Category 1"] || "").trim();
  const cat2 = (r["Category 2"] || "").trim();
  if (cat1 && !ALLOWED.has(cat1)) unknownCats.add(cat1);
  if (cat2 && !ALLOWED.has(cat2)) unknownCats.add(cat2);

  const tags = [...new Set([cat1, cat2].filter(Boolean))];
  const draft = (r[":draft"] || "").trim().toLowerCase() === "true";
  if (draft) drafts++;

  const cover = await downloadCover((r["Cover Image"] || "").trim(), slug);
  const bodyMd = unwrapHeadingListItems(td.turndown(r["Content"] || "").trim());

  const frontmatter = {
    slug,
    title: (r["Title"] || "").trim(),
    excerpt: (r["Description"] || "").trim(),
    cover,
    coverAlt: (r["Cover Image:alt"] || "").trim(),
    category: cat1 || "Website Design",
    tags,
    date: toIso(r["Date"]),
    readTime: (r["Read Time"] || "").trim(),
    author: (r["Author Slug"] || "").trim(),
    featured: false,
    draft,
  };

  const file = matter.stringify(`\n${bodyMd}\n`, frontmatter);
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), file);
  written++;
}

console.log(`\nWrote ${written} files (${drafts} drafts). Missing covers: ${missingCover}.`);
if (unknownCats.size) {
  console.log(`Unknown categories encountered: ${[...unknownCats].join(", ")}`);
}
