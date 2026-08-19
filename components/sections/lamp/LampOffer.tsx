"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Maximize2, Plus, X } from "lucide-react";
import { hoverFeedback } from "@/lib/feedback";
import { Flame } from "./Flame";
import { DiyaCard } from "./DiyaCard";

/**
 * The offering — left rail of steps, right panel staging the product on a
 * warm gradient. (Layout: Bricx Website v7, node 581:6367 "Services we
 * offer" — item rail + screenshot on an orange gradient panel. Here the
 * "screenshot" is the visitor's own Diya Card, updating as they type.)
 * Checkout mechanics mirror the proven book BuyFlow.
 */

const LAMP_PRICE = 10;
const MAX_NAMES = 21;
const UPI_ID = "9830181700@sbi";
const UPI_PAYEE = "Rakesh Mahapatra";
const UPI_BANK = "State Bank of India";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const FIELD =
  "min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[15px] outline-none transition-colors focus:border-black/50";

export function LampOffer() {
  const [names, setNames] = useState<string[]>([""]);
  const [dedication, setDedication] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrZoom, setQrZoom] = useState(false);
  const [done, setDone] = useState<{ ids: number[]; names: string[] } | null>(null);

  const total = LAMP_PRICE * names.length;
  const upiDeepLink =
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE)}` +
    `&am=${total}&cu=INR&tn=${encodeURIComponent("Ganga Tiram diya")}`;

  const setName = (i: number, v: string) =>
    setNames((ns) => ns.map((n, j) => (j === i ? v : n)));
  const addName = () => setNames((ns) => (ns.length < MAX_NAMES ? [...ns, ""] : ns));
  const removeName = (i: number) => setNames((ns) => ns.filter((_, j) => j !== i));

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const trimmed = names.map((n) => n.trim().replace(/\s+/g, " "));
    if (trimmed.some((n) => n.length < 2)) {
      setError("Every diya needs a name — fill or remove the empty rows.");
      return;
    }
    const data = new FormData(form);
    const shot = data.get("screenshot");
    if (!(shot instanceof File) || shot.size === 0) {
      setError("Please attach your payment screenshot.");
      return;
    }
    data.set("names", JSON.stringify(trimmed));
    data.set("dedication", dedication);
    data.set("email", email);
    data.set("whatsapp", whatsapp);
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/lamp", { method: "POST", body: data });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || "Something went wrong. Please try again.");
      setDone({ ids: out.ids ?? [], names: out.names ?? trimmed });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="offer" className="scroll-mt-20 bg-white px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-10 flex flex-col items-start gap-4 md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#b08d57]/40 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-[#8a6c3f]">
            <span aria-hidden className="size-1.5 rounded-full bg-[#b08d57]" />
            The offering — ₹10 a name
          </span>
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
            Put a name on the river.
            <br />
            <span className="font-serif italic text-black/60">It takes a minute.</span>
          </h2>
        </div>

        {done ? (
          <SuccessPanel done={done} />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
            {/* Left rail — the steps */}
            <form onSubmit={onSubmit} className="flex flex-col">
              {/* Step 1 — names */}
              <div className="border-t border-black/10 py-6">
                <div className="flex gap-4">
                  <span className="text-sm text-black/40">01</span>
                  <div className="grow">
                    <h3 className="text-lg font-medium tracking-[-0.01em]">The names</h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/55">
                      One diya per name — yours, your mother&rsquo;s, someone you carry.
                    </p>
                    <div className="mt-4 flex flex-col gap-2.5">
                      {names.map((n, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            value={n}
                            onChange={(e) => setName(i, e.target.value)}
                            maxLength={80}
                            placeholder={i === 0 ? "Name on the diya" : `Name ${i + 1}`}
                            className={FIELD}
                          />
                          {names.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeName(i)}
                              aria-label={`Remove name ${i + 1}`}
                              className="grid size-10 shrink-0 place-items-center rounded-full bg-black/5 text-black/60 transition-colors hover:bg-black hover:text-white"
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {names.length < MAX_NAMES && (
                      <button
                        type="button"
                        onClick={addName}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black/40"
                      >
                        <Plus size={14} />
                        Add another name — {inr(LAMP_PRICE)}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2 — where the clip goes */}
              <div className="border-t border-black/10 py-6">
                <div className="flex gap-4">
                  <span className="text-sm text-black/40">02</span>
                  <div className="grow">
                    <h3 className="text-lg font-medium tracking-[-0.01em]">Where your clip goes</h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/55">
                      Within three days of the night, the video of your diya burning reaches you here.
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={200}
                        placeholder="Email"
                        className={FIELD}
                      />
                      <input
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        maxLength={30}
                        inputMode="tel"
                        placeholder="WhatsApp (optional)"
                        className={FIELD}
                      />
                    </div>
                    <input
                      value={dedication}
                      onChange={(e) => setDedication(e.target.value)}
                      maxLength={300}
                      placeholder="A line spoken for them (optional)"
                      className={`${FIELD} mt-2.5`}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 — pay */}
              <div className="border-t border-black/10 py-6">
                <div className="flex gap-4">
                  <span className="text-sm text-black/40">03</span>
                  <div className="grow">
                    <h3 className="text-lg font-medium tracking-[-0.01em]">
                      Pay {inr(total)} by UPI
                    </h3>
                    <div className="mt-4 flex flex-col items-start gap-4 rounded-xl bg-[#f7f7f7] p-4 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setQrZoom(true)}
                        aria-label="Enlarge the payment QR code"
                        className="group relative w-[130px] shrink-0 overflow-hidden rounded-lg border border-black/10 bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/book/payment-qr.png" alt={`UPI QR code to pay ${UPI_PAYEE}`} className="w-full" />
                        <span className="absolute bottom-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-black/70 text-white opacity-80 transition-opacity group-hover:opacity-100">
                          <Maximize2 size={11} />
                        </span>
                      </button>
                      <div className="flex flex-col gap-2.5 text-sm">
                        <p className="leading-relaxed text-black/60">
                          Scan and pay <span className="font-medium text-black">{inr(total)}</span> to{" "}
                          <span className="font-medium text-black">{UPI_PAYEE}</span> · {UPI_BANK}.
                          Screenshot the confirmation for step 4.
                        </p>
                        <button
                          type="button"
                          onClick={copyUpi}
                          aria-label={`Copy UPI ID ${UPI_ID}`}
                          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 font-medium tracking-[-0.01em] transition-colors hover:bg-black hover:text-white"
                        >
                          {UPI_ID}
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <a
                          href={upiDeepLink}
                          className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline md:hidden"
                        >
                          Open in a UPI app — {inr(total)} pre-filled
                          <ArrowUpRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 — proof */}
              <div className="border-t border-black/10 py-6">
                <div className="flex gap-4">
                  <span className="text-sm text-black/40">04</span>
                  <div className="grow">
                    <h3 className="text-lg font-medium tracking-[-0.01em]">The proof</h3>
                    <label className="mt-4 block">
                      <span className="relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-black/25 bg-[#fafafa] px-4 text-center transition-colors hover:border-black/50">
                        <input
                          type="file"
                          name="screenshot"
                          required
                          accept="image/png,image/jpeg,image/webp,image/heic,image/heif,application/pdf"
                          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                        {fileName ? (
                          <span className="inline-flex items-center gap-2 text-sm font-medium">
                            <Check size={15} /> {fileName}
                          </span>
                        ) : (
                          <>
                            <span className="text-sm font-medium">Upload the UPI confirmation</span>
                            <span className="text-xs text-black/45">Image or PDF · under 4 MB</span>
                          </>
                        )}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-2 rounded-xl bg-black/5 px-4 py-3 text-sm font-medium text-black">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                onMouseEnter={() => hoverFeedback("cta")}
                className="mt-5 min-h-13 rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {submitting
                  ? "Carrying your name to the river…"
                  : `Send ${names.length === 1 ? "my diya" : `${names.length} diyas`} to the ghat — ${inr(total)} paid`}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-black/45">
                We verify every payment by hand. Your clip lands within three days of the
                night — the cleanup account follows after the festival.
              </p>
            </form>

            {/* Right — the Diya Card, staged live on the warm gradient */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex flex-col items-center rounded-2xl bg-[linear-gradient(150deg,#ffe8cf_0%,#ffb066_48%,#f97316_100%)] px-6 py-10 md:py-14">
                <DiyaCard name={names[0]?.trim() || null} dedication={dedication.trim() || null} />
                <p className="mt-6 max-w-[300px] text-center text-sm leading-relaxed text-black/60">
                  Your Diya Card — it arrives with your clip, made to be shared.
                  {names.length > 1 && ` One card per name — ${names.length} in this offering.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR zoom overlay */}
      {qrZoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Payment QR code"
          onClick={() => setQrZoom(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm"
        >
          <div className="relative max-w-[420px] overflow-hidden rounded-2xl bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/book/payment-qr.png" alt={`UPI QR code to pay ${UPI_PAYEE}`} className="w-full" />
            <button
              type="button"
              onClick={() => setQrZoom(false)}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const SHARE_TEXT =
  "My diya burns on the ghats of Kashi this Dev Deepawali — with my name beside the flame. Put yours on the river: gangatiram.in/dev-deepawali";

function SuccessPanel({ done }: { done: { ids: number[]; names: string[] } }) {
  const [copied, setCopied] = useState(false);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl bg-[#f7f7f7] p-8 text-center md:p-12">
      <span className="grid size-16 place-items-center rounded-full bg-black text-white">
        <Check size={28} />
      </span>
      <h3 className="mt-6 text-3xl font-medium tracking-[-0.02em]">
        The river has your {done.names.length === 1 ? "name" : "names"}.
      </h3>
      <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-black/55">
        We verify the payment by hand. On the night, a priest lights{" "}
        {done.names.length === 1 ? "your diya" : "each diya"} on the ghat — your clip
        arrives within three days, your card with it.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        {done.ids.map((id, i) => (
          <a
            key={id}
            href={`/diya-card/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#b08d57]/35 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:border-black/50"
          >
            <Flame size={12} delay={i * 300} />
            Diya no. {id} — {done.names[i] ?? ""}
            <ArrowUpRight size={14} className="text-black/40" />
          </a>
        ))}
      </div>
      <p className="mt-2 text-xs text-black/45">Open a diya to see and save its card.</p>

      <button
        onClick={copyShare}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied — pass it on" : "Copy a line to pass it on"}
      </button>
    </div>
  );
}
