import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { BuyFlow } from "@/components/sections/BuyFlow";

export const metadata: Metadata = {
  title: "Get the Book — ₹999",
  description:
    "Order the Ganga Tiram book — 300 pages, 240 photographs, 75 places from Gomukh to Gangasagar. Pay by UPI, upload the confirmation, and your copy ships with tracking in 24 hours.",
  alternates: { canonical: "/buy" },
};

export default function BuyPage() {
  return (
    <PageShell nav="solid">
      <PageHero
        variant="light"
        eyebrow={
          <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-black/60">
            Book order · direct UPI
          </span>
        }
        headline={
          <>
            Two steps between you
            <br />
            and all 2,525 kilometres.
          </>
        }
        subheadline="Pay by UPI, upload the confirmation with your address — we verify by hand and ship with tracking in 24 hours."
      />
      <div className="bg-[#f7f7f7] px-5 py-12 md:px-10 md:py-16">
        <Container padded={false}>
          <BuyFlow />
        </Container>
      </div>
    </PageShell>
  );
}
