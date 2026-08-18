import { cn } from "@/lib/utils";

const VARIANT = {
  chip: "flex h-7 items-center rounded-full bg-surface px-3 text-sm tracking-[-0.01em] text-black",
  tab: "h-10 rounded-lg px-4 text-sm font-medium tracking-[-0.01em]",
} as const;

export function Pill({
  variant = "chip",
  className,
  children,
}: {
  variant?: keyof typeof VARIANT;
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn(VARIANT[variant], className)}>{children}</span>;
}
