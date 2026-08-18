import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { EventCountdown, JoinBlock } from "@/components/sections/DevDeepawaliJoin";

export const metadata: Metadata = {
  title: "Dev Deepawali — 24 November 2026",
  description:
    "On Kartik Purnima, Varanasi lights all 84 ghats with lakhs of lamps. Join the Ganga Tiram community's first online gathering — watch the night live and light a lamp from wherever you are.",
  alternates: { canonical: "/dev-deepawali" },
};

const MOMENTS = [
  {
    title: "Watch her burn bright",
    body: "The ghats, the aartis, the lamps — live, as the night unfolds over the river.",
  },
  {
    title: "Light a lamp from where you are",
    body: "One diya at your window. Send a photo — we thread the community's lamps into one stream.",
  },
  {
    title: "Meet the people keeping her alive",
    body: "Painters, weavers, and cleanup crews from the FACE mission join the gathering.",
  },
];

export default function DevDeepawaliPage() {
  return (
    <PageShell nav="overlay" layout="clip">
      <PageHero
        variant="photo"
        image="/event/lamps-varanasi.png"
        eyebrow="First online gathering · 24 November 2026"
        headline="The night the gods come down to the ghats."
      />

      {/* Countdown */}
      <section className="bg-white px-5 py-14 md:px-10 md:py-20">
        <Container padded={false} className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="flex max-w-[520px] flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.14em] text-black/50">
              Kartik Purnima — the full moon of Kartik
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-4xl">
              One night. Eighty-four ghats.
              <br />
              <span className="text-black/40">Lakhs of lamps.</span>
            </h2>
          </div>
          <EventCountdown />
        </Container>
      </section>

      {/* What it is */}
      <section className="bg-[#f7f7f7] px-5 py-14 md:px-10 md:py-20">
        <Container padded={false} className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[560px]">
            <p className="text-lg leading-[1.6] tracking-[-0.01em] text-black/70">
              Fifteen days after Diwali, on the full moon of Kartik, Varanasi turns its
              riverfront into a sky. All 84 ghats are lit with lakhs of earthen lamps —
              for one night, the city holds a Diwali for the gods themselves.
            </p>
            <p className="mt-5 text-lg leading-[1.6] tracking-[-0.01em] text-black">
              Most people will never stand on those steps. This year, our community
              gathers online — so the river&rsquo;s greatest night belongs to everyone
              on her side.
            </p>
          </div>
          <div className="flex w-full max-w-[440px] flex-col gap-7">
            {MOMENTS.map((m, i) => (
              <div key={m.title} className="flex gap-4 border-t border-black/10 pt-5">
                <span className="text-sm text-black/40">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-medium tracking-[-0.01em]">{m.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-black/55">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

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
          className="object-cover"
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
