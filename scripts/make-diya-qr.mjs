// QR code for the Dev Deepawali poster → https://gangatiram.in/diya
//   public/qr/diya-qr.svg         vector, for the printer
//   public/qr/diya-qr.png         2000px, for WhatsApp / Instagram / Canva
//   public/qr/diya-qr-poster.png  A5 at 300dpi, ready to print as is
// Run: node scripts/make-diya-qr.mjs [url]
import fs from "node:fs";
import QRCode from "qrcode";
import sharp from "sharp";

const url = process.argv[2] || "https://gangatiram.in/diya";
const out = "public/qr";
fs.mkdirSync(out, { recursive: true });

// Short URL + level Q: few, large modules that survive a creased or
// dim-lit poster, and still decode with 25% of the code damaged.
const qr = { errorCorrectionLevel: "Q", margin: 4, color: { dark: "#000000", light: "#ffffff" } };
const qrSvg = await QRCode.toString(url, { ...qr, type: "svg" });
fs.writeFileSync(`${out}/diya-qr.svg`, qrSvg);
await QRCode.toFile(`${out}/diya-qr.png`, url, { ...qr, width: 2000 });

// Poster: A5 portrait, 1748 × 2480.
const W = 1748, H = 2480, Q = 1100;
const qrInner = qrSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const viewBox = qrSvg.match(/viewBox="([^"]+)"/)[1];
const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Segoe UI', Arial, Helvetica, sans-serif";
const poster = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a120b"/><stop offset="1" stop-color="#3a2210"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffb066" stop-opacity="0.45"/><stop offset="1" stop-color="#ffb066" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W / 2}" cy="1400" r="900" fill="url(#glow)"/>

  <text x="${W / 2}" y="220" text-anchor="middle" font-family="${sans}" font-size="46" letter-spacing="9" fill="#e8c9a0">DEV DEEPAWALI · 24 NOV · KASHI</text>
  <text x="${W / 2}" y="400" text-anchor="middle" font-family="${serif}" font-size="120" fill="#ffffff">Light a diya</text>
  <text x="${W / 2}" y="540" text-anchor="middle" font-family="${serif}" font-size="120" fill="#ffffff">with your name</text>
  <text x="${W / 2}" y="660" text-anchor="middle" font-family="${serif}" font-style="italic" font-size="76" fill="#f3d9b5">on the ghats of Kashi</text>

  <rect x="${(W - Q) / 2 - 30}" y="780" width="${Q + 60}" height="${Q + 60}" rx="48" fill="#ffffff"/>
  <svg x="${(W - Q) / 2}" y="810" width="${Q}" height="${Q}" viewBox="${viewBox}" shape-rendering="crispEdges">${qrInner}</svg>

  <text x="${W / 2}" y="2080" text-anchor="middle" font-family="${sans}" font-weight="700" font-size="72" fill="#ffffff">Scan with your phone camera</text>
  <text x="${W / 2}" y="2180" text-anchor="middle" font-family="${sans}" font-size="54" fill="#e8c9a0">₹10 a name · video on your WhatsApp</text>
  <text x="${W / 2}" y="2350" text-anchor="middle" font-family="${sans}" font-size="44" letter-spacing="3" fill="#ffffff" fill-opacity="0.6">gangatiram.in/diya</text>
</svg>`;
await sharp(Buffer.from(poster)).png().toFile(`${out}/diya-qr-poster.png`);

console.log(`QR → ${url}\n  ${out}/diya-qr.svg\n  ${out}/diya-qr.png\n  ${out}/diya-qr-poster.png`);
