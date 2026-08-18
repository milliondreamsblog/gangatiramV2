"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

/**
 * ServiceProcess — Figma node 801:20502. Section heading + an interactive step
 * list on the left; clicking a step swaps the detail card on the right (week
 * pill, title, description and typical outputs). "Product Audit" is transcribed
 * from the frame; the remaining weeks follow the same shape.
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
    step: "Product Audit",
    week: "Week 1",
    title: "Product audit",
    description:
      "We review the current product, users, flows, competitors, business goals, analytics if available, and the places where people get stuck.",
    outputs: [
      "Product audit",
      "Competitor review",
      "Flow notes & UX issues",
      "Product sprint priorities",
    ],
  },
  {
    step: "User flows + IA",
    week: "Week 2",
    title: "User flows + IA",
    description:
      "We map the core journeys and information architecture so every screen has a clear job and users always know where they are and where to go next.",
    outputs: [
      "Journey maps",
      "Site / app map",
      "Information architecture",
      "Prioritised user flows",
    ],
  },
  {
    step: "Wireframes + UX",
    week: "Week 3",
    title: "Wireframes + UX",
    description:
      "We turn flows into low-fi wireframes and pressure-test the UX — layout, hierarchy and interaction — before any visual polish goes in.",
    outputs: [
      "Low-fi wireframes",
      "Key screen layouts",
      "Interaction notes",
      "Early usability checks",
    ],
  },
  {
    step: "Product UI",
    week: "Week 4",
    title: "Product UI",
    description:
      "We design the high-fidelity UI on a scalable design system — components, states and responsive layouts that look premium and stay consistent.",
    outputs: [
      "High-fidelity UI",
      "Design system",
      "Component states",
      "Responsive layouts",
    ],
  },
  {
    step: "Handoff + QA",
    week: "Week 5",
    title: "Handoff + QA",
    description:
      "We package the work for engineering — specs, tokens and assets — and QA the build so what ships matches the design pixel for pixel.",
    outputs: [
      "Dev-ready handoff",
      "Design tokens & assets",
      "Redlines & specs",
      "Build QA review",
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
          <span className="text-black/40">From messy flow to </span>
          product experience ready to build.
        </h2>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-14">
          {/* Step tabs */}
          <ul
            role="tablist"
            aria-label="Design process steps"
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
                src="/services/process-visual.png"
                alt="Camb AI app icon and colour system"
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
                <p className="text-base text-black/45">Typical outputs:</p>
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
