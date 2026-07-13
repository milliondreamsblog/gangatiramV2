/**
 * Ganga Tiram mark — three waves on a badge: glacial teal at the source,
 * river blue midstream, delta gold at the sea. The site's temperature arc
 * compressed into a logo. `onDark` swaps the badge to cream for dark surfaces.
 */
export default function Logo({ size = 32, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill={onDark ? '#FDFCF8' : '#2D241E'} />
      <path d="M7 11 C10 8.5 13 8.5 16 11 C19 13.5 22 13.5 25 11" stroke={onDark ? '#5FA3AD' : '#8FBFBF'} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M7 17 C10 14.5 13 14.5 16 17 C19 19.5 22 19.5 25 17" stroke="#3A7CA5" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M7 23 C10 20.5 13 20.5 16 23 C19 25.5 22 25.5 25 23" stroke="#D4A373" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
