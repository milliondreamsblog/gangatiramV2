import { describe, expect, it } from "vitest";
import { MAX_SCREENSHOT_BYTES, normalizeWhatsapp, paymentProofError, upiPaymentLink } from "@/lib/payment";
describe("UPI payment destination", () => {
  it.each([999, 10, 30, 210])("keeps the merchant and pre-fills INR %s", (amount) => {
    const link = new URL(upiPaymentLink(amount, "Ganga Tiram offering"));
    expect(link.protocol).toBe("upi:");
    expect(link.host).toBe("pay");
    expect(Object.fromEntries(link.searchParams)).toEqual({
      pa: "9830181700@axl", pn: "B M ADVISORY SERVICES PVT LTD",
      mc: "0000", mode: "02", purpose: "00",
      am: amount.toFixed(2), cu: "INR", tn: "Ganga Tiram offering",
    });
  });
  it("keeps the VPA and payee exactly as scanned — no %40, no + for spaces", () => {
    const link = upiPaymentLink(20, "Diya GT901");
    expect(link).toContain("pa=9830181700@axl");
    expect(link).toContain("pn=B%20M%20ADVISORY");
    expect(link).toContain("tn=Diya%20GT901");
    expect(link).not.toContain("+");
  });
});
describe("payment proof validation", () => {
  it.each(["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif", "application/pdf"])("accepts a small %s proof", (type) => {
    expect(paymentProofError({ size: 1024, type })).toBeNull();
  });
  it("rejects empty, oversized, and unsupported files before upload", () => {
    expect(paymentProofError({ size: 0, type: "image/png" })).toMatch(/required/);
    expect(paymentProofError({ size: MAX_SCREENSHOT_BYTES, type: "image/png" })).toMatch(/4 MB/);
    expect(paymentProofError({ size: 1024, type: "text/html" })).toMatch(/image or a PDF/);
    expect(paymentProofError({ size: MAX_SCREENSHOT_BYTES - 1, type: "image/png" })).toBeNull();
  });
});
describe("WhatsApp number normalisation", () => {
  it.each([
    ["9876543210", "+919876543210"],
    ["98765 43210", "+919876543210"],
    ["09876543210", "+919876543210"],
    ["+91 98765-43210", "+919876543210"],
    ["919876543210", "+919876543210"],
    ["+44 7700 900123", "+447700900123"],
  ])("normalises %j", (input, expected) => {
    expect(normalizeWhatsapp(input)).toBe(expected);
  });
  it.each(["", "12345", "1234567890", "abc"])("rejects %j", (input) => {
    expect(normalizeWhatsapp(input)).toBeNull();
  });
});
