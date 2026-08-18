"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { faceHeading, faceIntro, faceWings } from "@/content/face";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * FaceTabs — the FACE mission as the Figma "Our Work" pattern (frame
 * 2147259990): a left rail of clickable tabs (active = dark with an arrow,
 * rest greyed) and a large rounded panel that swaps to the active wing.
 * Each tab is one letter of FACE; selecting it expands the full form.
 */
export function FaceTabs() {
  const [active, setActive] = useState(0);
  const wing = faceWings[active];

  return (
    <section id="work" className="scroll-mt-20 bg-[#f8f8f8] px-5 py-16 md:px-10 md:py-24">
      <Container padded={false}>
        <div className="mb-10 flex flex-col gap-2 md:mb-12 md:flex-row md:items-baseline md:justify-between">
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl">
            {faceHeading[0]} <span className="text-black/35">{faceHeading[1]}</span>
          </h2>
          <p className="max-w-[360px] text-sm text-ink-faint">{faceIntro}</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          {/* Tab rail */}
          <div
            role="tablist"
            aria-label="The FACE of Ganga"
            className="flex shrink-0 gap-2 overflow-x-auto [scrollbar-width:none] lg:w-[240px] lg:flex-col lg:gap-4 [&::-webkit-scrollbar]:hidden"
          >
            {faceWings.map((w, i) => {
              const selected = i === active;
              return (
                <button
                  key={w.letter}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => hoverFeedback("service")}
                  className={cn(
                    "flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-2 text-left text-xl font-medium tracking-[-0.01em] transition-colors lg:rounded-none lg:bg-transparent lg:px-2 lg:text-2xl",
                    selected
                      ? "bg-black text-white lg:bg-transparent lg:text-black"
                      : "bg-black/5 text-black/40 hover:text-black/70 lg:bg-transparent",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "hidden text-sm transition-opacity lg:inline",
                      selected ? "opacity-100" : "opacity-0",
                    )}
                  >
                    ▸
                  </span>
                  <span>
                    {w.letter}
                    <span className={cn(selected ? "" : "hidden lg:inline")}> — {w.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-2xl bg-white md:min-h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={wing.letter}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={wing.image}
                  alt={wing.name}
                  fill
                  sizes="(max-width: 1023px) calc(100vw - 40px), 70vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-6 md:p-9">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {wing.letter} — {wing.name}
                  </span>
                  <p className="max-w-[560px] text-2xl font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-3xl">
                    {wing.claim}
                  </p>
                  <p className="max-w-[520px] text-[15px] leading-relaxed text-white/75">
                    {wing.body}
                  </p>
                  <a
                    href={wing.ctaHref}
                    onMouseEnter={() => hoverFeedback("cta")}
                    className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
                  >
                    {wing.ctaLabel}
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
