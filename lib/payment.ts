// Decoded from the supplied PhonePe QR; keep the merchant parameters together.
export const UPI_QR_PAYLOAD =
  "upi://pay?pa=9830181700@axl&pn=B%20M%20ADVISORY%20SERVICES%20PVT%20LTD&mc=0000&mode=02&purpose=00";
const recipient = new URL(UPI_QR_PAYLOAD).searchParams;
export const UPI_ID = recipient.get("pa")!;
export const UPI_PAYEE = recipient.get("pn")!;
export const PAYMENT_QR_IMAGE = "/book/payment-qr-source.jpeg";
export const BOOK_PRICE = 999;
export const SHIPPING_PRICE = 0;
export const ORDER_TOTAL = BOOK_PRICE + SHIPPING_PRICE;
export const LAMP_PRICE = 10;
export const MAX_NAMES = 21;

/**
 * Appends to the scanned payload verbatim rather than via URLSearchParams,
 * which would rewrite "@" as %40 and spaces as "+" — forms some UPI apps
 * don't decode, showing "B+M+ADVISORY" or failing to resolve the VPA.
 */
export function upiPaymentLink(amount: number, note: string): string {
  return `${UPI_QR_PAYLOAD}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
}

// Leave room for multipart fields below Vercel's 4.5 MB request limit.
export const MAX_SCREENSHOT_BYTES = 4 * 1024 * 1024;
export const SCREENSHOT_ACCEPT = "image/png,image/jpeg,image/webp,image/heic,image/heif,application/pdf";
export function paymentProofError(file: { size: number; type: string }): string | null {
  if (file.size === 0) return "Payment screenshot is required.";
  if (file.size >= MAX_SCREENSHOT_BYTES) return "Screenshot must be under 4 MB.";
  if (!/^(image\/(png|jpe?g|webp|heic|heif)|application\/pdf)$/i.test(file.type)) {
    return "Screenshot must be an image or a PDF.";
  }
  return null;
}
