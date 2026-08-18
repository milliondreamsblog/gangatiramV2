import { cn } from "@/lib/utils";
import { Pill } from "./Pill";

export function splitTitle(title: string, on: string): { lead: string; rest: string } {
  const i = title.indexOf(on);
  if (i < 0) return { lead: title, rest: "" };
  return { lead: title.slice(0, i), rest: title.slice(i + 1) };
}

const SIZE = {
  lg: "text-[clamp(2.75rem,5vw,58px)]",
  md: "text-[clamp(2rem,3vw,40px)]",
} as const;

export function SectionHeader({
  eyebrow,
  title,
  splitOn = " for ",
  size = "lg",
  className,
}: {
  eyebrow?: string;
  title: string;
  splitOn?: string;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const { lead, rest } = splitTitle(title, splitOn);
  return (
    <div className={cn("flex flex-col items-start gap-5", className)}>
      {eyebrow && <Pill>{eyebrow}</Pill>}
      <h1 className={cn(SIZE[size], "font-normal leading-[1.08] tracking-[-0.04em] text-black")}>
        <span className={cn("block", rest ? "text-black/60" : "text-black")}>{lead}</span>
        {rest && <span className="block">{rest}</span>}
      </h1>
    </div>
  );
}
