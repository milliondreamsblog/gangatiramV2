"use client";

import { useEffect, useState } from "react";
import { hoverFeedback } from "@/lib/feedback";
import { Flame } from "./Flame";

/**
 * The story of the two offerings — single centered column: rows of name chips
 * where the reference frame stacks its avatar rows, then eyebrow, two-tone
 * heading, one narrow paragraph, one black pill. (Layout: Bricx Website v7,
 * node 581:6338 "The Humans Behind The Pixels".)
 */

type Feed = { count: number; names: { id: number; name: string }[] };

const SLOTS_TOP = 5;
const SLOTS_BOTTOM = 4;

export function LampStory() {
  const [feed, setFeed] = useState<Feed>({ count: 0, names: [] });

  useEffect(() => {
    fetch("/api/lamp/count")
      .then((r) => r.json())
      .then((d) => d && setFeed({ count: d.count ?? 0, names: d.names ?? [] }))
      .catch(() => {});
  }, []);

  const slots: (string | null)[] = Array.from(
    { length: SLOTS_TOP + SLOTS_BOTTOM },
    (_, i) => feed.names[i]?.name ?? null
  );

  return (
    <section className="bg-[#f7f7f7] px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center">
        {/* Name chips where the reference stacks its avatar rows */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex flex-wrap justify-center gap-2.5">
            {slots.slice(0, SLOTS_TOP).map((name, i) => (
              <NameChip key={i} name={name} delay={i * 380} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {slots.slice(SLOTS_TOP).map((name, i) => (
              <NameChip key={i} name={name} delay={(i + SLOTS_TOP) * 380} />
            ))}
          </div>
        </div>

        <span className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#b08d57]/40 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-[#8a6c3f]">
          <span aria-hidden className="size-1.5 rounded-full bg-[#b08d57]" />
          {feed.count > 0 ? `${feed.count} ${feed.count === 1 ? "diya" : "diyas"} pledged` : "The offering"}
        </span>

        <h2 className="mt-5 text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
          One diya.
          <br />
          <span className="font-serif italic text-black/60">Two offerings.</span>
        </h2>

        <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] tracking-[-0.01em] text-black/65">
          On Dev Deepawali night, a priest lights an earthen lamp carrying your
          name on a ghat in Kashi — the first offering, in fire. When the
          festival ends, the same ten rupees puts gloves on the steps and lifts
          the night&rsquo;s remains off the river — the second offering, in work.
          Less than a cup of chai, for both.
        </p>

        <a
          href="#offer"
          onMouseEnter={() => hoverFeedback("cta")}
          className="mt-8 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
        >
          Light my lamp — ₹10
        </a>
      </div>
    </section>
  );
}

function NameChip({ name, delay }: { name: string | null; delay: number }) {
  if (!name) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-black/20 bg-white/60 px-3.5 py-2 text-sm text-black/35">
        <Flame size={12} muted />
        reserved
      </span>
    );
  }
  return (
    <span className="inline-flex max-w-[190px] items-center gap-2 rounded-full border border-[#b08d57]/35 bg-white px-3.5 py-2 text-sm font-medium text-black/75">
      <Flame size={12} delay={delay} />
      <span className="truncate">{name}</span>
    </span>
  );
}
