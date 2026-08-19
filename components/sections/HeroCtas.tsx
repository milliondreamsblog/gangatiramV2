"use client";

import { bookACallHref, talkToFounderHref } from "@/content/site";
import { hoverFeedback } from "@/lib/feedback";

const STYLES = {
  home: {
    wrapper: "flex shrink-0 items-center gap-1",
    talk: "flex min-h-11 items-center rounded-full bg-black/25 px-4 py-2.5 text-base font-medium tracking-[-0.01em] text-white backdrop-blur-md transition-colors hover:bg-black/40",
    book: "flex min-h-11 items-center rounded-full bg-white px-4 py-2.5 text-base font-medium tracking-[-0.01em] text-cta-ink backdrop-blur-md transition-transform hover:scale-[1.02]",
  },
  photo: {
    wrapper: "mt-7 flex flex-wrap items-center gap-3",
    talk: "flex items-center rounded-full bg-black px-4 py-2.5 text-sm font-medium tracking-[-0.01em] text-white transition-transform hover:scale-[1.02]",
    book: "flex items-center rounded-full bg-white px-4 py-2.5 text-sm font-medium tracking-[-0.01em] text-black transition-transform hover:scale-[1.02]",
  },
  light: {
    wrapper: "flex shrink-0 items-center gap-1",
    talk: "flex items-center rounded-full bg-surface px-4 py-2.5 text-base font-medium tracking-[-0.02em] text-black transition-transform hover:scale-[1.02]",
    book: "flex items-center rounded-full bg-black px-4 py-2.5 text-base font-medium tracking-[-0.02em] text-white transition-transform hover:scale-[1.02]",
  },
} as const;

export function HeroCtas({
  variant,
  secondary,
}: {
  variant: "home" | "photo" | "light";
  /** Replaces the white "Dev Deepawali" pill — used on pages that ARE the event. */
  secondary?: { label: string; href: string };
}) {
  const s = STYLES[variant];
  return (
    <div className={s.wrapper}>
      <a
        href={talkToFounderHref}
        onMouseEnter={() => hoverFeedback("cta")}
        className={s.talk}
      >
        Get the Book — ₹999
      </a>
      <a
        href={secondary?.href ?? bookACallHref}
        onMouseEnter={() => hoverFeedback("cta")}
        className={s.book}
      >
        {secondary?.label ?? "Dev Deepawali — 24 Nov"}
      </a>
    </div>
  );
}
