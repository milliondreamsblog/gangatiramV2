"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs, faqHeading, faqHelp } from "@/content/faqs";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";
import avatar1 from "@/public/team/avatars/festivals.png";
import avatar2 from "@/public/team/avatars/craft.png";
import { Container } from "@/components/ui/Container";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-white px-5 py-20 md:px-10 md:py-28">
      <Container padded={false} className="flex flex-col gap-12 lg:flex-row lg:gap-20">
        {/* Left column: heading + help card */}
        <div className="flex shrink-0 flex-col justify-between gap-10 lg:w-[500px]">
          <h2 className="max-w-[500px] text-4xl font-medium leading-[1.08] tracking-[-0.02em] md:text-5xl">
            <span className="text-black/60">{faqHeading[0]}</span>
            <span>{faqHeading[1]}</span>
          </h2>

          <div className="flex w-full flex-col gap-6 rounded-lg border border-[#f2f2f2] p-6 sm:max-w-[269px]">
            <div className="flex -space-x-3.5">
              <Image
                src={avatar1}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full border-2 border-white object-cover"
              />
              <Image
                src={avatar2}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full border-2 border-white object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-lg font-medium tracking-[-0.01em]">{faqHelp.title}</p>
              <p className="text-sm leading-[1.4] text-black/60">
                {faqHelp.emailIntro}
                <a href="#whatsapp-group-link" className="font-medium text-black underline-offset-2 hover:underline">
                  {faqHelp.email}
                </a>
                {faqHelp.emailOutro}
              </p>
            </div>
            <a
              href={`mailto:${faqHelp.email}?subject=Quote request`}
              onMouseEnter={() => hoverFeedback("cta")}
              className="rounded-full bg-black px-5 py-2.5 text-center text-base font-medium tracking-[-0.01em] text-white transition-transform hover:scale-[1.02]"
            >
              {faqHelp.cta}
            </a>
          </div>
        </div>

        {/* Right column: accordion. Reserve the tallest expanded height so the
            layout doesn't jump when switching between answers of different lengths. */}
        <div className="flex flex-1 flex-col gap-2 lg:min-h-[520px]">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                onMouseEnter={() => hoverFeedback("faq")}
                className={cn(
                  "rounded-lg border transition-colors",
                  isOpen
                    ? "border-transparent bg-[#f9f9f9]"
                    : "border-[#f2f2f2] bg-white hover:border-transparent hover:bg-[#f4f4f4]",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-start justify-between gap-3 px-6 py-5 text-left"
                >
                  <span className="text-lg font-medium tracking-[-0.01em] text-black">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={24}
                    className={cn(
                      "mt-0.5 shrink-0 text-black/70 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-base leading-[1.55] text-black/60">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
