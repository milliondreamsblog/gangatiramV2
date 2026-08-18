// Pixel-art HUD glyphs for the footer game, drawn as crisp rect grids to match
// the Figma mock (frame 2147260652): hearts for lives, star for best score,
// speaker for the sound toggle. Each glyph is a string-row bitmap; "X" cells
// render as 1x1 rects so edges stay sharp at any size.

const HEART = [
  ".XX..XX.",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  ".XXXXXX.",
  "..XXXX..",
  "...XX...",
];

const STAR = [
  "....X....",
  "...XXX...",
  "XXXXXXXXX",
  ".XXXXXXX.",
  "..XXXXX..",
  ".XX...XX.",
];

const SPEAKER_ON = [
  "...X..X.",
  "..XX...X",
  "XXXX.X.X",
  "XXXX.X.X",
  "XXXX.X.X",
  "..XX...X",
  "...X..X.",
];

const SPEAKER_OFF = [
  "...X.....",
  "..XX.X.X.",
  "XXXX..X..",
  "XXXX.X.X.",
  "XXXX.....",
  "..XX.....",
  "...X.....",
];

function PixelGlyph({
  rows,
  size,
  color,
  className,
}: {
  rows: string[];
  size: number;
  color: string;
  className?: string;
}) {
  const h = rows.length;
  const w = rows[0].length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={Math.round((size * h) / w)}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} /> : null,
        ),
      )}
    </svg>
  );
}

export function PixelHeart({ size = 18, lost = false }: { size?: number; lost?: boolean }) {
  return <PixelGlyph rows={HEART} size={size} color={lost ? "#dedede" : "currentColor"} />;
}

export function PixelStar({ size = 20 }: { size?: number }) {
  return <PixelGlyph rows={STAR} size={size} color="currentColor" />;
}

export function PixelSpeaker({ size = 20, muted = false }: { size?: number; muted?: boolean }) {
  return <PixelGlyph rows={muted ? SPEAKER_OFF : SPEAKER_ON} size={size} color="currentColor" />;
}

/** Small bordered chip with a play triangle — leads the "Move your cursor" hint. */
export function PlayChip({ size = 22 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-[5px] border border-current"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 8 8" width={size * 0.45} height={size * 0.45} aria-hidden>
        <path d="M2 1 L7 4 L2 7 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
