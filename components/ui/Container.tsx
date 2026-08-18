import { cn } from "@/lib/utils";

const MAX = {
  page: "max-w-[1800px]",
  wide: "max-w-[1440px]",
  prose: "max-w-[720px]",
  narrow: "max-w-[768px]",
} as const;

export type ContainerSize = keyof typeof MAX;

export function Container({
  size = "page",
  padded = true,
  className,
  children,
}: {
  size?: ContainerSize;
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full", padded && "px-5 md:px-10", MAX[size], className)}>
      {children}
    </div>
  );
}
