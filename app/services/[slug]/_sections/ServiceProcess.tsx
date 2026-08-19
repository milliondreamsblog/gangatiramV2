"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

/**
 * ServiceProcess — "How a place enters the book." The five stages every
 * chapter goes through before it is printed, told as an interactive step
 * list: clicking a stage swaps the detail card (stage pill, title,
 * description, and what each stage brings back).
 */
type Step = {
  step: string;
  week: string;
  title: string;
  description: string;
  outputs: string[];
};

const STEPS: Step[] = [
  {
    step: "Reach the place",
    week: "Stage 1",
    title: "Reach the place",
    description:
      "Every place is met in river order, by her bank. We arrive slow, stay close to the water, and let the place set the pace before a camera comes out.",
    outputs: [
      "Days spent on the bank",
      "The river-order route",
      "First conversations",
      "The place's own pace",
    ],
  },
  {
    step: "Meet the witness",
    week: "Stage 2",
    title: "Meet the witness",
    description:
      "Each chapter stands on one named person — a boatman, a dyer, a sweeper of ghats — whose labour or memory carries the truth of the place.",
    outputs: [
      "One named witness",
      "Consent on record",
      "Their words, kept verbatim",
      "A truth no other place repeats",
    ],
  },
  {
    step: "Photograph the periphery",
    week: "Stage 3",
    title: "Photograph the periphery",
    description:
      "The postcard shot is banned. We photograph the edges — hands, preparation, aftermath, available light — where the real life of a place actually happens.",
    outputs: [
      "The periphery, not the postcard",
      "Available light only",
      "The worn and the human",
      "One frame that stays",
    ],
  },
  {
    step: "Verify every number",
    week: "Stage 4",
    title: "Verify every number",
    description:
      "Specificity is the anti-cliché. The glacier's retreat in metres, the river-kilometre, the date — every claim is checked, and generic poetry is cut.",
    outputs: [
      "Dates and distances, checked",
      "Sources on file",
      "At least one hard number",
      "No generic devotion",
    ],
  },
  {
    step: "Give it back",
    week: "Stage 5",
    title: "Give it back",
    description:
      "Nothing is only taken. Part of every copy sold returns to the place through the FACE mission — cleanups, looms, archives — with the work published monthly.",
    outputs: [
      "A FACE wing assigned",
      "Work funded on the ground",
      "Accounts published monthly",
      "The place, kept alive",
    ],
  },
];

export function ServiceProcess() {
  const [active, setActive] = useState(0);
  const current = STEPS[active];

  return (
    <section className="bg-white px-5 py-16 md:px-10 md:py-20">
      <Container padded={false}>
        <h2 className="max-w-[900px] text-[clamp(1.75rem,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em]">
          <span className="text-black/40">How a place </span>
          enters the book.
        </h2>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-14">
          {/* Stage tabs */}
          <ul
            role="tablist"
            aria-label="How a place enters the book"
            className="flex shrink-0 flex-col gap-4 lg:w-[302px]"
          >
            {STEPS.map((s, i) => {
              const selected = i === active;
              return (
                <li key={s.step}>
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
                    {s.step}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Detail card */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 lg:flex-1 lg:flex-row">
            <div className="relative aspect-[527/412] shrink-0 bg-[#f4f4f5] lg:aspect-auto lg:w-[527px]">
              <Image
                src="/work/cards/art.png"
                alt="A painter at work on the river's bank"
                fill
                sizes="(max-width: 1024px) 100vw, 527px"
                className="object-cover"
              />
            </div>
            <div
              key={active}
              className="flex flex-col justify-between gap-8 p-7 lg:w-[420px]"
            >
              <div>
                <span className="inline-flex rounded-full bg-black/[0.04] px-3 py-1.5 text-sm text-black/60">
                  {current.week}
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
