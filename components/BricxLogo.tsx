import { cn } from "@/lib/utils";

/**
 * The Ganga Tiram wordmark. Uses currentColor so it can be tinted via
 * `text-*` / `className` (white over the hero, black on light bands).
 */
export function BricxLogo({ className }: { className?: string }) {
  return (
    <div
      aria-label="Ganga Tiram"
      role="img"
      className={cn("flex items-baseline font-serif", className)}
    >
      <span className="whitespace-nowrap text-[20px] leading-none tracking-tight">
        Ganga Tiram
      </span>
    </div>
  );
}
