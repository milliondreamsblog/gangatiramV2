"use client";

import { ArrowUpRight } from "lucide-react";
import { work } from "@/content/work";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

export function Showcase() {
  return (
    <section id="work" className="bg-white px-5 py-16 md:px-10 md:py-24">
      <Container padded={false}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl">
            The FACE <span className="text-black/35">of Ganga</span>
          </h2>
          <p className="text-sm text-ink-faint">
            Festivals · Art · Craft & Cuisine · Environment — four promises, kept monthly
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {work.map((card) => (
            <a
              key={card.name}
              href={card.href}
              aria-label={`View ${card.name} case study`}
              onMouseEnter={() => hoverFeedback("project")}
              className="group relative block aspect-[674/622] overflow-hidden rounded-2xl"
              style={{ backgroundColor: card.bg }}
            >
              {/* Layer: full-bleed background — the card render (fills exactly),
                  or a looping muted video when one is provided. */}
              {card.video ? (
                <video
                  src={card.video}
                  poster={card.mockup}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.mockup}
                  alt=""
                  aria-hidden
                  className="photo-grade absolute inset-0 size-full object-cover transition-transform duration-[600ms] group-hover:scale-110"
                />
              )}

              {/* Scrim: hides the baked header (the header region is solid card
                  colour, so this is seamless) and keeps the real header legible. */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[19%]"
                style={{
                  background: `linear-gradient(to bottom, ${card.bg} 0%, ${card.bg} 78%, transparent 100%)`,
                }}
              />

              {/* Layer: real header */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-7">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.logo} alt={`${card.name} logo`} className="size-10 rounded-lg" />
                  <div>
                    <p
                      className={cn(
                        "text-lg font-semibold tracking-[-0.01em]",
                        card.dark ? "text-white" : "text-black",
                      )}
                    >
                      {card.title}
                    </p>
                    {card.subtitle && (
                      <p className={cn("text-sm", card.dark ? "text-white/50" : "text-black/50")}>
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-lg transition-colors",
                    card.dark
                      ? "bg-white/10 text-white group-hover:bg-white/20"
                      : "bg-black/5 text-black group-hover:bg-black/10",
                  )}
                >
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
