/**
 * The Diya Card — an issued pass, in the visitor-gallery language: serif
 * wordmark, monospace field labels, a serial number, a signature line, and a
 * dotted flame ornament. Four festival colours rotate by diya number. The
 * canvas renderer in DiyaCardDownload draws the same design as a PNG.
 */

export const CARD_PALETTE = [
  { bg: "#c66a1b", ink: "#fdf3e3" }, // marigold
  { bg: "#17808f", ink: "#f2fbfc" }, // teal
  { bg: "#2f7d46", ink: "#f0f9ef" }, // leaf green
  { bg: "#bd4d7c", ink: "#fdf1f6" }, // rani pink
] as const;

export function cardColors(diyaNo?: number) {
  return CARD_PALETTE[diyaNo ? diyaNo % CARD_PALETTE.length : 0];
}

export function DiyaCard({
  name,
  diyaNo,
  issuedOn,
  dedication,
}: {
  name: string | null;
  diyaNo?: number;
  issuedOn?: string | null;
  dedication?: string | null;
}) {
  const c = cardColors(diyaNo);
  return (
    <div
      className="relative flex aspect-[8/5] w-full max-w-[460px] flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-[0_30px_60px_-24px_rgba(60,20,0,0.5)] sm:p-6"
      style={{ backgroundColor: c.bg, color: c.ink }}
    >
      {/* Dotted flame ornament */}
      <svg
        aria-hidden
        viewBox="0 0 200 260"
        className="pointer-events-none absolute -right-10 top-[46%] h-[118%] -translate-y-1/2 opacity-30"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeDasharray="0.5 7"
      >
        <path strokeWidth="3" d="M100,18 C144,82 134,146 100,158 C66,146 56,82 100,18" />
        <path strokeWidth="2.5" d="M100,44 C130,88 124,136 100,145 C76,136 70,88 100,44" />
        <path strokeWidth="2" d="M100,70 C117,96 114,126 100,132 C86,126 83,96 100,70" />
        <path strokeWidth="3" d="M40,178 L160,178" />
        <path strokeWidth="3" d="M46,192 C60,224 140,224 154,192" />
        <path strokeWidth="2.5" d="M64,236 C88,246 112,246 136,236" />
      </svg>

      {/* Top row: wordmark + event */}
      <div className="relative flex items-start justify-between gap-3">
        <p className="font-serif text-2xl leading-none tracking-tight sm:text-[27px]">
          Ganga Tiram
        </p>
        <p className="text-right font-mono text-[9px] uppercase leading-[1.5] tracking-[0.12em] opacity-80 sm:text-[10px]">
          Dev Deepawali
          <br />
          Kashi · 24 Nov 2026
        </p>
      </div>

      {/* Fields */}
      <div className="relative flex flex-col gap-2.5">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-70 sm:text-[10px]">
            Name on the diya
          </p>
          <p className="mt-0.5 truncate font-mono text-lg font-semibold uppercase tracking-[0.04em] sm:text-[21px]">
            {name || "Your name"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-70 sm:text-[10px]">
            Issued on
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold uppercase tracking-[0.04em] sm:text-base">
            {issuedOn || "Today"}
          </p>
        </div>
      </div>

      {/* Bottom row: serial + signature line */}
      <div className="relative flex items-end justify-between gap-4">
        <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] opacity-80 sm:text-xs">
          No. {diyaNo ?? "—"}
        </p>
        <div className="flex min-w-0 grow items-end gap-2 pl-4">
          <span className="font-mono text-[11px] opacity-80 sm:text-xs">X</span>
          <span className="relative min-w-0 grow border-b" style={{ borderColor: c.ink }}>
            {dedication && (
              <span className="block truncate pb-0.5 text-center font-serif text-[13px] italic leading-tight opacity-90 sm:text-sm">
                {dedication}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
