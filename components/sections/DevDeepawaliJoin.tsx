"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { whatsappHref } from "@/content/site";
import { hoverFeedback } from "@/lib/feedback";

/** Dusk on Kartik Purnima — 24 November 2026, Varanasi. */
const EVENT_AT = new Date("2026-11-24T17:30:00+05:30").getTime();

function remaining() {
  const d = Math.max(0, EVENT_AT - Date.now());
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor((d / 3_600_000) % 24),
    minutes: Math.floor((d / 60_000) % 60),
    seconds: Math.floor((d / 1_000) % 60),
  };
}

export function EventCountdown() {
  const [t, setT] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    setT(remaining());
    const id = setInterval(() => setT(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { v: t?.days, label: "days" },
    { v: t?.hours, label: "hours" },
    { v: t?.minutes, label: "minutes" },
    { v: t?.seconds, label: "seconds" },
  ];

  return (
    <div className="flex items-end gap-6 md:gap-10">
      {cells.map((c) => (
        <div key={c.label} className="flex flex-col items-start">
          <span className="font-serif text-4xl leading-none tracking-tight md:text-6xl">
            {c.v === undefined ? "—" : String(c.v).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[11px] uppercase tracking-[0.14em] text-black/50">
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function JoinBlock() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-4">
      {joined ? (
        <div className="flex min-h-12 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white">
          <Check size={16} />
          Your place is held. One reminder before the night, one link on the night.
        </div>
      ) : (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setJoined(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            className="min-h-12 grow rounded-full border border-black/15 bg-white px-5 text-[15px] outline-none transition-colors focus:border-black/40"
          />
          <button
            type="submit"
            onMouseEnter={() => hoverFeedback("cta")}
            className="min-h-12 shrink-0 rounded-full bg-black px-6 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            Join the gathering
          </button>
        </form>
      )}

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-black/40">
        <span className="h-px grow bg-black/10" />
        or
        <span className="h-px grow bg-black/10" />
      </div>

      <a
        href={whatsappHref}
        onMouseEnter={() => hoverFeedback("cta")}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 text-sm font-medium text-black transition-colors hover:border-black/40"
      >
        Join the WhatsApp circle
        <ArrowUpRight size={16} />
      </a>

      <p className="text-xs leading-relaxed text-black/45">
        No spam. One reminder before the night, one link on the night.
      </p>
    </div>
  );
}
