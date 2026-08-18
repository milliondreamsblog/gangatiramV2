"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { testimonials, testimonialsHeading } from "@/content/testimonials";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

type Testimonial = (typeof testimonials)[number];

const DESKTOP_MARQUEE_DURATION_MS = 80_000;
const AUTOPLAY_RESUME_DELAY_MS = 6000;

function useMobileCarouselAutoplay(itemCount: number) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || itemCount < 2) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pauseUntil = 0;
    let pointerActive = false;
    let settleTimer: number | undefined;
    let animationFrame: number | undefined;
    let previousFrameTime: number | undefined;
    let autoplayActive = false;
    const initialInlineSnapType = scroller.style.scrollSnapType;

    const cards = () =>
      Array.from(
        scroller.querySelectorAll<HTMLElement>("[data-testimonial-card]"),
      );

    const targetLeft = (card: HTMLElement) => {
      const scrollerRect = scroller.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const paddingLeft = Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
      return scroller.scrollLeft + cardRect.left - scrollerRect.left - paddingLeft;
    };

    // The second card set makes the last-to-first transition seamless. Once
    // scrolling settles on a duplicate, jump to its identical original.
    const syncToNearestCard = () => {
      const allCards = cards();
      if (allCards.length < itemCount * 2) return;

      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      allCards.forEach((card, index) => {
        const distance = Math.abs(targetLeft(card) - scroller.scrollLeft);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });

      if (nearest >= itemCount) {
        const original = nearest - itemCount;
        scroller.scrollTo({ left: targetLeft(allCards[original]), behavior: "auto" });
      }
    };

    const scheduleSync = () => {
      // Continuous autoplay never "settles"; only normalize after manual
      // interaction (or when reduced motion leaves the carousel manual-only).
      if (
        !pointerActive &&
        Date.now() >= pauseUntil &&
        !reducedMotion.matches
      ) {
        return;
      }
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(syncToNearestCard, 180);
    };

    const pauseAutoplay = () => {
      pauseUntil = Date.now() + AUTOPLAY_RESUME_DELAY_MS;
      autoplayActive = false;
    };
    const onPointerDown = () => {
      pointerActive = true;
      pauseAutoplay();
    };
    const onPointerEnd = () => {
      pointerActive = false;
      pauseAutoplay();
      scroller.style.scrollSnapType = initialInlineSnapType;
    };
    const onDiscreteInteraction = () => {
      pauseAutoplay();
      scroller.style.scrollSnapType = initialInlineSnapType;
    };

    // Move across one complete set in the same 80 seconds as the desktop
    // marquee. scrollLeft keeps native touch scrolling available, while the
    // duplicate set makes the last-to-first reset visually seamless.
    const animate = (time: number) => {
      const elapsed = previousFrameTime
        ? Math.min(time - previousFrameTime, 64)
        : 0;
      previousFrameTime = time;

      const canAutoplay =
        !desktop.matches &&
        !reducedMotion.matches &&
        !document.hidden &&
        !pointerActive &&
        Date.now() >= pauseUntil;

      if (canAutoplay) {
        if (!autoplayActive) {
          autoplayActive = true;
          // Mandatory snap rounds every tiny scrollLeft update back to the
          // current card. Disable it only during continuous autoplay.
          scroller.style.scrollSnapType = "none";
        }

        const allCards = cards();
        if (allCards.length >= itemCount * 2) {
          const loopStart = targetLeft(allCards[0]);
          const loopEnd = targetLeft(allCards[itemCount]);
          const loopDistance = loopEnd - loopStart;

          if (loopDistance > 0) {
            let nextLeft =
              scroller.scrollLeft +
              (loopDistance / DESKTOP_MARQUEE_DURATION_MS) * elapsed;
            if (nextLeft >= loopEnd) {
              nextLeft = loopStart + (nextLeft - loopEnd);
            }
            scroller.scrollLeft = nextLeft;
          }
        }
      } else if (autoplayActive) {
        autoplayActive = false;
        scroller.style.scrollSnapType = initialInlineSnapType;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    scroller.addEventListener("scroll", scheduleSync, { passive: true });
    scroller.addEventListener("pointerdown", onPointerDown, { passive: true });
    scroller.addEventListener("pointerup", onPointerEnd, { passive: true });
    scroller.addEventListener("pointercancel", onPointerEnd, { passive: true });
    scroller.addEventListener("wheel", onDiscreteInteraction, { passive: true });
    scroller.addEventListener("keydown", onDiscreteInteraction);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (settleTimer) window.clearTimeout(settleTimer);
      scroller.style.scrollSnapType = initialInlineSnapType;
      scroller.removeEventListener("scroll", scheduleSync);
      scroller.removeEventListener("pointerdown", onPointerDown);
      scroller.removeEventListener("pointerup", onPointerEnd);
      scroller.removeEventListener("pointercancel", onPointerEnd);
      scroller.removeEventListener("wheel", onDiscreteInteraction);
      scroller.removeEventListener("keydown", onDiscreteInteraction);
    };
  }, [itemCount]);

  return scrollerRef;
}

function TestimonialCard({
  t,
  duplicate = false,
}: {
  t: Testimonial;
  duplicate?: boolean;
}) {
  return (
    <a
      href={t.clutch}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => hoverFeedback("project")}
      // The marquee renders two identical sets; the second is decorative.
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      aria-label={`${t.name}, ${t.role} — read the full review on Clutch`}
      data-testimonial-card
      className="group relative mr-4 block aspect-[445/621] w-[calc(100vw-2.5rem)] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-xl border border-line md:max-w-[443px] lg:w-[443px] lg:max-w-none"
    >
      {/* Layer: photo (progressive blur is baked in — scripts/bake_blur.py) */}
      <Image
        src={t.photo}
        alt={`${t.name}, ${t.role}`}
        fill
        sizes="(max-width: 768px) 340px, 443px"
        className="scale-105 object-cover transition-transform duration-500 ease-out group-hover:scale-100"
      />

      {/* Layer: hover dim — the image darkens ~20% while the CTA is shown */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
      />

      {/* Layer: dark gradient (bottom) for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-panel/85 via-panel/35 to-transparent"
      />

      {/* Layer: quote + name/role/logo, with a Clutch CTA that reveals on hover
          (slides up from the bottom, lifting the content above it). */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5">
        <p className="text-[17px] font-medium leading-[1.3] tracking-[-0.01em] text-white">
          {t.quote}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-medium tracking-[-0.01em] text-white">
              {t.name}
            </p>
            <p className="text-sm text-white/60">{t.role}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.logo}
            alt=""
            aria-hidden
            className="size-8 shrink-0 [filter:brightness(0)_invert(1)]"
          />
        </div>

        {/* Hover CTA — the whole card links to this Clutch review */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <div className="min-h-0 overflow-hidden">
            <div className="mt-[18px] flex items-center justify-between border-t border-white/15 pt-[18px]">
              <span className="text-sm font-medium tracking-[-0.01em] text-white">
                Walk her chapters
              </span>
              <span className="flex items-center gap-1.5 text-white/75">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export function Testimonials() {
  const scrollerRef = useMobileCarouselAutoplay(testimonials.length);

  return (
    <section id="testimonials" className="overflow-hidden bg-white py-16 md:py-24">
      <Container className="mb-8 md:mb-10">
        <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
          <span className="text-black/35">{testimonialsHeading[0]}</span>
          <br />
          {testimonialsHeading[1]}
        </h2>
      </Container>

      {/* Phones and tablets get an auto-advancing native snap carousel that
          remains manually scrollable. On desktop, two identical sets slide
          left by exactly half the track width for a seamless marquee. */}
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Client testimonials"
        tabIndex={0}
        className="group/marquee snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:snap-none lg:scroll-px-0 lg:overflow-hidden lg:px-0 motion-reduce:overflow-x-auto"
      >
        <div
          className="group-hover/marquee:[animation-play-state:paused] lg:motion-safe:animate-[testimonial-marquee-intro_1.7s_ease-out_forwards]"
        >
          <div
            className="flex w-max [will-change:transform] group-hover/marquee:[animation-play-state:paused] lg:motion-safe:animate-[testimonial-marquee_80s_linear_infinite]"
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard
                key={i}
                t={t}
                duplicate={i >= testimonials.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
