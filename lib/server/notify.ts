import { ORDER_TOTAL, LAMP_PRICE, UPI_ID, UPI_PAYEE } from "@/lib/payment";
import { contactEmail, instagramHref, whatsappHref, linkedinHref } from "@/content/site";

/**
 * Order notifications — email (Resend) and WhatsApp (CallMeBot).
 * Both are env-gated and fail soft: a missing key or a provider outage never
 * breaks an order — the caller records the returned booleans as flags so the
 * admin panel shows exactly which alerts went out.
 *
 * Env:
 *   RESEND_API_KEY      — resend.com API key (free tier)
 *   ORDER_NOTIFY_EMAIL  — where order alerts + backups land (your Gmail)
 *   ORDER_FROM_EMAIL    — verified sender, e.g. "Ganga Tiram <orders@gangatiram.in>".
 *                         Falls back to Resend's shared sandbox domain, which has no
 *                         SPF/DKIM alignment with gangatiram.in and lands in spam —
 *                         verify the domain in Resend and set this before relying on
 *                         customer mail. Resend also refuses to send to third parties
 *                         from the sandbox domain, so thank-yous need this set.
 *   ORDER_REPLY_TO      — optional; where customer replies go. Defaults to ORDER_NOTIFY_EMAIL.
 *   CALLMEBOT_PHONE     — your WhatsApp number with country code, e.g. +91XXXXXXXXXX
 *   CALLMEBOT_APIKEY    — key CallMeBot sends you during its one-time activation
 */

const SANDBOX_FROM = "Ganga Tiram Orders <onboarding@resend.dev>";
const senderAddress = () => process.env.ORDER_FROM_EMAIL || SANDBOX_FROM;

type OrderInfo = {
  orderId: number;
  name: string;
  phone: string;
  email: string;
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
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: senderAddress(),
        to: [to],
        subject: `Book order #${order.orderId} — ${order.name}, ${order.state}`,
        text: [
          `New book order on gangatiram.in`,
          ``,
          `Order    #${order.orderId}`,
          `Name     ${order.name}`,
          `Phone    ${order.phone}`,
          `Email    ${order.email || "— not given —"}`,
          `Address  ${order.address}`,
          `Pincode  ${order.pincode}`,
          `State    ${order.state}`,
          `Country  ${order.country}`,
          `Amount   ₹${ORDER_TOTAL} (free shipping) — UPI proof submitted; verification pending`,
          ``,
          `Payee    ${UPI_PAYEE} (${UPI_ID})`,
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
    if (!res.ok) console.error("order email rejected", res.status, await res.text().catch(() => ""));
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
    const text = `Ganga Tiram: new book order #${order.orderId} — ${order.name} (${order.phone}), ${order.state} (${order.pincode}). ₹${ORDER_TOTAL} UPI proof submitted; verification pending. Check Gmail for the payment proof.`;
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

/**
 * Footer links — skips anything still unset or left as a placeholder in
 * content/site.ts, so the footer grows on its own once the real URLs land
 * rather than shipping a dead "#instagram" to a customer.
 */
function footerLinks(): { label: string; href: string }[] {
  return [
    { label: "Instagram", href: instagramHref },
    { label: "WhatsApp circle", href: whatsappHref },
    { label: "LinkedIn", href: linkedinHref },
  ].filter((l) => l.href && !l.href.startsWith("#"));
}

/**
 * The thank-you that goes to the buyer. Distinct from sendOrderEmail, which
 * alerts the shop; this one never carries the payment proof or the admin link.
 * Fail-soft: a bounce must not fail an order that is already paid and stored.
 */
export async function sendCustomerThankYou(order: OrderInfo): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !order.email) return false;

  const links = footerLinks();
  const contact = contactEmail ? `Write to us: ${contactEmail}` : "";
  const firstName = order.name.trim().split(/\s+/)[0] || "friend";

  const text = [
    `Dear ${firstName},`,
    ``,
    `Thank you for ordering Ganga Tiram.`,
    ``,
    `The book you've just bought began as a walk — Gomukh to Gangasagar, 2,525`,
    `kilometres, on foot, along the whole length of the river. What came back was`,
    `220 pages and 75 photographs of 75 places, told in river order: the people`,
    `met, the festivals stumbled into, the stories the Ganga gave up along the way.`,
    ``,
    `We're verifying your payment now. Your tracking details follow within 24`,
    `hours, and shipping is on us.`,
    ``,
    `One more thing worth saying: every copy carries the mission. Your order helps`,
    `fund ghat cleanups and keeps weaver looms running. That isn't a line on a`,
    `page — it's where the money goes.`,
    ``,
    `Walk with the river.`,
    ``,
    `— Team Ganga Tiram`,
    ``,
    `Order #${order.orderId} · ₹${ORDER_TOTAL} · shipping to ${order.pincode}`,
    ``,
    links.map((l) => `${l.label}: ${l.href}`).join("\n"),
    contact,
    `gangatiram.in`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
  const html = `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.65;color:#111;max-width:560px">
<p>Dear ${esc(firstName)},</p>
<p>Thank you for ordering <em>Ganga Tiram</em>.</p>
<p>The book you've just bought began as a walk — Gomukh to Gangasagar, 2,525 kilometres, on foot, along the whole length of the river. What came back was 220 pages and 75 photographs of 75 places, told in river order: the people met, the festivals stumbled into, the stories the Ganga gave up along the way.</p>
<p>We're verifying your payment now. Your tracking details follow within 24 hours, and shipping is on us.</p>
<p>One more thing worth saying: every copy carries the mission. Your order helps fund ghat cleanups and keeps weaver looms running. That isn't a line on a page — it's where the money goes.</p>
<p>Walk with the river.</p>
<p>— Team Ganga Tiram</p>
<hr style="border:none;border-top:1px solid #ddd;margin:28px 0 16px">
<p style="font-size:13px;color:#666;margin:0 0 8px">
Order #${order.orderId} · ₹${ORDER_TOTAL} · shipping to ${esc(order.pincode)}
</p>
<p style="font-size:13px;color:#666;margin:0">
${links.map((l) => `<a href="${esc(l.href)}" style="color:#666">${l.label}</a>`).join(" &middot; ")}
${contact ? `<br>${esc(contact)}` : ""}
<br><a href="https://gangatiram.in" style="color:#666">gangatiram.in</a>
</p>
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: senderAddress(),
        to: [order.email],
        reply_to: process.env.ORDER_REPLY_TO || process.env.ORDER_NOTIFY_EMAIL || undefined,
        subject: `Your copy of Ganga Tiram is on its way`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("thank-you email rejected", res.status, await res.text().catch(() => ""));
    }
    return res.ok;
  } catch (error) {
    console.error("thank-you email failed", error);
    return false;
  }
}

export async function sendLampEmail(
  info: { firstId: number; names: string[]; dedication: string; email: string; whatsapp: string },
  screenshot: { buffer: Buffer; mime: string; filename: string }
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!key || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Ganga Tiram Diyas <onboarding@resend.dev>",
        to: [to],
        subject: `Diya #${info.firstId}${info.names.length > 1 ? ` +${info.names.length - 1} more` : ""} — ${info.names[0]}`,
        text: [
          `New Dev Deepawali diya offering on gangatiram.in`,
          ``,
          `Diyas    ${info.names.length} × ₹${LAMP_PRICE} = ₹${info.names.length * LAMP_PRICE}`,
          `Names    ${info.names.join(" · ")}`,
          info.dedication ? `Dedication  ${info.dedication}` : ``,
          `Email    ${info.email}`,
          `WhatsApp ${info.whatsapp || "—"}`,
          ``,
          `Payee    ${UPI_PAYEE} (${UPI_ID})`,
          `Payment screenshot attached. Statuses: received → lit → clip sent.`,
          `Admin: https://gangatiram.in/admin`,
        ].filter(Boolean).join("\n"),
        attachments: [
          {
            filename: screenshot.filename || `diya-${info.firstId}-proof.jpg`,
            content: screenshot.buffer.toString("base64"),
          },
        ],
      }),
    });
    if (!res.ok) console.error("lamp email rejected", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (error) {
    console.error("lamp email failed", error);
    return false;
  }
}
