/**
 * Order notifications — email (Resend) and WhatsApp (CallMeBot).
 * Both are env-gated and fail soft: a missing key or a provider outage never
 * breaks an order — the caller records the returned booleans as flags so the
 * admin panel shows exactly which alerts went out.
 *
 * Env:
 *   RESEND_API_KEY      — resend.com API key (free tier)
 *   ORDER_NOTIFY_EMAIL  — where order alerts + backups land (your Gmail)
 *   CALLMEBOT_PHONE     — your WhatsApp number with country code, e.g. +91XXXXXXXXXX
 *   CALLMEBOT_APIKEY    — key CallMeBot sends you during its one-time activation
 */

type OrderInfo = {
  orderId: number;
  name: string;
  address: string;
  pincode: string;
  state: string;
  country: string;
};

export async function sendOrderEmail(
  order: OrderInfo,
  screenshot: { buffer: Buffer; mime: string; filename: string }
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!key || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Ganga Tiram Orders <onboarding@resend.dev>",
        to: [to],
        subject: `Book order #${order.orderId} — ${order.name}, ${order.state}`,
        text: [
          `New book order on gangatiram.in`,
          ``,
          `Order    #${order.orderId}`,
          `Name     ${order.name}`,
          `Address  ${order.address}`,
          `Pincode  ${order.pincode}`,
          `State    ${order.state}`,
          `Country  ${order.country}`,
          `Amount   ₹1,144 (₹999 book + ₹145 shipping) — paid by UPI`,
          ``,
          `Payment screenshot attached. Verify it, then ship and send tracking within 24h.`,
          `Admin: https://gangatiram.in/admin`,
        ].join("\n"),
        attachments: [
          {
            filename: screenshot.filename || `order-${order.orderId}-proof.jpg`,
            content: screenshot.buffer.toString("base64"),
          },
        ],
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("order email failed", error);
    return false;
  }
}

export async function sendOrderWhatsApp(order: OrderInfo): Promise<boolean> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return false;

  try {
    const text = `Ganga Tiram: new book order #${order.orderId} — ${order.name}, ${order.state} (${order.pincode}). ₹1,144 paid by UPI. Check Gmail for the payment proof.`;
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
      `&apikey=${encodeURIComponent(apikey)}&text=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    return res.ok;
  } catch (error) {
    console.error("order whatsapp failed", error);
    return false;
  }
}
