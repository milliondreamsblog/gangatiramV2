"use client";

import { logos, trustedByHeading } from "@/content/logos";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

const cell =
  "flex items-center justify-center rounded-lg transition-colors duration-200";

export function TrustedBy() {
  return (
    <section className="bg-white px-4 py-14 md:px-10">
      <Container padded={false} className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {/* Label cell */}
        <div
          className={`${cell} col-span-2 min-h-[110px] w-[min(216px,100%)] justify-start p-6 sm:col-span-1 sm:aspect-[173/88] sm:min-h-0 sm:w-auto`}
        >
          <p className="text-sm leading-[1.4] text-ink-faint">
            {trustedByHeading[0]}
            <br />
            {trustedByHeading[1]}
          </p>
        </div>

        {/* Logo cells */}
        {logos.map((logo) => (
          <div
            key={logo.name}
            onMouseEnter={() => hoverFeedback("logo")}
            className={`${cell} group h-28 bg-surface p-4 hover:bg-[#efefef] sm:h-auto sm:aspect-[173/88] sm:p-6`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              className="max-h-8 w-auto max-w-[70%] object-contain opacity-60 grayscale transition-opacity duration-200 group-hover:opacity-90"
            />
          </div>
        ))}

        {/* And many more */}
        <div
          className={`${cell} col-span-2 min-h-[110px] w-[min(216px,100%)] justify-start border border-[#f0f0f0] p-6 sm:col-span-1 sm:aspect-[173/88] sm:min-h-0 sm:w-auto`}
        >
          <p className="text-sm text-ink-faint">Told across 75 places</p>
        </div>
      </Container>
    </section>
  );
}
