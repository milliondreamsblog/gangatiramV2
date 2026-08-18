// components/sections/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BricxLogo } from "@/components/BricxLogo";
import { RiverBand } from "@/components/sections/RiverBand";
import { footerColumns, footerTagline } from "@/content/site";
import watermark from "@/public/footer-watermark.svg";
import { pixelify } from "@/components/footer-game/font";

const BrickBreaker = dynamic(
  () => import("@/components/footer-game/BrickBreaker").then((m) => m.BrickBreaker),
  { ssr: false }
);

// Eased window scroll for a gentle, consistent glide (native "smooth" varies by
// browser and distance). Uses easeInOutCubic over the given duration.
function smoothScrollTo(targetY: number, duration: number) {
  const startY = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const endY = Math.max(0, Math.min(targetY, maxY));
  const diff = endY - startY;
  if (Math.abs(diff) < 2) return;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let startTs: number | null = null;
  const step = (ts: number) => {
    if (startTs === null) startTs = ts;
    const t = Math.min((ts - startTs) / duration, 1);
    window.scrollTo(0, startY + diff * ease(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

type Column = (typeof footerColumns)[number];

function LinkColumn({ column }: { column: Column }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-black">{column.title}</p>
      <ul className="flex flex-col gap-3">
        {column.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-[#666] transition-colors hover:text-black"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [services, quickLinks, industries, contact, legal] = footerColumns;
  // Logo goes home from every page; on the homepage itself it scrolls to top.
  const homeHref = usePathname() === "/" ? "#top" : "/";
  const [active, setActive] = useState(false);
  const [playHeight, setPlayHeight] = useState(560);
  const reduce = useReducedMotion();
  const playRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A phone-width field is only ~350px across, so the wordmark shrinks to a
    // short band and the play area would otherwise be mostly empty white. Trim
    // it there — but not so far that the ball reaches the floor before a
    // player can react.
    const compute = () => {
      const cap = window.innerWidth < 640 ? 460 : 560;
      setPlayHeight(Math.min(Math.round(window.innerHeight * 0.7), cap));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);


  // Scroll the play field into view once it has finished expanding — waiting for
  // the expand animation to complete means the region is at its final height and
  // the game has loaded, so we center the real game rather than a half-open panel.
  const scrollGameIntoView = () => {
    const el = playRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
    if (reduce) {
      window.scrollTo(0, targetY);
    } else {
      smoothScrollTo(targetY, 900);
    }
  };

  return (
    <>
    <RiverBand />
    <footer className="relative overflow-hidden bg-white px-5 pt-16 md:px-8 md:pt-20">
      <div
        className={`relative z-10 mx-auto flex w-full max-w-[1800px] flex-col gap-16 transition-opacity duration-500 lg:flex-row lg:justify-between lg:gap-20 ${
          active ? "pointer-events-none opacity-20" : "opacity-100"
        }`}
      >
        {/* Left: logo + tagline */}
        <div className="flex flex-col justify-between gap-16 lg:gap-0">
          <Link href={homeHref} aria-label="Ganga Tiram home" className="flex items-center gap-2">
            <BricxLogo className="text-black" />
          </Link>
          <p className="text-[clamp(1.75rem,4vw,40px)] font-medium leading-[1.08] tracking-[-0.03em] text-black/60">
            {footerTagline[0]}
            <br />
            <a href={`mailto:${footerTagline[1]}`} className="hover:text-black">
              {footerTagline[1]}
            </a>
          </p>
        </div>

        {/* Right: link columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16 lg:gap-20">
          <div className="flex flex-col gap-14">
            <LinkColumn column={services} />
            <LinkColumn column={quickLinks} />
          </div>
          <LinkColumn column={industries} />
          <div className="flex flex-col gap-14">
            <LinkColumn column={contact} />
            <LinkColumn column={legal} />
          </div>
        </div>
      </div>

      {/* watermark / play field region */}
      <motion.div
        ref={playRef}
        className="relative mt-12"
        initial={false}
        animate={{ height: active ? playHeight : "auto" }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (active) scrollGameIntoView();
        }}
      >
        <button
          type="button"
          aria-label="Play the Ganga Tiram brick-breaker game"
          disabled={active}
          onClick={() => setActive(true)}
          className="group relative block w-full cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <Image
            src={watermark}
            alt=""
            aria-hidden
            className={`pointer-events-none relative z-0 w-full select-none transition-opacity duration-500 ${
              active ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Play chip — Figma 1563:5007: pixel face on a pressed-key base
              (black border, 5px darker bottom edge). Shown/hidden and labelled
              entirely in CSS (see .play-chip in globals.css) so it is already
              correct in the server HTML, before any JavaScript runs. */}
          <span
            aria-hidden
            className={`play-chip pointer-events-none absolute left-1/2 top-1/2 z-10 transition-all duration-200 ease-out ${
              active ? "play-chip-hidden" : ""
            }`}
          >
            {/* Scaled down under sm: the watermark is only ~56px tall on a
                phone, so the desktop chip covered it almost entirely. */}
            <span className="block rounded-[4px] border border-black bg-[#dbdbdb] pb-[3px] sm:rounded-[6px] sm:pb-[5px]">
              <span
                className={`${pixelify.className} flex h-[22px] items-center justify-center rounded-[5px] bg-white px-2.5 text-[11px] tracking-[-0.02em] text-[#222020] sm:h-9 sm:rounded-[7px] sm:px-4 sm:text-[16px]`}
              >
                <span className="play-chip-pointer">Click to Play</span>
                <span className="play-chip-touch">Tap to Play</span>
              </span>
            </span>
          </span>
        </button>
        {active && <BrickBreaker onExit={() => setActive(false)} />}
      </motion.div>
    </footer>
    </>
  );
}
