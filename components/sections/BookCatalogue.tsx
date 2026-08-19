"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  bookHeading,
  bookBlurb,
  bookPrice,
  bookShippingNote,
  bookBuyHref,
  bookMissionLine,
} from "@/content/book";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

/**
 * BookCatalogue — the printed book presented the way the design system
 * presents everything: inside photography. One full-bleed editorial panel
 * (the 108 temples of Kalna at sunset, from the book itself) with the CSS-3D
 * book floating in the scene — front, spine, back and paper edges built from
 * the real cover files. Front / Spine / Back rotate the object, the cursor
 * adds a light parallax tilt, and the purchase action sits in white over the
 * dusk, CtaBand-style.
 */

// Display geometry (px) — cover ratio ≈ 0.975, spine ≈ 10% of width.
const W = 340;
const H = 350;
const D = 34;

const VIEWS = [
  { label: "Front", angle: 26 },
  { label: "Spine", angle: 78 },
  { label: "Back", angle: 156 },
] as const;

export function BookCatalogue() {
  const [view, setView] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: ny * -10, y: nx * 12 });
  };

  const face = "absolute inset-0 [backface-visibility:hidden] overflow-hidden";

  return (
    <section id="the-book" className="scroll-mt-20 bg-white px-5 py-16 md:px-10 md:py-24">
      <Container padded={false}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-2 md:mb-12"
        >
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
            <span className="text-black/35">{bookHeading[0]} — </span>
            {bookHeading[1]}
          </h2>
        </motion.div>

        {/* The photographic panel — the book lives in the world it documents */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.08 }}
          onPointerMove={onMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          className="relative overflow-hidden rounded-3xl"
        >
          <Image
            src="/book/stage.png"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 1800px) 100vw, 1800px"
            className="photo-grade object-cover"
          />
          {/* Scrim: readable text right, open scene left */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/35 to-black/70"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

          <div className="relative grid grid-cols-1 gap-6 p-6 md:p-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            {/* 3D book in the scene */}
            <div className="grid min-h-[400px] place-items-center py-8 [perspective:1900px] md:min-h-[520px]">
              {/* Ground shadow */}
              <div
                aria-hidden
                className="absolute bottom-16 left-1/4 h-8 w-[36%] -translate-x-1/2 rounded-full bg-black/40 blur-2xl lg:left-[26%]"
              />
              <div className="scale-[0.8] [transform-style:preserve-3d] motion-safe:animate-[book-float_7s_ease-in-out_infinite] sm:scale-100">
                <div
                  className="relative transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]"
                  style={{ width: W, height: H, transform: `rotateY(${VIEWS[view].angle}deg)` }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-150 ease-linear [transform-style:preserve-3d]"
                    style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
                  >
                    <div
                      className={`${face} rounded-r-[6px] rounded-l-[2px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]`}
                      style={{
                        transform: `translateZ(${D / 2}px)`,
                        backgroundImage: "url(/book/front.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div
                      className={`${face} rounded-l-[6px] rounded-r-[2px]`}
                      style={{
                        transform: `rotateY(180deg) translateZ(${D / 2}px)`,
                        backgroundImage: "url(/book/back.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div
                      className="absolute top-0 h-full overflow-hidden"
                      style={{
                        width: D,
                        left: W / 2 - D / 2,
                        transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
                        backgroundImage: "url(/book/spine.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div
                      className="absolute top-0 h-full"
                      style={{
                        width: D,
                        left: W / 2 - D / 2,
                        transform: `rotateY(90deg) translateZ(${W / 2}px)`,
                        background:
                          "repeating-linear-gradient(to right, #f6f2e9 0px, #f6f2e9 2px, #e7e1d3 3px)",
                      }}
                    />
                    <div
                      className="absolute left-0 w-full"
                      style={{
                        height: D,
                        top: H / 2 - D / 2,
                        transform: `rotateX(90deg) translateZ(${H / 2}px)`,
                        background:
                          "repeating-linear-gradient(to bottom, #f6f2e9 0px, #f6f2e9 2px, #e7e1d3 3px)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* The offer, in white over the dusk */}
            <div className="flex flex-col justify-center gap-5 pb-4 text-white lg:pb-0 lg:pr-4">
              <p className="max-w-[520px] text-lg leading-[1.55] tracking-[-0.01em] text-white/85">
                {bookBlurb}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">
                300 pages · 240 photographs · 75 places · Gomukh → Gangasagar
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-4">
                <span className="font-serif text-5xl tracking-tight">{bookPrice}</span>
                <a
                  href={bookBuyHref}
                  onMouseEnter={() => hoverFeedback("cta")}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
                >
                  Buy Now
                  <ArrowUpRight size={16} />
                </a>
              </div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-white/55">
                {bookShippingNote}
              </p>

              <div className="mt-2 flex gap-2">
                {VIEWS.map((v, i) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setView(i)}
                    onMouseEnter={() => hoverFeedback("service")}
                    aria-pressed={view === i}
                    className={
                      view === i
                        ? "min-h-10 rounded-full bg-white px-5 text-sm font-medium text-black"
                        : "min-h-10 rounded-full bg-white/15 px-5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                    }
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <p className="mt-3 max-w-[460px] border-l-2 border-white/25 pl-4 text-sm leading-relaxed text-white/65">
                {bookMissionLine}
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
