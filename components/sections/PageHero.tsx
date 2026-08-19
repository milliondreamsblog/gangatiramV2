"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Navbar } from "@/components/sections/Navbar";
import { HeroCtas } from "@/components/sections/HeroCtas";
import { LiveClock } from "@/components/LiveClock";
import { clockCities } from "@/content/site";
import { cn } from "@/lib/utils";
import heroBg from "@/public/hero/hero-bg.png";

type PageHeroProps =
  | { variant: "home" }
  | {
      variant: "photo";
      image: string;
      eyebrow: string;
      headline: string;
      cta?: { label: string; href: string };
    }
  | {
      variant: "light";
      eyebrow: React.ReactNode;
      headline: React.ReactNode;
      headlineClassName?: string;
      subheadline?: string;
    };

export function PageHero(props: PageHeroProps) {
  if (props.variant === "home") return <HomeHero />;
  if (props.variant === "photo") return <PhotoHero {...props} />;
  return <LightHero {...props} />;
}

function LightHero({
  eyebrow,
  headline,
  headlineClassName,
  subheadline,
}: {
  eyebrow: React.ReactNode;
  headline: React.ReactNode;
  headlineClassName?: string;
  subheadline?: string;
}) {
  return (
    <section className="bg-white px-5 pb-10 pt-12 md:px-10 md:pb-10 md:pt-20">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="flex flex-col items-start gap-5 md:flex-1">
          {eyebrow}
          <h1
            className={cn(
              "text-[clamp(2.25rem,3.6vw,52px)] leading-[1.08] tracking-[-0.04em] text-ink-strong",
              headlineClassName,
            )}
          >
            {headline}
          </h1>
          {subheadline && (
            <p className="max-w-[560px] text-lg leading-[1.45] tracking-[-0.01em] text-black/55">
              {subheadline}
            </p>
          )}
        </div>

        <HeroCtas variant="light" />
      </div>
    </section>
  );
}

function PhotoHero({
  image,
  eyebrow,
  headline,
  cta,
}: {
  image: string;
  eyebrow: string;
  headline: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative aspect-[1440/900] max-h-svh min-h-[560px] w-full overflow-hidden bg-black">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="photo-grade object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-[1800px] px-5 pb-12 md:px-10 md:pb-16">
          <div className="max-w-[780px]">
            <span className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm tracking-[-0.01em] text-white">
              {eyebrow}
            </span>
            <h1 className="mt-6 text-[clamp(2.25rem,4.7vw,58px)] font-normal leading-[1.02] tracking-[-0.02em] text-white">
              {headline}
            </h1>
            <HeroCtas variant="photo" secondary={cta} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[max(100svh,40rem)] flex-col overflow-hidden text-white md:min-h-svh"
    >
      {/* Background (parallax layer) */}
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y }}>
        <Image
          src={heroBg}
          alt="The Ganga at dusk, lamps on her banks"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className={cn("photo-grade object-cover object-bottom", !reduced && "scale-[1.24]")}
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-black/15" />

      <Navbar />

      {/* Bottom content */}
      <div className="relative z-10 mx-auto mt-auto flex w-full max-w-[1800px] flex-col gap-8 px-5 pb-5 md:gap-10 md:px-10 md:pb-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 md:flex-row md:items-end">
          {/* Left: rating + headline */}
          <div className="flex flex-col items-start gap-5">
            <div className="flex h-7 items-center rounded-full bg-black/15 px-3 backdrop-blur-sm">
              <span className="text-sm tracking-[-0.01em]">300 pages · 240 photographs · 75 places</span>
            </div>
            <h1 className="max-w-[820px] text-[clamp(2.25rem,10.25vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.02em] md:text-[clamp(2.5rem,6vw,72px)]">
              2,525 Kilometers{" "}
              <br className="hidden md:block" />
              of Heritage
            </h1>
          </div>

          {/* Right: CTAs */}
          <HeroCtas variant="home" />
        </div>

        {/* Divider + city clocks */}
        <div className="flex flex-col gap-6">
          <div className="h-px w-full bg-white/30" />
          <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[-0.02em] sm:text-xs">
            {clockCities.map((c, i) => (
              <div key={c.city} className={cn("whitespace-nowrap", i === 1 && "text-right")}>
                <span className="mr-2 sm:mr-4 md:mr-6">{c.label}</span>
                <LiveClock timeZone={c.timeZone} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
