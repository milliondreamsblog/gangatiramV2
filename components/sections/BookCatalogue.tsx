"use client";

import { useState, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  bookHeading,
  bookBlurb,
  bookPrice,
  bookShippingNote,
  bookBuyHref,
  bookSpecs,
  bookMissionLine,
} from "@/content/book";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

/**
 * BookCatalogue — the printed book as a real CSS-3D object: front, spine,
 * back, and a paper edge assembled into a box (cover ratio 1306×1340, spine
 * 130 → ~10% thickness). Front / Spine / Back buttons rotate the object;
 * the cursor adds a light parallax tilt; the whole book idles on a float
 * animation with a soft ground shadow. Catalogue specs + Buy Now on the right.
 */

// Display geometry (px) — cover ratio ≈ 0.975, spine ≈ 10% of width.
const W = 350;
const H = 360;
const D = 36;

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
          className="mb-10 flex flex-col gap-2 md:mb-14"
        >
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
            <span className="text-black/35">{bookHeading[0]} — </span>
            {bookHeading[1]}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* 3D book stage */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="flex flex-col gap-4"
          >
            <div
              onPointerMove={onMove}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
              className="relative grid min-h-[460px] place-items-center overflow-hidden rounded-2xl bg-[#f2efe9] py-14 [perspective:1900px] md:min-h-[540px]"
            >
              {/* Ground shadow */}
              <div
                aria-hidden
                className="absolute bottom-14 left-1/2 h-8 w-[62%] -translate-x-1/2 rounded-full bg-black/25 blur-2xl"
              />

              {/* Float wrapper */}
              <div className="scale-[0.82] [transform-style:preserve-3d] motion-safe:animate-[book-float_7s_ease-in-out_infinite] sm:scale-100">
                {/* View rotation (buttons) */}
                <div
                  className="relative transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]"
                  style={{
                    width: W,
                    height: H,
                    transform: `rotateY(${VIEWS[view].angle}deg)`,
                  }}
                >
                  {/* Cursor tilt (fast layer) */}
                  <div
                    className="absolute inset-0 transition-transform duration-150 ease-linear [transform-style:preserve-3d]"
                    style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
                  >
                    {/* Front cover */}
                    <div
                      className={`${face} rounded-r-[6px] rounded-l-[2px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)]`}
                      style={{
                        transform: `translateZ(${D / 2}px)`,
                        backgroundImage: "url(/book/front.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    {/* Back cover */}
                    <div
                      className={`${face} rounded-l-[6px] rounded-r-[2px]`}
                      style={{
                        transform: `rotateY(180deg) translateZ(${D / 2}px)`,
                        backgroundImage: "url(/book/back.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    {/* Spine (left) */}
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
                    {/* Page edge (right) */}
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
                    {/* Top page edge */}
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

            {/* View buttons — rotate the object */}
            <div className="flex gap-2">
              {VIEWS.map((v, i) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setView(i)}
                  onMouseEnter={() => hoverFeedback("service")}
                  aria-pressed={view === i}
                  className={
                    view === i
                      ? "min-h-10 rounded-full bg-black px-5 text-sm font-medium text-white"
                      : "min-h-10 rounded-full bg-black/5 px-5 text-sm font-medium text-black transition-colors hover:bg-black/10"
                  }
                >
                  {v.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Catalogue details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-col"
          >
            <p className="max-w-[520px] text-lg leading-[1.55] tracking-[-0.01em] text-black/60">
              {bookBlurb}
            </p>

            <dl className="mt-8 border-t border-black/10">
              {bookSpecs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between gap-6 border-b border-black/10 py-3.5"
                >
                  <dt className="text-xs uppercase tracking-[0.12em] text-black/45">{s.label}</dt>
                  <dd className="text-right text-[15px] font-medium tracking-[-0.01em]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="font-serif text-4xl tracking-tight">{bookPrice}</span>
              <a
                href={bookBuyHref}
                onMouseEnter={() => hoverFeedback("cta")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-7 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
              >
                Buy Now
                <ArrowUpRight size={16} />
              </a>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-black/45">
              {bookShippingNote}
            </p>

            <p className="mt-8 border-l-2 border-black/15 pl-4 text-sm leading-relaxed text-black/55">
              {bookMissionLine}
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
