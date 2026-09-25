import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { DiyaQuickForm } from "@/components/sections/lamp/DiyaQuickForm";

export const metadata: Metadata = {
  title: "Light a diya on the ghats of Kashi — ₹10",
  description:
    "Dev Deepawali, 24 November 2026. For ₹10 a priest lights a diya with your name on the ghats of Varanasi, and the video of it reaches you on WhatsApp.",
  alternates: { canonical: "/diya" },
};

export const viewport: Viewport = { themeColor: "#1a120b" };

/**
 * Where the printed QR lands. Deliberately bare: no nav, no footer, no story.
 * The long-form page is /dev-deepawali; this one is the form, above the fold
 * on a phone.
 */
export default function DiyaPage() {
  return (
    <main className="min-h-dvh bg-[#f4efe6] pb-44 text-[#121212]">
      <header className="relative h-[210px] overflow-hidden bg-[#1a120b] md:h-[280px]">
        <Image
          src="/event/lamps-varanasi.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="photo-grade object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />
        <div className="relative mx-auto flex h-full max-w-[520px] flex-col justify-between px-5 pb-8 pt-4">
          <Link href="/" className="w-fit font-serif text-lg text-white">
            Ganga Tiram
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/75">
              Dev Deepawali · 24 Nov 2026 · Kashi
            </p>
            <h1 className="mt-1.5 text-[26px] font-medium leading-[1.12] tracking-[-0.02em] text-white md:text-4xl">
              Light a diya with your name on the ghats of Kashi.
            </h1>
          </div>
        </div>
      </header>

      <div className="relative mx-auto -mt-4 max-w-[520px] px-3">
        <div className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.35)]">
          <ul className="mb-6 grid grid-cols-3 gap-2 border-b border-black/10 pb-5 text-center text-xs leading-snug text-black/60">
            <li>
              <span className="block font-serif text-xl text-black">₹10</span>a name
            </li>
            <li>
              <span className="block font-serif text-xl text-black">Priest</span>lights it on the ghat
            </li>
            <li>
              <span className="block font-serif text-xl text-black">Video</span>on your WhatsApp
            </li>
          </ul>
          <DiyaQuickForm />
        </div>

        <p className="mt-6 text-center text-sm text-black/50">
          The same ten rupees also funds the river clean-up after the festival.{" "}
          <Link href="/dev-deepawali" className="font-medium text-black underline underline-offset-4">
            Read more
          </Link>
        </p>
      </div>
    </main>
  );
}
