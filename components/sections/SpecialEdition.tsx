"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { bookHref, shopHeading, shopIntro, shopItems, type ShopItem } from "@/content/shop";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

/**
 * SpecialEdition — "Look inside": six real spreads from the printed book as a
 * continuous marquee (same motion as the three-gifts strip: two identical sets,
 * pause on hover, native snap scroll on phones). One product, one price — every
 * card links to the live purchase flow.
 */
export function SpecialEdition() {
  return (
    <section id="book" className="overflow-hidden bg-[#f7f7f7] py-16 md:py-24">
      <Container className="mb-8 md:mb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#b08d57]/40 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-[#8a6c3f]">
              <span aria-hidden className="size-1.5 rounded-full bg-[#b08d57]" />
              From the printed book
            </span>
            <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
              {shopHeading[0]}
              <br />
              <span className="font-serif italic text-black/60">{shopHeading[1]}</span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="max-w-[380px] text-sm leading-relaxed text-ink-faint md:text-right">
              {shopIntro}
            </p>
            <a
              href={bookHref}
              onMouseEnter={() => hoverFeedback("cta")}
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              Get the Book — ₹999
            </a>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">
              free shipping pan-India · direct UPI · tracking in 24 hours
            </p>
          </div>
        </div>
      </Container>

      <div
        role="region"
        aria-label="Spreads from the printed book"
        tabIndex={0}
        className="group/vault snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:snap-none lg:scroll-px-0 lg:overflow-hidden lg:px-0 motion-reduce:overflow-x-auto"
      >
        <div className="group-hover/vault:[animation-play-state:paused] lg:motion-safe:animate-[testimonial-marquee-intro_1.7s_ease-out_forwards]">
          <div className="flex w-max [will-change:transform] group-hover/vault:[animation-play-state:paused] lg:motion-safe:animate-[testimonial-marquee_60s_linear_infinite]">
            {[...shopItems, ...shopItems].map((item, i) => (
              <SpreadCard key={`${item.slug}-${i}`} item={item} duplicate={i >= shopItems.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpreadCard({ item, duplicate = false }: { item: ShopItem; duplicate?: boolean }) {
  return (
    <a
      href={item.href}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      onMouseEnter={() => hoverFeedback("project")}
      className="group mr-4 flex w-[calc(100vw-2.5rem)] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white md:max-w-[440px]"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={item.image}
          alt={duplicate ? "" : item.name}
          fill
          sizes="(max-width: 767px) 340px, 440px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#b08d57] px-3 py-1.5 text-xs font-medium text-white">
            {item.badge}
          </span>
        )}
      </div>
      <div className="flex grow items-end justify-between gap-3 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.12em] text-ink-faint">{item.price}</span>
          <h3 className="text-lg font-medium leading-snug tracking-[-0.01em]">{item.name}</h3>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black/5 text-black transition-colors group-hover:bg-black group-hover:text-white">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </a>
  );
}
