"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

/**
 * LampReturns — "Ten rupees, five returns." Same interactive step list as
 * ServiceProcess ("How a place enters the book"): a rail of stages on the
 * left, one detail card on the right with photo, stage pill, description,
 * and what each return brings back.
 */
type Return = {
  step: string;
  pill: string;
  title: string;
  description: string;
  outputs: string[];
};

const RETURNS: Return[] = [
  {
    step: "A diya with your name",
    pill: "Return 1",
    title: "A diya with your name",
    description:
      "A hand-thrown clay lamp, filled with oil, a wick set, your name beside it. On the night, a priest lights it and a hand places it on the ghat — it is not printed on a screen, it burns.",
    outputs: [
      "Hand-thrown clay, real oil",
      "Lit by a priest",
      "Placed by hand on the ghat",
      "Your name beside the flame",
    ],
  },
  {
    step: "The night, live",
    pill: "Return 2",
    title: "The night, live",
    description:
      "Eighty-four ghats lit at once, the aartis, the river carrying lakhs of flames. We stream the night as it unfolds — join from any city in the world and watch the ghats burn.",
    outputs: [
      "The live stream link",
      "The aartis, as they happen",
      "Every ghat alight",
      "A seat by the river, anywhere",
    ],
  },
  {
    step: "Your clip",
    pill: "Return 3",
    title: "Your clip",
    description:
      "Within three days of the night, a short video of your own diya burning on the ghat reaches your email or WhatsApp — proof, not a promise.",
    outputs: [
      "Your diya, on video",
      "Within three days",
      "Sent to email or WhatsApp",
      "Yours to keep and share",
    ],
  },
  {
    step: "Your Diya Card",
    pill: "Return 4",
    title: "Your Diya Card",
    description:
      "Every name gets an issued card — festival colour, a serial number, your name in type, your line on the signature. Made to be saved, sent, and passed on.",
    outputs: [
      "One card per name",
      "Numbered like a pass",
      "Your dedication, on the line",
      "Made to be shared",
    ],
  },
  {
    step: "The cleanup, in numbers",
    pill: "Return 5",
    title: "The cleanup, in numbers",
    description:
      "When Kashi wakes, the same ten rupees returns to the river — gloves, sacks, hands on the steps. What the morning lifted is published for every eye.",
    outputs: [
      "The morning-after cleanup",
      "Gloves and sacks funded",
      "The account, published",
      "From the river, back to the river",
    ],
  },
];

export function LampReturns() {
  const [active, setActive] = useState(0);
  const current = RETURNS[active];

  return (
    <section className="bg-[#f7f7f7] px-5 py-16 md:px-10 md:py-20">
      <Container padded={false}>
        <h2 className="max-w-[900px] text-[clamp(1.75rem,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em]">
          <span className="text-black/40">Ten rupees, </span>
          five returns.
        </h2>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-14">
          {/* Return tabs */}
          <ul
            role="tablist"
            aria-label="Ten rupees, five returns"
            className="flex shrink-0 flex-col gap-4 lg:w-[302px]"
          >
            {RETURNS.map((r, i) => {
              const selected = i === active;
              return (
                <li key={r.step}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => hoverFeedback("service")}
                    className={cn(
                      "flex items-center gap-2 text-left text-2xl tracking-[-0.02em] transition-colors",
                      selected ? "text-black" : "text-black/30 hover:text-black/60",
                    )}
                  >
                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      className={cn(
                        "shrink-0 transition-all",
                        selected ? "opacity-100" : "-ml-6 opacity-0",
                      )}
                    />
                    {r.step}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Detail card */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white lg:flex-1 lg:flex-row">
            <div className="relative aspect-[527/412] shrink-0 bg-[#f4f4f5] lg:aspect-auto lg:w-[527px]">
              <Image
                src="/event/lamps-haridwar.png"
                alt="Lamps burning by the river at night"
                fill
                sizes="(max-width: 1024px) 100vw, 527px"
                className="photo-grade object-cover"
              />
            </div>
            <div
              key={active}
              className="flex flex-col justify-between gap-8 p-7 lg:w-[420px]"
            >
              <div>
                <span className="inline-flex rounded-full bg-black/[0.04] px-3 py-1.5 text-sm text-black/60">
                  {current.pill}
                </span>
                <h3 className="mt-4 text-[28px] font-normal tracking-[-0.01em]">
                  {current.title}
                </h3>
                <p className="mt-3 text-base leading-[1.45] text-black/55">
                  {current.description}
                </p>
              </div>
              <div>
                <p className="text-base text-black/45">What comes back:</p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {current.outputs.map((o) => (
                    <p key={o} className="text-base font-medium tracking-[-0.01em]">
                      {o}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
