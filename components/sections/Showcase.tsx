"use client";

import { ArrowUpRight } from "lucide-react";
import { work } from "@/content/work";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

export function Showcase() {
  return (
    <section id="work" className="bg-white px-4 py-16 md:px-10 md:py-24">
      <Container padded={false}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl">
            The FACE <span className="text-black/35">of Ganga</span>
          </h2>
          <p className="text-sm text-ink-faint">
            Festivals · Art · Craft & Cuisine · Environment — four promises, kept monthly
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-3">
          {work.map((card) => (
            <a
              key={card.name}
              href={card.href}
              aria-label={`View ${card.name} case study`}
              onMouseEnter={() => hoverFeedback("project")}
              className="group relative flex flex-col gap-3 md:block md:aspect-[674/622] md:overflow-hidden md:rounded-2xl"
            >
              <div
                className="relative aspect-[361/258] w-full overflow-hidden rounded-lg md:absolute md:inset-0 md:aspect-auto md:rounded-2xl"
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
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 md:group-hover:scale-110"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.mockup}
                    alt=""
                    aria-hidden
                    className="photo-grade absolute inset-0 size-full object-cover transition-transform duration-[600ms] group-hover:scale-105 md:group-hover:scale-110"
                  />
                )}

                {/* The source images include a small baked header. This soft mask
                    keeps it hidden while preserving each composition. */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[19%]"
                  style={{
                    background: `linear-gradient(to bottom, ${card.bg} 0%, ${card.bg} 78%, transparent 100%)`,
                  }}
                />
              </div>

              {/* On phones the caption sits below the 361:258 image, matching the
                  measured mobile composition. Desktop keeps the overlay. */}
              <div className="flex items-center justify-between md:absolute md:inset-x-0 md:top-0 md:items-start md:p-7">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.logo} alt={`${card.name} logo`} className="size-10 rounded-lg" />
                  <div>
                    <p
                      className={cn(
                        "text-lg font-semibold tracking-[-0.02em] text-[#262626]",
                        card.dark ? "md:text-white" : "md:text-black",
                      )}
                    >
                      {card.title}
                    </p>
                    {card.subtitle && (
                      <p
                        className={cn(
                          "text-base leading-[1.08] tracking-[-0.04em] text-[#262626]/60",
                          card.dark ? "md:text-sm md:text-white/50" : "md:text-sm md:text-black/50",
                        )}
                      >
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "hidden size-9 place-items-center rounded-lg transition-colors md:grid",
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
