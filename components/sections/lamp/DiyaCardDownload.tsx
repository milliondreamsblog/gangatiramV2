"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { DiyaCard, cardColors } from "./DiyaCard";

/**
 * /diya-card/[id] body — the issued card with a saveable PNG. The PNG is
 * drawn client-side on a canvas (same design as the DOM card), so no server
 * image pipeline is involved and saving works offline on phones.
 */

const SHARE_TEXT =
  "My diya burns on the ghats of Kashi this Dev Deepawali — with my name beside the flame. Put yours on the river: gangatiram.in/dev-deepawali";

export function DiyaCardDownload({
  name,
  diyaNo,
  issuedOn,
  dedication,
}: {
  name: string;
  diyaNo: number;
  issuedOn: string;
  dedication: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const savePng = () => {
    setSaving(true);
    try {
      const canvas = drawCard(name, diyaNo, issuedOn, dedication);
      canvas.toBlob((blob) => {
        if (blob) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `diya-${diyaNo}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
          a.click();
          URL.revokeObjectURL(a.href);
        }
        setSaving(false);
      }, "image/png");
    } catch {
      setSaving(false);
    }
  };

  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-[linear-gradient(150deg,#ffe8cf_0%,#ffb066_48%,#f97316_100%)] px-5 py-16">
      <DiyaCard name={name} diyaNo={diyaNo} issuedOn={issuedOn} dedication={dedication} />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <button
          onClick={savePng}
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
        >
          <Download size={15} />
          {saving ? "Drawing…" : "Save as image"}
        </button>
        <button
          onClick={copyShare}
          className="inline-flex items-center gap-2 rounded-full border border-black/25 bg-white/70 px-6 py-3 text-sm font-medium text-black transition-colors hover:border-black/50"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy a line to pass it on"}
        </button>
      </div>
      <a
        href="/dev-deepawali"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-black/60 underline-offset-4 hover:underline"
      >
        Light a lamp of your own — ₹10
        <ArrowUpRight size={14} />
      </a>
    </section>
  );
}

/** Draw the issued-card design at 1600x1000 — mirrors the DOM card. */
function drawCard(
  name: string,
  diyaNo: number,
  issuedOn: string,
  dedication: string | null
): HTMLCanvasElement {
  const W = 1600;
  const H = 1000;
  const PAD = 96;
  const c = cardColors(diyaNo);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const MONO = "'Courier New', ui-monospace, monospace";
  const SERIF = "Georgia, 'Times New Roman', serif";

  // Card ground
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);

  // Dotted flame ornament, right side
  ctx.strokeStyle = c.ink;
  ctx.globalAlpha = 0.32;
  ctx.lineCap = "round";
  ctx.setLineDash([2, 26]);
  const ox = W - 340;
  const oy = H / 2 - 110;
  const s = 3.4;
  const flame = (k: number, w: number) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(ox, oy - 110 * s * k);
    ctx.bezierCurveTo(ox + 62 * s * k, oy - 20 * s * k, ox + 48 * s * k, oy + 70 * s * k, ox, oy + 88 * s * k);
    ctx.bezierCurveTo(ox - 48 * s * k, oy + 70 * s * k, ox - 62 * s * k, oy - 20 * s * k, ox, oy - 110 * s * k);
    ctx.stroke();
  };
  flame(1, 10);
  flame(0.66, 8);
  flame(0.36, 7);
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(ox - 200, oy + 130 * s * 0.7);
  ctx.lineTo(ox + 200, oy + 130 * s * 0.7);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox - 180, oy + 160 * s * 0.7);
  ctx.quadraticCurveTo(ox, oy + 250 * s * 0.7, ox + 180, oy + 160 * s * 0.7);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  ctx.fillStyle = c.ink;

  // Wordmark + event, top row
  ctx.font = `86px ${SERIF}`;
  ctx.textAlign = "left";
  ctx.fillText("Ganga Tiram", PAD, PAD + 66);
  ctx.textAlign = "right";
  ctx.globalAlpha = 0.8;
  ctx.font = `600 30px ${MONO}`;
  ctx.fillText("DEV DEEPAWALI", W - PAD, PAD + 22);
  ctx.fillText("KASHI · 24 NOV 2026", W - PAD, PAD + 66);
  ctx.globalAlpha = 1;

  // Fields
  ctx.textAlign = "left";
  const label = (t: string, y: number) => {
    ctx.globalAlpha = 0.7;
    ctx.font = `600 30px ${MONO}`;
    ctx.fillText(spaceOut(t), PAD, y);
    ctx.globalAlpha = 1;
  };

  label("NAME ON THE DIYA", 470);
  let px = 72;
  ctx.font = `700 ${px}px ${MONO}`;
  const maxW = W - 620;
  const upper = name.toUpperCase();
  while (ctx.measureText(upper).width > maxW && px > 34) {
    px -= 3;
    ctx.font = `700 ${px}px ${MONO}`;
  }
  ctx.fillText(upper, PAD, 470 + px + 18);

  label("ISSUED ON", 660);
  ctx.font = `700 44px ${MONO}`;
  ctx.fillText(issuedOn.toUpperCase(), PAD, 716);

  // Serial, bottom-left
  ctx.globalAlpha = 0.85;
  ctx.font = `600 36px ${MONO}`;
  ctx.fillText(`NO. ${diyaNo}`, PAD, H - PAD);
  ctx.globalAlpha = 1;

  // Signature line, bottom-right
  const sigX0 = PAD + 340;
  const sigX1 = W - PAD;
  ctx.font = `600 36px ${MONO}`;
  ctx.fillText("X", sigX0, H - PAD);
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(sigX0 + 48, H - PAD + 8);
  ctx.lineTo(sigX1, H - PAD + 8);
  ctx.stroke();
  if (dedication) {
    let dp = 40;
    ctx.font = `italic ${dp}px ${SERIF}`;
    const sigW = sigX1 - sigX0 - 80;
    while (ctx.measureText(dedication).width > sigW && dp > 22) {
      dp -= 2;
      ctx.font = `italic ${dp}px ${SERIF}`;
    }
    ctx.textAlign = "center";
    ctx.fillText(dedication, (sigX0 + 48 + sigX1) / 2, H - PAD - 8);
    ctx.textAlign = "left";
  }
  ctx.globalAlpha = 1;

  return canvas;
}

/** Approximate the tracked monospace label look. */
function spaceOut(t: string) {
  return t.split("").join(" ");
}
