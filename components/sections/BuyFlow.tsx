"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Maximize2, X } from "lucide-react";
import { hoverFeedback } from "@/lib/feedback";
import { PaymentQr } from "@/components/shared/PaymentQr";
import { BOOK_PRICE, SHIPPING_PRICE, ORDER_TOTAL, UPI_ID, UPI_PAYEE, upiPaymentLink, paymentProofError, SCREENSHOT_ACCEPT } from "@/lib/payment";

const UPI_DEEP_LINK = upiPaymentLink(ORDER_TOTAL, "Ganga Tiram book");

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const FIELD =
  "min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[15px] outline-none transition-colors focus:border-black/50";

export function BuyFlow() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrZoom, setQrZoom] = useState(false);
  const [fileName, setFileName] = useState("");

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(`Could not copy the UPI ID. Please copy ${UPI_ID} manually.`);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const shot = data.get("screenshot");
    if (!(shot instanceof File) || shot.size === 0) {
      setError("Please attach your payment screenshot.");
      return;
    }
    const proofError = paymentProofError(shot);
    if (proofError) {
      setError(proofError);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/order", { method: "POST", body: data });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || "Something went wrong. Please try again.");
      setOrderId(out.orderId ?? null);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl bg-white p-10 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-black text-white">
          <Check size={28} />
        </span>
        <h2 className="mt-6 text-3xl font-medium tracking-[-0.02em]">
          Order{orderId ? ` #${orderId}` : ""} received
        </h2>
        <p className="mt-3 max-w-[480px] text-[15px] leading-relaxed text-black/55">
          Your payment screenshot and delivery details are saved. We verify the payment and
          send your tracking details within 24 hours.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
        >
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      {/* Left: summary + pay */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-start gap-5">
            <div className="relative aspect-[1306/1340] w-24 shrink-0 overflow-hidden rounded-md shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)]">
              <Image src="/book/front.jpg" alt="Ganga Tiram — front cover" fill sizes="96px" className="object-cover" />
            </div>
            <div className="grow">
              <p className="text-xs uppercase tracking-[0.14em] text-black/45">Book order</p>
              <p className="mt-1 text-xl font-medium tracking-[-0.01em]">Ganga Tiram</p>
              <p className="text-sm text-black/50">220 pages · 75 photographs · 75 places</p>
            </div>
          </div>
          <dl className="mt-5 border-t border-black/10 text-[15px]">
            <div className="flex justify-between py-2.5">
              <dt className="text-black/55">Book</dt>
              <dd className="font-medium">{inr(BOOK_PRICE)}</dd>
            </div>
            <div className="flex justify-between border-t border-black/5 py-2.5">
              <dt className="text-black/55">Shipping (pan-India)</dt>
              <dd className="font-medium">{SHIPPING_PRICE === 0 ? "Free" : inr(SHIPPING_PRICE)}</dd>
            </div>
            <div className="flex justify-between border-t border-black/10 py-3">
              <dt className="font-medium">Total to pay</dt>
              <dd className="font-serif text-2xl leading-none tracking-tight">{inr(ORDER_TOTAL)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-black/45">Step 1 — Pay by UPI</p>
          <div className="mt-4 flex flex-col items-start gap-6 sm:flex-row">
            <button
              type="button"
              onClick={() => setQrZoom(true)}
              aria-label="Enlarge the payment QR code"
              className="group relative w-[180px] shrink-0 overflow-hidden rounded-xl border border-black/10"
            >
              <PaymentQr />
              <span className="flex items-center justify-center gap-2 border-t border-black/10 py-2 text-xs text-black/60">
                <Maximize2 size={13} />
                Enlarge QR
              </span>
            </button>
            <div className="flex flex-col gap-3">
              <p className="text-[15px] leading-relaxed text-black/60">
                Scan with any UPI app and pay <span className="font-medium text-black">{inr(ORDER_TOTAL)}</span>.
                Then screenshot the confirmation — you upload it in step 2.
              </p>
              <div className="rounded-xl bg-[#f7f7f7] p-4 text-sm">
                <p className="text-black/50">
                  Paying <span className="font-medium text-black">{UPI_PAYEE}</span>
                </p>
                <button
                  type="button"
                  onClick={copyUpi}
                  aria-label={`Copy UPI ID ${UPI_ID}`}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-medium tracking-[-0.01em] transition-colors hover:bg-black hover:text-white"
                >
                  {UPI_ID}
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <a
                href={UPI_DEEP_LINK}
                className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline md:hidden"
              >
                Open in a UPI app
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right: delivery + screenshot */}
      <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl bg-white p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-black/45">
          Step 2 — Delivery details + payment proof
        </p>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Full name
          <input name="name" required maxLength={200} placeholder="Who the book ships to" className={FIELD} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Phone number
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            maxLength={20}
            pattern="[0-9+\-\s()]{10,20}"
            title="A 10-digit mobile number (country code optional)"
            placeholder="We call or WhatsApp you about delivery"
            className={FIELD}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Address
          <textarea
            name="address"
            required
            rows={3}
            placeholder="House, street, area, city"
            className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-black/50"
          />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            State
            <input name="state" required maxLength={100} className={FIELD} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Country
            <input name="country" required maxLength={100} defaultValue="India" className={FIELD} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Pincode
            <input name="pincode" required maxLength={20} inputMode="numeric" className={FIELD} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Payment screenshot
          <span className="relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-black/25 bg-[#fafafa] px-4 text-center transition-colors hover:border-black/50">
            <input
              type="file"
              name="screenshot"
              required
              accept={SCREENSHOT_ACCEPT}
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

        {error && (
          <p className="rounded-xl bg-black/5 px-4 py-3 text-sm font-medium text-black">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          onMouseEnter={() => hoverFeedback("cta")}
          className="mt-2 min-h-13 rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Placing your order…" : `Place the order — ${inr(ORDER_TOTAL)} paid`}
        </button>
        <p className="text-xs leading-relaxed text-black/45">
          We verify every payment by hand and send your tracking number within 24 hours.
        </p>
      </form>

      {/* QR zoom overlay */}
      {qrZoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Payment QR code"
          onClick={() => setQrZoom(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white p-4 pt-14" onClick={(event) => event.stopPropagation()}>
            <PaymentQr />
            <p className="mt-3 text-center text-sm">Pay {inr(ORDER_TOTAL)} to {UPI_PAYEE}</p>
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
    </div>
  );
}
