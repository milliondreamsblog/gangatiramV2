"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BricxLogo } from "@/components/BricxLogo";
import { bookACallHref } from "@/content/site";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

/**
 * CtaBand — Figma node 863:12683. A full-bleed sunset-bridge photo with a 40%
 * black scrim; Bricx mark + San Francisco live clock along the top, and the
 * two-tone headline + "Book a call" pill along the bottom. Shared by the
 * Industry and Service templates.
 */
export function CtaBand({
  headingGrey = "Walk With the River — ",
  headingWhite = "All 2,525 Kilometres of Her",
}: {
  headingGrey?: string;
  headingWhite?: string;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src="/industries/cta-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-black/40" />

      <Container
        padded={false}
        className="relative flex min-h-[520px] flex-col justify-between p-6 md:min-h-[600px] md:p-10"
      >
        {/* Top row: brand + locale clock */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BricxLogo className="text-white" />
          </div>
          <div className="flex items-center gap-6 text-xs uppercase tracking-[-0.02em] text-white">
            <span>Varanasi</span>
            <SanFranciscoClock />
          </div>
        </div>

        {/* Bottom row: headline + CTA */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="max-w-[512px] text-[clamp(2rem,3.6vw,48px)] font-medium leading-[1.08] tracking-[-0.04em] text-white">
            <span className="text-white/40">{headingGrey}</span>
            {headingWhite}
          </h2>
          <a
            href={bookACallHref}
            onMouseEnter={() => hoverFeedback("cta")}
            className="flex h-8 shrink-0 items-center rounded-lg bg-white px-4 text-sm font-medium tracking-[-0.02em] text-cta-ink transition-transform hover:scale-[1.03]"
          >
            Book a call
          </a>
        </div>
      </Container>
    </section>
  );
}

/** Live San Francisco time as `[ HH:MM:SS ]`; empty on the server to avoid a
 *  hydration mismatch, then fills in and ticks once mounted. */
function SanFranciscoClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">[ {time || "--:--:--"} ]</span>;
}
