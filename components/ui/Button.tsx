import { cn } from "@/lib/utils";

const BASE = "flex items-center rounded-full text-sm font-medium tracking-[-0.01em]";
const VARIANT = {
  primary: "h-8 bg-black px-3 text-white transition-transform hover:scale-[1.02]",
  light: "h-8 bg-white px-3 text-cta-ink transition-transform hover:scale-[1.02]",
  ghost: "h-[30px] px-3 transition-colors",
} as const;

export function Button({
  href,
  variant = "primary",
  className,
  children,
}: {
  href?: string;
  variant?: keyof typeof VARIANT;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = cn(BASE, VARIANT[variant], className);
  return href ? (
    <a href={href} className={cls}>{children}</a>
  ) : (
    <button type="button" className={cls}>{children}</button>
  );
}
