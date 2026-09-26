"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Download, Plus, X } from "lucide-react";
import { hoverFeedback } from "@/lib/feedback";
import { PaymentQr } from "@/components/shared/PaymentQr";
import {
  LAMP_PRICE,
  MAX_NAMES,
  PAYMENT_QR_IMAGE,
  SCREENSHOT_ACCEPT,
  UPI_ID,
  UPI_PAYEE,
  lampRef,
  normalizeWhatsapp,
  paymentProofError,
} from "@/lib/payment";
import { Flame } from "./Flame";

/**
 * The QR-poster checkout, built for a phone in one hand at the ghat:
 *   1. names, gotra, WhatsApp — nothing else
 *   2. "Continue" saves the offering (awaiting_payment) *first*, then shows
 *      the UPI ID to copy and the QR to scan
 *   3. "I've paid" (screenshot optional) → received
 * No upi://pay links: UPI apps block link-started payments to this account,
 * so paying is always the payer's own action — paste the ID or scan the QR.
 * The pending offering lives in localStorage, because Android often reloads
 * the tab while the UPI app is in front.
 */

const STORAGE_KEY = "gt-diya-pending";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// 16px text: anything smaller makes iOS Safari zoom into the field.
const FIELD =
  "min-h-13 w-full rounded-xl border border-black/15 bg-white px-4 text-base outline-none transition-colors placeholder:text-black/35 focus:border-black/60";

const SHARE_TEXT =
  "My diya burns on the ghats of Kashi this Dev Deepawali, with my name beside the flame. Put yours on the river for ₹10: https://gangatiram.in/diya";

type Pending = { ids: number[]; names: string[]; whatsapp: string; total: number };

const cleanName = (n: string) => n.trim().replace(/\s+/g, " ");

export function DiyaQuickForm() {
  const [stage, setStage] = useState<"form" | "pay" | "done">("form");
  const [pending, setPending] = useState<Pending | null>(null);
  const [names, setNames] = useState<string[]>([""]);
  const [gotra, setGotra] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"upi" | "note" | null>(null);

  // Resume a checkout the UPI app switch interrupted.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      // localStorage only exists after hydration, so this can't be initial state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPending(JSON.parse(raw) as Pending);
      setStage("pay");
    } catch {
      /* storage unavailable — start fresh */
    }
  }, []);

  const total = LAMP_PRICE * names.length;
  const setName = (i: number, v: string) => {
    setError("");
    setNames((ns) => ns.map((n, j) => (j === i ? v : n)));
  };
  const addName = () => setNames((ns) => (ns.length < MAX_NAMES ? [...ns, ""] : ns));
  const removeName = (i: number) => setNames((ns) => ns.filter((_, j) => j !== i));

  const start = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = names.map(cleanName);
    if (trimmed.some((n) => n.length < 2)) {
      setError("Write a name for every diya, or remove the empty row.");
      return;
    }
    const wa = normalizeWhatsapp(whatsapp);
    if (!wa) {
      setError("Enter your 10-digit WhatsApp number. The video is sent there.");
      return;
    }
    const data = new FormData();
    data.set("names", JSON.stringify(trimmed));
    data.set("gotra", gotra.trim());
    data.set("whatsapp", wa);
    data.set("pay_later", "1");
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/lamp", { method: "POST", body: data });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || "Something went wrong. Please try again.");
      const next: Pending = {
        ids: out.ids,
        names: out.names ?? trimmed,
        whatsapp: wa,
        total: LAMP_PRICE * trimmed.length,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* the pay screen still works for this tab */
      }
      setPending(next);
      setStage("pay");
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmPaid = async () => {
    if (!pending) return;
    const data = new FormData();
    data.set("ids", JSON.stringify(pending.ids));
    data.set("whatsapp", pending.whatsapp);
    if (proof) {
      const proofError = paymentProofError(proof);
      if (proofError) {
        setError(proofError);
        return;
      }
      data.set("screenshot", proof);
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/lamp/confirm", { method: "POST", body: data });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || "Something went wrong. Please try again.");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* nothing to clear */
      }
      setStage("done");
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /** Back to the form with the same details — for a wrong name or number. */
  const startOver = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clear */
    }
    if (pending) {
      setNames(pending.names);
      setWhatsapp(pending.whatsapp.replace(/^\+91/, ""));
    }
    setPending(null);
    setProof(null);
    setError("");
    setStage("form");
  };

  const copy = async (what: "upi" | "note", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied((c) => (c === what ? null : c)), 2500);
    } catch {
      setError(`Could not copy. Type it in: ${text}`);
    }
  };

  if (stage === "done" && pending) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-black text-white">
          <Check size={28} />
        </span>
        <h2 className="mt-5 text-2xl font-medium tracking-[-0.02em]">
          The river has your {pending.names.length === 1 ? "name" : "names"}.
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-black/60">
          We match your payment, and on the night a priest lights{" "}
          {pending.names.length === 1 ? "your diya" : "each diya"} on the ghat. The video
          reaches <span className="font-medium text-black">{pending.whatsapp}</span> on
          WhatsApp within three days.
        </p>

        <div className="mt-6 flex w-full flex-col gap-2">
          {pending.ids.map((id, i) => (
            <a
              key={id}
              href={`/diya-card/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center gap-2.5 rounded-xl border border-[#b08d57]/35 bg-white px-4 text-left text-[15px] font-medium"
            >
              <Flame size={12} delay={i * 300} />
              <span className="grow">
                Diya no. {id} · {pending.names[i] ?? ""}
              </span>
              <ArrowUpRight size={16} className="text-black/40" />
            </a>
          ))}
        </div>
        <p className="mt-2 text-xs text-black/45">Open a diya to see and save its card.</p>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex min-h-13 w-full items-center justify-center rounded-full bg-[#25d366] px-6 text-base font-medium text-black"
        >
          Share on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            setPending(null);
            setNames([""]);
            setStage("form");
          }}
          className="mt-3 min-h-12 text-sm font-medium underline underline-offset-4"
        >
          Light another diya
        </button>
      </div>
    );
  }

  if (stage === "pay" && pending) {
    const ref = lampRef(pending.ids[0]);
    return (
      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-[0.14em] text-black/45">
          Reference {ref} · {pending.names.length} {pending.names.length === 1 ? "diya" : "diyas"}
        </p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em]">
          Pay {inr(pending.total)} to light {pending.names.length === 1 ? "your diya" : "your diyas"}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-black/55">{pending.names.join(" · ")}</p>

        <div className="mt-5 flex flex-col gap-3">
          {/* 1 — UPI ID: first on a phone, where the QR can't be scanned from its own screen */}
          <div className="rounded-2xl bg-[#f7f5f0] p-4">
            <p className="text-base font-medium">Pay to UPI ID</p>
            <p className="mt-2 break-all font-serif text-[26px] leading-tight tracking-tight">{UPI_ID}</p>
            <p className="mt-1 text-xs text-black/50">{UPI_PAYEE}</p>
            <button
              type="button"
              onClick={() => copy("upi", UPI_ID)}
              onMouseEnter={() => hoverFeedback("cta")}
              className="mt-3 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-base font-medium text-white"
            >
              {copied === "upi" ? <Check size={18} /> : <Copy size={18} />}
              {copied === "upi" ? "Copied. Now open your UPI app" : "Copy UPI ID"}
            </button>
            <ol className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-black/65">
              <li>
                <span className="font-medium text-black">1.</span> Open GPay, PhonePe, Paytm or any UPI app
              </li>
              <li>
                <span className="font-medium text-black">2.</span> Tap <span className="font-medium text-black">Pay to UPI ID</span> and paste
              </li>
              <li>
                <span className="font-medium text-black">3.</span> Enter <span className="font-medium text-black">{inr(pending.total)}</span>. In the note, write{" "}
                <button
                  type="button"
                  onClick={() => copy("note", ref)}
                  className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 font-medium text-black"
                >
                  {ref}
                  {copied === "note" ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </li>
            </ol>
          </div>

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-black/40 md:hidden">
            <span className="h-px grow bg-black/10" />
            or
            <span className="h-px grow bg-black/10" />
          </div>

          {/* 2 — QR: first on a laptop, where the phone scans the screen */}
          <div className="rounded-2xl bg-[#f7f5f0] p-4 md:order-first">
            <p className="text-base font-medium">Scan the QR</p>
            <div className="mx-auto mt-3 w-full max-w-[240px] overflow-hidden rounded-xl border border-black/10 bg-white">
              <PaymentQr />
            </div>
            <p className="mt-3 text-center text-sm leading-relaxed text-black/60">
              <span className="md:hidden">
                Paying from this phone? Save the QR, then in your UPI app tap{" "}
                <span className="font-medium text-black">Scan → Gallery</span>.
              </span>
              <span className="hidden md:inline">Scan with any UPI app on your phone.</span>{" "}
              Enter <span className="font-medium text-black">{inr(pending.total)}</span>.
            </p>
            <a
              href={PAYMENT_QR_IMAGE}
              download="ganga-tiram-upi-qr.jpeg"
              className="mx-auto mt-3 flex min-h-12 w-fit items-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-medium text-black md:hidden"
            >
              <Download size={15} />
              Save QR to gallery
            </a>
          </div>
        </div>

        {/* Screenshot — optional, speeds up matching */}
        <label className="mt-4 block">
          <span className="text-sm font-medium">Payment screenshot</span>
          <span className="ml-1.5 text-sm text-black/45">(optional)</span>
          <span className="relative mt-2 flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/25 bg-white px-4 text-center text-sm">
            <input
              type="file"
              accept={SCREENSHOT_ACCEPT}
              onChange={(e) => setProof(e.target.files?.[0] ?? null)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {proof ? (
              <span className="inline-flex items-center gap-2 font-medium">
                <Check size={15} /> {proof.name}
              </span>
            ) : (
              <span className="text-black/55">Add it if you have it. It helps us match your payment faster.</span>
            )}
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={startOver}
          className="mt-5 min-h-11 self-center text-sm text-black/50 underline underline-offset-4"
        >
          Wrong name or number? Start over
        </button>

        {/* Done bar — pinned to the thumb, like the form's pay bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
          <button
            type="button"
            onClick={confirmPaid}
            disabled={submitting}
            className="mx-auto flex min-h-14 w-full max-w-[520px] items-center justify-center gap-2 rounded-full bg-black px-6 text-base font-medium text-white disabled:opacity-60"
          >
            <Check size={18} />
            {submitting ? "Saving…" : `I've paid ${inr(pending.total)}`}
          </button>
          <p className="mx-auto mt-1.5 max-w-[520px] text-center text-[11px] text-black/45">
            Tap after the payment goes through in your UPI app
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={start} noValidate className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-base font-medium">
          {names.length === 1 ? "Name on the diya" : "Names on the diyas"}
        </legend>
        <p className="-mt-1 text-sm text-black/50">One diya per name: yours, a parent&rsquo;s, someone you remember.</p>
        {names.map((n, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={n}
              onChange={(e) => setName(i, e.target.value)}
              maxLength={80}
              autoComplete={i === 0 ? "name" : "off"}
              autoCapitalize="words"
              enterKeyHint="next"
              aria-label={`Name ${i + 1}`}
              placeholder={i === 0 ? "Full name" : `Name ${i + 1}`}
              className={FIELD}
            />
            {names.length > 1 && (
              <button
                type="button"
                onClick={() => removeName(i)}
                aria-label={`Remove name ${i + 1}`}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-black/5 text-black/60"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        {names.length < MAX_NAMES && (
          <button
            type="button"
            onClick={addName}
            className="inline-flex min-h-12 w-fit items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 text-sm font-medium"
          >
            <Plus size={15} />
            Add another name · {inr(LAMP_PRICE)}
          </button>
        )}
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-base font-medium">
          Gotra <span className="font-normal text-black/45">(optional)</span>
        </span>
        <input
          value={gotra}
          onChange={(e) => {
            setError("");
            setGotra(e.target.value);
          }}
          maxLength={80}
          autoCapitalize="words"
          enterKeyHint="next"
          placeholder="e.g. Bharadwaj"
          className={FIELD}
        />
        <span className="text-sm leading-relaxed text-black/50">
          Don&rsquo;t know it? Leave it blank. The priest will use Kashyap gotra, as is the custom.
        </span>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-base font-medium">WhatsApp number</span>
        <span className="flex items-stretch overflow-hidden rounded-xl border border-black/15 bg-white focus-within:border-black/60">
          <span className="grid place-items-center border-r border-black/10 bg-[#f7f5f0] px-3.5 text-base text-black/60">
            +91
          </span>
          <input
            value={whatsapp}
            onChange={(e) => {
              setError("");
              setWhatsapp(e.target.value);
            }}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            enterKeyHint="done"
            maxLength={16}
            placeholder="98765 43210"
            className="min-h-13 w-full bg-transparent px-4 text-base outline-none placeholder:text-black/35"
          />
        </span>
        <span className="text-sm leading-relaxed text-black/50">
          The video of your diya on the ghat comes here, within three days of the night.
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </p>
      )}

      {/* Pay bar — pinned to the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
        <div className="mx-auto flex max-w-[520px] items-center gap-4">
          <div className="shrink-0">
            <p className="text-xs text-black/50">
              {names.length} {names.length === 1 ? "diya" : "diyas"}
            </p>
            <p className="font-serif text-2xl leading-none tracking-tight">{inr(total)}</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            onMouseEnter={() => hoverFeedback("cta")}
            className="flex min-h-14 grow items-center justify-center gap-2 rounded-full bg-black px-6 text-base font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Saving your names…" : `Continue to pay ${inr(total)}`}
            {!submitting && <ArrowUpRight size={18} />}
          </button>
        </div>
        <p className="mx-auto mt-1.5 max-w-[520px] text-center text-[11px] text-black/45">
          Next: pay by UPI ID or QR from any UPI app
        </p>
      </div>
    </form>
  );
}
