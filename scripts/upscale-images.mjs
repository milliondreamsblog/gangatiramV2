/**
 * One-time quality pass: the site's key images are 1024×1024 renders being
 * stretched into much larger slots. Upscale each 2× with lanczos3 + a gentle
 * sharpen, and re-encode as high-quality JPEG bytes (kept under the same
 * filenames; next/image sniffs content, so extensions don't matter).
 * Local and free — no external upscaler involved.
 */
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public");

sharp.cache(false); // keep Windows file handles free so we can overwrite in place

const TARGETS = [
  "hero/hero-bg.png",
  "work/cards/festivals.png",
  "work/cards/art.png",
  "work/cards/craft.png",
  "work/cards/environment.png",
  "event/lamps-varanasi.png",
  "event/lamps-haridwar.png",
  "services/sq/birth-gomukh.png",
  "services/sq/naming-rishikesh.png",
  "services/sq/testing-haridwar.png",
  "services/sq/gathering-prayagraj.png",
  "services/sq/reckoning-varanasi.png",
  "services/sq/working-life-patna.png",
  "services/sq/the-wound.png",
  "services/sq/return-gangasagar.png",
];

// The chapter heroes are copies of the sq images — refresh them too.
const HERO_COPIES = [
  ["services/sq/birth-gomukh.png", "services/hero-birth-gomukh.png"],
  ["services/sq/naming-rishikesh.png", "services/hero-naming-rishikesh.png"],
  ["services/sq/testing-haridwar.png", "services/hero-testing-haridwar.png"],
  ["services/sq/gathering-prayagraj.png", "services/hero-gathering-prayagraj.png"],
  ["services/sq/reckoning-varanasi.png", "services/hero-reckoning-varanasi.png"],
  ["services/sq/working-life-patna.png", "services/hero-working-life-patna.png"],
  ["services/sq/the-wound.png", "services/hero-the-wound.png"],
  ["services/sq/return-gangasagar.png", "services/hero-return-gangasagar.png"],
];

for (const rel of TARGETS) {
  const p = join(PUB, rel);
  const meta = await sharp(p).metadata();
  if ((meta.width ?? 0) >= 1800) {
    console.log("skip (already large):", rel);
    continue;
  }
  const buf = await sharp(p)
    .resize({ width: (meta.width ?? 1024) * 2, kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.9, m1: 0.6, m2: 0.4 })
    .jpeg({ quality: 87, mozjpeg: true })
    .toBuffer();
  const { writeFileSync } = await import("node:fs");
  writeFileSync(p, buf);
  console.log("upscaled:", rel, `${meta.width}→${(meta.width ?? 1024) * 2}px`, `${Math.round(buf.length / 1024)}KB`);
}

const { copyFileSync } = await import("node:fs");
for (const [src, dst] of HERO_COPIES) copyFileSync(join(PUB, src), join(PUB, dst));
console.log("chapter heroes refreshed:", HERO_COPIES.length);
