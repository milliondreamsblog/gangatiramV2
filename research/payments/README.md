# Payment QR update - 18 September 2026

## Recipient and assets

- UPI ID: `9830181700@axl`
- Payee: `B M ADVISORY SERVICES PVT LTD`
- Original supplied poster: `public/book/payment-qr-source.jpeg` (copied byte-for-byte from the supplied Downloads file).
- Both `/buy` and `/dev-deepawali` use `lib/payment.ts` and `components/shared/PaymentQr.tsx`.
- The QR viewport is styled in CSS; the original image is unchanged.
- QR payload: `upi://pay?pa=9830181700@axl&pn=B%20M%20ADVISORY%20SERVICES%20PVT%20LTD&mc=0000&mode=02&purpose=00`.
- Book: INR 999, shipping free. Diya: INR 10 per name, maximum 21 names.
- The printed QR has no amount. Customers scanning it must enter the displayed total.
- Mobile links preserve the merchant parameters and add the amount, INR currency and purchase note.
- No bank name is inferred from the UPI handle.

## Required operating setup

1. Deploy these changes to production.
2. Ensure production has `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. These are present locally; production configuration is not verified by that check.
3. For email alerts, configure `RESEND_API_KEY` and `ORDER_NOTIFY_EMAIL`. Both are missing locally. The current sender uses Resend's onboarding address; verify it can deliver to the intended recipient, or configure a verified sender before expanding recipients.
4. Optional book WhatsApp alerts need `CALLMEBOT_PHONE` and `CALLMEBOT_APIKEY`, also missing locally. Diya notifications currently use email only.
5. Scan the QR on a real phone and open each mobile payment link. Confirm the receiving account, displayed payee and amount before authorizing a transaction.
6. Submit genuine payment proof with a book order and a multi-name diya offering; confirm every record and its screenshot are visible in `/admin`.
7. Match the transaction reference, received amount and recipient against the merchant's actual transaction history. An uploaded screenshot is not payment confirmation.
8. Mark book orders verified only after reconciliation, then shipped. Diya states are received, lit and clip_sent; verify receipt before fulfillment.

## Reliability changes

- Both browser and API reject proof files of 4 MiB or larger and unsupported types.
- Vercel caps function request bodies at 4.5 MB: https://vercel.com/docs/functions/limitations . The smaller file cap leaves room for multipart fields.
- Multiple diya names save with one atomic database statement; invalid names fail the whole request.
- Notifications describe book proof as pending verification, include the expected payee, and use bounded network timeouts.
- No database schema migration is required for this change.

## Limits and next phase

This remains manual UPI collection. QR scanning, opening an app, or uploading proof does not confirm payment.
A payment gateway integration with server-created orders, verified payment webhooks, idempotency and transaction reconciliation would be a separate implementation for automatic confirmation.
The current manual submission endpoints do not deduplicate resubmissions; check repeat proofs before fulfillment.
Customer proof stays in the existing private database and authenticated admin flow, not in this repository.
Verification screenshots generated for this update belong in this directory, not Downloads.

## Verification completed

- 19 targeted tests passed (payment link recipient/amount, proof validation, order persistence, atomic diya submission and database failure handling).
- Production build passed.
- TypeScript and ESLint checks passed for the payment changes.
- Read-only database inspection confirmed required columns for both order tables.
- PostgreSQL EXPLAIN accepted the atomic diya INSERT; no records were inserted.
- Headless Chrome checked both pages at 1440px desktop and 390px mobile: recipient, dynamic amounts, mobile link visibility, overflow, and QR zoom.
- The source poster and both browser-rendered QR images decoded to the exact same payload.
- Screenshots and machine-readable results are saved beside this document.
- No money was transferred, production deployment performed, or notification sent.

Real-device payment app behavior, settlement, notification delivery, and the production environment still require the operating checks above.
