import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { EventCountdown, JoinBlock } from "@/components/sections/DevDeepawaliJoin";
import { LampStory } from "@/components/sections/lamp/LampStory";
import { LampOffer } from "@/components/sections/lamp/LampOffer";
import { LampReturns } from "@/components/sections/lamp/LampReturns";
import { DiyaProcession } from "@/components/sections/lamp/DiyaProcession";

export const metadata: Metadata = {
  title: "Dev Deepawali — a diya with your name on the ghats of Kashi",
  description:
    "On 24 November 2026, Varanasi lights all 84 ghats with lakhs of lamps. For ₹10, a priest lights a diya carrying your name on the ghat — streamed live, your clip sent to you — and the same ten rupees cleans the river when the festival ends.",
  alternates: { canonical: "/dev-deepawali" },
};

/** "Where ten rupees goes" — centered heading over three quiet text columns.
 *  (Layout: Bricx Website v7, node 581:6267 — the centered testimonial grid.) */
const DUTIES = [
  {
    title: "The lamp",
    body: "A hand-thrown earthen diya, oil, a wick, and a priest to light it — placed on the ghat with your name beside the flame.",
  },
  {
    title: "The witness",
    body: "The night is streamed live. Within three days, a clip of your own diya burning reaches your phone — proof, not a promise.",
  },
  {
    title: "The morning",
    body: "When Kashi wakes, the same coin returns to the river: gloves, sacks, hands on the steps — and a published account of what was lifted.",
  },
];

export default function DevDeepawaliPage() {
  return (
    <PageShell nav="overlay" layout="clip">
      <PageHero
        variant="photo"
        image="/event/lamps-varanasi.png"
        eyebrow="Dev Deepawali · 24 November 2026 · Kashi"
        headline="Your name, burning on the ghats of Kashi."
      />

      {/* Countdown */}
      <section className="bg-white px-5 py-14 md:px-10 md:py-20">
        <Container padded={false} className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="flex max-w-[520px] flex-col items-start gap-4">
            <p className="text-xs uppercase tracking-[0.14em] text-black/50">
              Kartik Purnima — the night the gods come down to the ghats
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-4xl">
              One night. Eighty-four ghats.
              <br />
              <span className="text-black/40">One of the lamps can be yours.</span>
            </h2>
            <a
              href="#offer"
              className="mt-1 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              Light my lamp — ₹10
            </a>
          </div>
          <EventCountdown />
        </Container>
      </section>

      {/* The two offerings — node 581:6338 layout */}
      <LampStory />

      {/* Where ten rupees goes — node 581:6267 layout */}
      <section className="bg-white px-5 py-16 md:px-10 md:py-24">
        <Container padded={false} className="flex flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#b08d57]/40 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-[#8a6c3f]">
            <span aria-hidden className="size-1.5 rounded-full bg-[#b08d57]" />
            Where ten rupees goes
          </span>
          <h2 className="mt-5 text-center text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
            One coin.
            <br />
            <span className="font-serif italic text-black/60">Three duties.</span>
          </h2>

          <div className="mt-12 grid w-full max-w-[1100px] grid-cols-1 gap-10 md:mt-16 md:grid-cols-3 md:gap-12">
            {DUTIES.map((d, i) => (
              <div key={d.title} className="flex flex-col">
                <span className="text-sm text-black/40">0{i + 1}</span>
                <h3 className="mt-2 text-xl font-medium tracking-[-0.01em]">{d.title}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.65] text-black/55">{d.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-[560px] text-center text-sm leading-relaxed text-black/45">
            Lamps, priest, stream, cleanup — one pool, split by need, accounted
            in public after the festival.
          </p>
        </Container>
      </section>

      {/* The offering — node 581:6367 layout */}
      <LampOffer />

      {/* Ten rupees, five returns — ServiceProcess step-list layout */}
      <LampReturns />

      {/* The procession — conveyor choreography, node 1907:17535 */}
      <DiyaProcession />

      {/* Join */}
      <section className="bg-white px-5 py-14 md:px-10 md:py-20">
        <Container padded={false} className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div className="max-w-[440px]">
            <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-4xl">
              Hold a place
              <br />
              <span className="text-black/40">by the river.</span>
            </h2>
          </div>
          <JoinBlock />
        </Container>
      </section>

      {/* Book band */}
      <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
        <Image
          src="/event/lamps-haridwar.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="photo-grade object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-black/55" />
        <Container padded={false} className="relative flex flex-col items-start gap-6">
          <p className="max-w-[560px] text-2xl font-medium leading-[1.25] tracking-[-0.02em] text-white md:text-3xl">
            The river this night celebrates — all 2,525 kilometres of her — lives in
            the printed book.
          </p>
          <a
            href="/buy"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
          >
            Get the Book — ₹999
          </a>
        </Container>
      </section>
    </PageShell>
  );
}
