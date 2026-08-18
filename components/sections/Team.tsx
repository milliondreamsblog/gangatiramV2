"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { teamHeading, teamParagraphs, teamMembers } from "@/content/team";
import { bookACallHref, talkToFounderHref } from "@/content/site";
import { hoverFeedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";

/**
 * Decorative desk props scattered around the centered text — MacBook, Magic
 * Keyboard and a binder clip. Two motions compose:
 *  - Entrance: once the section is ~50% on screen each eases in from its
 *    corner-ward `from` offset. Delays are spread and durations kept similar
 *    so they start AND finish at clearly different times (staggered).
 *  - Parallax: `speed` drives a slow scroll-linked vertical drift (much less
 *    than the page scroll), settling near 0 when the section is centered, so
 *    the props read as sitting at a different depth.
 */
const PROPS = [
  {
    src: "/team/props/macbook.png",
    w: 1100,
    h: 979,
    className:
      "absolute right-[-15%] top-[38%] w-[42vw] min-w-[420px] max-w-[640px]",
    rotate: -14,
    from: { x: 220, y: 160 },
    delay: 0.4,
    duration: 1.05,
    speed: 55,
  },
  {
    src: "/team/props/keyboard.png",
    w: 900,
    h: 540,
    className:
      "absolute left-[-10%] top-[50%] w-[38vw] min-w-[360px] max-w-[580px]",
    rotate: 11,
    from: { x: -230, y: 150 },
    delay: 0.2,
    duration: 1.0,
    speed: 130,
  },
  {
    src: "/team/props/clip.png",
    w: 315,
    h: 360,
    className: "absolute left-[8%] top-[11%] w-[190px]",
    rotate: -12,
    from: { x: -110, y: -170 },
    delay: 0,
    duration: 1.0,
    speed: 210,
  },
] as const;

function FloatingProp({
  progress,
  shown,
  reduced,
  src,
  w,
  h,
  className,
  rotate,
  from,
  delay,
  duration,
  speed,
}: {
  progress: MotionValue<number>;
  shown: boolean;
  reduced: boolean;
  src: string;
  w: number;
  h: number;
  className: string;
  rotate: number;
  from: { x: number; y: number };
  delay: number;
  duration: number;
  speed: number;
}) {
  // Outer layer: scroll-linked parallax that drifts only while the section is
  // actually moving — scrolling in (0–0.4) and out (0.6–1). Each prop uses its
  // own `speed`, so those in/out drifts happen at clearly different rates
  // (distinct depth layers). It holds at 0 through the pinned window (~0.4–0.6)
  // so the props sit still while the panel is fixed.
  const parallaxY = useTransform(progress, [0, 0.4, 0.6, 1], [speed, 0, 0, -speed]);
  return (
    <motion.div
      aria-hidden
      style={reduced ? undefined : { y: parallaxY }}
      className={cn("pointer-events-none hidden lg:block", className)}
    >
      {/* Inner layer: one-off entrance (fade + drift from the corner). Its
          transform composes with the parallax on the parent. */}
      <motion.div
        style={{ rotate }}
        initial={false}
        animate={
          reduced || shown ? { x: 0, y: 0, opacity: 1 } : { x: from.x, y: from.y, opacity: 0 }
        }
        transition={{
          duration: reduced ? 0 : duration,
          delay: reduced ? 0 : delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Image src={src} alt="" width={w} height={h} className="h-auto w-full" />
      </motion.div>
    </motion.div>
  );
}

export function Team() {
  // When the "Talk to Founder" button is hovered, spotlight the first two
  // avatars (the founders) and dim the rest.
  const [founderHover, setFounderHover] = useState(false);
  const [activeMember, setActiveMember] = useState<number | null>(null);

  // Touch devices have no persistent hover state. A tapped avatar gets the
  // same scale + name treatment as desktop hover, then dismisses itself.
  useEffect(() => {
    if (activeMember === null) return;
    const timer = window.setTimeout(() => setActiveMember(null), 2500);
    return () => window.clearTimeout(timer);
  }, [activeMember]);

  // The props drift in once the pinned panel is ~50% on screen; a separate
  // scroll tracker drives their slow parallax drift across the whole pass.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const shown = useInView(sectionRef, { once: true, amount: 0.5 });
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  return (
    // Large screens get a 1.5-viewport wrapper with a sticky inner panel.
    // Smaller screens stay in normal flow so short devices never clip content.
    <div id="team" ref={wrapperRef} className="relative lg:h-[150svh]">
      <section
        ref={sectionRef}
        className="flex items-center overflow-hidden bg-white px-5 py-20 md:px-10 md:py-24 lg:sticky lg:top-0 lg:h-svh lg:py-0"
      >
        {PROPS.map((p) => (
          <FloatingProp
            key={p.src}
            progress={scrollYProgress}
            shown={shown}
            reduced={reduced}
            {...p}
          />
        ))}
        <div className="relative z-10 mx-auto flex w-full max-w-[560px] flex-col items-start">
        <h2 className="text-3xl font-medium tracking-[-0.02em] sm:text-4xl md:text-5xl md:leading-[1.05]">
          <span className="text-black/35">{teamHeading[0]}</span>
          <br />
          {teamHeading[1]}
        </h2>

        <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-[#3a3a3a] md:mt-7 md:gap-5 md:text-lg">
          {teamParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Avatar group — each is individually hoverable */}
        <div className="mt-9 flex">
          {teamMembers.map((member, i) => {
            const isFounder = i < 2;
            const isActive = activeMember === i;
            return (
              <button
                type="button"
                key={member.name}
                aria-label={`Show ${member.name}`}
                aria-pressed={isActive}
                onClick={() => setActiveMember((active) => (active === i ? null : i))}
                onMouseEnter={() => hoverFeedback("avatar")}
                className={cn(
                  "group relative -ml-2.5 rounded-full transition-opacity duration-300 first:ml-0 hover:z-30 focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:-ml-3.5",
                  isActive && "z-30",
                  founderHover && !isFounder && "opacity-30",
                  // Divij (index 1) sits on top of the founder stack on hover.
                  founderHover && isFounder && (i === 1 ? "z-40" : "z-30"),
                )}
              >
                {/* Tooltip */}
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-full left-1/2 z-40 mb-3 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg border border-white/15 bg-black/70 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100",
                    isActive && "translate-y-0 scale-100 opacity-100",
                  )}
                >
                  {member.name}
                  <span className="absolute left-1/2 top-full -mt-1 size-2 -translate-x-1/2 rotate-45 border-b border-r border-white/15 bg-black/70 backdrop-blur-md" />
                </div>

                {/* Avatar */}
                <div
                  className={cn(
                    "relative size-[clamp(36px,10vw,52px)] origin-bottom transition-transform duration-300 ease-out group-hover:scale-125 md:size-[60px]",
                    isActive && "scale-125",
                    founderHover && isFounder && "scale-105",
                  )}
                >
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={120}
                    height={120}
                    loading="eager"
                    sizes="(max-width: 767px) 52px, 60px"
                    className="size-full rounded-full object-cover"
                  />
                </div>

                {/* Green online-status dot — first two (founders) on hover */}
                {isFounder && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute bottom-0.5 right-0.5 z-50 size-3.5 origin-center scale-0 rounded-full border-[2.5px] border-white bg-success transition-transform duration-300 ease-out",
                      founderHover && "scale-100",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 md:mt-14 md:gap-3">
          <a
            href={bookACallHref}
            onMouseEnter={() => hoverFeedback("cta")}
            className="flex min-h-11 items-center rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] md:px-5 md:text-base"
          >
            Book a call
          </a>
          <a
            href={talkToFounderHref}
            onPointerEnter={(event) => {
              hoverFeedback("cta");
              // Touch browsers can retain a synthetic hover after a tap,
              // leaving the other avatars faded. Only enable the founder
              // spotlight for a real mouse/trackpad pointer.
              if (event.pointerType === "mouse") setFounderHover(true);
            }}
            onPointerLeave={() => setFounderHover(false)}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") setFounderHover(false);
            }}
            className="flex min-h-11 items-center rounded-full bg-black/5 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/10 md:text-base"
          >
            Talk to Founder
          </a>
        </div>
        </div>
      </section>
    </div>
  );
}
