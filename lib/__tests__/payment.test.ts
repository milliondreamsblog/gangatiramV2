import { describe, expect, it } from "vitest";
import { MAX_SCREENSHOT_BYTES, normalizeWhatsapp, paymentProofError } from "@/lib/payment";
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
