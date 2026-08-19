"use client";

import { useEffect, useState } from "react";
import { hoverFeedback } from "@/lib/feedback";
import { Flame } from "./Flame";

/**
 * The procession — named diyas walking to the river on a stepped belt.
 * Motion is the conveyor choreography from the Bricx animated asset
 * (Figma node 1907:17535): every step is a 1000ms eased move followed by a
 * 1200ms dwell; eight steps share one 17600ms loop. Slots are fixed-width so
 * each step lands exactly one diya forward.
 */

type Feed = { count: number; names: { id: number; name: string }[] };

const SLOTS = 8;

export function DiyaProcession() {
  const [feed, setFeed] = useState<Feed>({ count: 0, names: [] });

  useEffect(() => {
    fetch("/api/lamp/count")
      .then((r) => r.json())
      .then((d) => d && setFeed({ count: d.count ?? 0, names: d.names ?? [] }))
      .catch(() => {});
  }, []);

  // Fill the belt: real names first, one invitational slot, ghosts if empty.
  const slots: (string | null)[] = Array.from({ length: SLOTS }, (_, i) => {
    if (!feed.names.length) return null;
    if (i === SLOTS - 1) return null; // the seat left open for the visitor
    return feed.names[i % feed.names.length].name;
  });

  return (
    <section className="overflow-hidden bg-[#0d1a29] px-0 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1800px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/50">
            The procession — every name walks to the river
          </p>
          {feed.count > 0 && (
            <p className="text-xs uppercase tracking-[0.16em] text-[#f0be78]/80">
              {feed.count} {feed.count === 1 ? "diya" : "diyas"} and counting
            </p>
          )}
        </div>
      </div>

      {/* The belt */}
      <div className="relative mt-10">
        <div className="overflow-hidden">
          <div className="flex w-max motion-safe:animate-[belt-advance_17.6s_cubic-bezier(0.45,0,0.25,1)_infinite] motion-reduce:translate-x-0">
            {[...slots, ...slots].map((name, i) => (
              <div key={i} className="w-[170px] shrink-0 px-2 md:w-[210px]">
                <BeltDiya name={name} delay={(i % SLOTS) * 340} ghost={i >= SLOTS} />
              </div>
            ))}
          </div>
        </div>
        {/* The rail they ride on — ticks like a belt track */}
        <div
          aria-hidden
          className="mx-auto mt-3 h-[3px] w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(240,190,120,0.28) 0 2px, transparent 2px 26px)",
          }}
        />
        <div aria-hidden className="h-px w-full bg-white/10" />
      </div>

      {/* Closing line */}
      <div className="mx-auto w-full max-w-[1800px] px-5 md:px-10">
        <div className="mt-14 flex flex-col items-start justify-between gap-8 md:mt-20 md:flex-row md:items-end">
          <h2 className="max-w-[620px] text-3xl font-medium leading-[1.12] tracking-[-0.02em] text-white md:text-[42px]">
            You may never stand on those steps on Dev Deepawali.
            <br />
            <span className="text-white/40">Your name will.</span>
          </h2>
          <a
            href="#offer"
            onMouseEnter={() => hoverFeedback("cta")}
            className="shrink-0 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
          >
            Light my lamp — ₹10
          </a>
        </div>
      </div>
    </section>
  );
}

function BeltDiya({ name, delay, ghost }: { name: string | null; delay: number; ghost: boolean }) {
  return (
    <div
      aria-hidden={ghost || undefined}
      className={
        name
          ? "flex items-center gap-2.5 rounded-full border border-[#f0be78]/25 bg-[#14263b] px-4 py-2.5"
          : "flex items-center gap-2.5 rounded-full border border-dashed border-white/20 bg-white/[0.03] px-4 py-2.5"
      }
    >
      <Flame size={13} delay={delay} muted={!name} />
      <span className={name ? "truncate text-sm text-white/85" : "truncate text-sm text-white/35"}>
        {name ?? "your name here"}
      </span>
    </div>
  );
}
