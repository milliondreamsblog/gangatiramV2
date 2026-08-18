import { ImageResponse } from "next/og";

export const alt = "Ganga Tiram — 2,525 Kilometers of Heritage";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(180deg, #10222e 0%, #1d3a4c 60%, #35617c 100%)",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40 }}>Ganga Tiram</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 84, lineHeight: 1.02 }}>
            2,525 Kilometers of Heritage
          </div>
          <div style={{ display: "flex", fontSize: 32, opacity: 0.75 }}>
            75 places · 240 photographs · one river, source to sea
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.7 }}>
          The book — ₹999 · gangatiram.in
        </div>
      </div>
    ),
    { ...size }
  );
}
