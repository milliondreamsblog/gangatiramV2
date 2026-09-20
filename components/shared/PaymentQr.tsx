import { PAYMENT_QR_IMAGE, UPI_PAYEE } from "@/lib/payment";

export function PaymentQr() {
  return (
    <span className="relative block aspect-square w-full overflow-hidden bg-white">
      {/* Display the 600 x 600 region at (240, 542) of the unmodified poster.
          This keeps a white margin around the code without changing its pixels. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PAYMENT_QR_IMAGE}
        alt={`UPI QR code to pay ${UPI_PAYEE}`}
        width={1080}
        height={1340}
        className="absolute h-auto max-w-none"
        style={{ width: "180%", left: "-40%", top: `${(-542 / 600) * 100}%` }}
      />
    </span>
  );
}
