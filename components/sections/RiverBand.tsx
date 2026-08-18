/**
 * RiverBand — the page dissolves into the Ganga just before the footer.
 * Two grand sweeping wave layers drift slowly downstream while gently rising
 * and falling (river-bob), the front layer's body fades to white so the water
 * merges into the footer, warm lamp-glints ride the current — and every so
 * often a small Gangetic dolphin (long snout and all, the mission's own
 * animal) arcs out between the layers and dives back in. Pure CSS motion;
 * still under prefers-reduced-motion (dolphins stay underwater).
 */

// One full-wavelength sweep per 1440px tile; y and slope match at the seams.
const BACK = "M0,150 C240,226 480,226 720,150 S1200,74 1440,150 V300 H0 Z";
const FRONT = "M0,140 C240,64 480,64 720,140 S1200,216 1440,140 V300 H0 Z";

function WaveLayer({
  path,
  duration,
  bobDuration,
  fill,
  gradientId,
  lamps = false,
}: {
  path: string;
  duration: string;
  bobDuration: string;
  fill?: string;
  gradientId?: string;
  lamps?: boolean;
}) {
  const tile = (
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      aria-hidden
      className="h-full w-1/2 shrink-0"
    >
      {gradientId && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84a7bc" />
            <stop offset="55%" stopColor="#b9cdd9" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      )}
      <path d={path} fill={gradientId ? `url(#${gradientId})` : fill} />
      {lamps && (
        <>
          <circle cx="300" cy="128" r="4.5" fill="#e8b45a" opacity="0.9" />
          <circle cx="309" cy="128" r="9" fill="#e8b45a" opacity="0.22" />
          <circle cx="880" cy="172" r="3.8" fill="#e8b45a" opacity="0.85" />
          <circle cx="888" cy="172" r="7.5" fill="#e8b45a" opacity="0.2" />
          <circle cx="1260" cy="138" r="4" fill="#e8b45a" opacity="0.9" />
          <circle cx="1268" cy="138" r="8" fill="#e8b45a" opacity="0.22" />
        </>
      )}
    </svg>
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Outer: slow vertical breathing. Inner: horizontal drift. */}
      <div
        className="h-full w-full motion-reduce:animate-none"
        style={{ animation: `river-bob ${bobDuration} ease-in-out infinite` }}
      >
        <div
          className="flex h-full w-[200%] motion-reduce:animate-none"
          style={{ animation: `testimonial-marquee ${duration} linear infinite` }}
        >
          {tile}
          {tile}
        </div>
      </div>
    </div>
  );
}

/**
 * A small Gangetic dolphin silhouette — the long thin rostrum is the species'
 * signature. Hidden underwater most of its cycle; the keyframes carry it
 * through one clean leap. Base opacity 0, so reduced-motion keeps it beneath
 * the surface entirely.
 */
function Dolphin({
  left,
  duration,
  delay,
  scale = 1,
  mobile = false,
}: {
  left: string;
  duration: string;
  delay: string;
  scale?: number;
  /** Dolphins are md-and-up by default; `mobile` lets one swim on phones too. */
  mobile?: boolean;
}) {
  return (
    <div
      className={
        mobile
          ? "absolute top-[30%] scale-75 md:top-[38%] md:scale-100 motion-reduce:hidden"
          : "absolute top-[38%] hidden md:block motion-reduce:hidden"
      }
      style={{ left }}
      aria-hidden
    >
      <svg
        viewBox="0 0 64 26"
        width={44 * scale}
        height={18 * scale}
        className="opacity-0"
        style={{ animation: `dolphin-leap ${duration} ease-in-out ${delay} infinite` }}
      >
        {/* Artwork is drawn nose-left; mirror it so the dolphin faces its
            direction of travel (the leap arcs rightward). */}
        <g transform="translate(64 0) scale(-1 1)">
          {/* dorsal fin */}
          <path d="M30 9 L35 2 L39 9 Z" fill="#4f7288" />
          {/* body: long slender rostrum, tapering to tail flukes */}
          <path
            d="M1 15 C7 13.4 13 11.6 21 10.4 C31 9 42 9.4 51 11 L57 6.5 L56 12.4 L62 16.5 L54 17.5 C45 19.6 33 19.4 23 18.2 C14 17.2 7 16.4 2 16.2 Z"
            fill="#4f7288"
          />
          {/* pectoral fin */}
          <path d="M26 15 L30 21 L34 16 Z" fill="#456578" />
        </g>
      </svg>
    </div>
  );
}

export function RiverBand() {
  return (
    <div aria-hidden className="relative h-[150px] w-full overflow-hidden bg-transparent sm:h-[200px] md:h-[280px]">
      <WaveLayer path={BACK} fill="#cddce5" duration="95s" bobDuration="11s" />
      {/* Dolphins live between the layers: they surface above the front
          wave's crest and vanish behind its body as they dive. On phones only
          the lead dolphin swims — the second's arc would leave the screen. */}
      <Dolphin left="14%" duration="14s" delay="-6s" mobile />
      <Dolphin left="62%" duration="23s" delay="-3s" scale={0.72} />
      <WaveLayer path={FRONT} gradientId="river-fade" duration="60s" bobDuration="9s" lamps />
    </div>
  );
}
