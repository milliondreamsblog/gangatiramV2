/**
 * Ganga Tiram mark — "Tiram" means riverbank. Three ghat steps descend into
 * a single sweeping current, a gold diya glowing above the water: the shore
 * meeting the river, drawn in one stroke and one dot.
 * `onDark` swaps the badge to cream for dark surfaces.
 */
export default function Logo({ size = 32, onDark = false }: { size?: number; onDark?: boolean }) {
  const badge = onDark ? '#FDFCF8' : '#2D241E';
  const stroke = onDark ? '#2D241E' : '#FDFCF8';
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill={badge} />
      <path
        d="M8 9 H12.5 V13.5 H17 V18 H21.5 C24.5 18 26 20 24.5 22 C22.5 24.5 14 25 9.5 22.5"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23.5" cy="9.5" r="2.4" fill="#D4A373" />
    </svg>
  );
}
