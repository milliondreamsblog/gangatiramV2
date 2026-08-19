/**
 * A diya drawn in CSS — teardrop flame over a clay bowl. Used on name chips,
 * the procession belt, and the live Diya Card preview. Pure markup, no assets.
 */
export function Flame({
  size = 14,
  delay = 0,
  muted = false,
}: {
  size?: number;
  delay?: number;
  muted?: boolean;
}) {
  return (
    <span
      aria-hidden
      className="relative inline-flex shrink-0 flex-col items-center"
      style={{ width: size, opacity: muted ? 0.35 : 1 }}
    >
      <span
        className="block origin-bottom motion-safe:animate-[flame-flicker_2.6s_ease-in-out_infinite]"
        style={{
          width: Math.round(size * 0.62),
          height: size,
          borderRadius: "50% 50% 42% 42% / 68% 68% 32% 32%",
          background: "linear-gradient(180deg,#ffe9b0 0%,#ffb95e 55%,#f07b2d 100%)",
          animationDelay: `${delay}ms`,
        }}
      />
      <span
        className="block"
        style={{
          width: size,
          height: Math.max(4, Math.round(size * 0.4)),
          marginTop: 1,
          borderRadius: "3px 3px 999px 999px",
          background: "linear-gradient(180deg,#8a4a2b,#5f2f1a)",
        }}
      />
    </span>
  );
}
