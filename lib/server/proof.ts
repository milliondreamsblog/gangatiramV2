import sharp from "sharp";

export type Proof = { buffer: Buffer; mime: string; filename: string };

/**
 * Payment screenshot → storable bytes. Images become ≤1000px JPEGs (~10x
 * smaller, so free-tier Postgres holds thousands); PDFs pass through.
 */
export async function compressProof(file: File, label: string): Promise<Proof> {
  let buffer = Buffer.from(await file.arrayBuffer());
  let mime = file.type;
  let filename = file.name.slice(0, 300);
  if (/^image\//i.test(mime)) {
    try {
      buffer = Buffer.from(
        await sharp(buffer)
          .rotate() // respect EXIF orientation from phone cameras
          .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 72, mozjpeg: true })
          .toBuffer()
      );
      mime = "image/jpeg";
      filename = filename.replace(/\.\w+$/, "") + ".jpg";
    } catch (error) {
      // Unreadable image (e.g. exotic HEIC build) — store the original bytes.
      console.error(`${label} screenshot compression failed, storing original`, error);
    }
  }
  return { buffer, mime, filename };
}

export const toBytea = (buffer: Buffer) => "\\x" + buffer.toString("hex");
