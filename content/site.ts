/**
 * Site-wide content: navigation, contact, social links.
 * Ganga Tiram — the book, the FACE mission, and the community's events.
 */

export const contactEmail = "";

/** PLACEHOLDER — paste the real WhatsApp group invite link before deploy. */
export const whatsappHref = "https://chat.whatsapp.com/DEAiLhWV0Yh3pHhUe8XqwS";
export const instagramHref = "#instagram";

/** Primary CTA — the first online gathering. */
export const bookACallHref = "/dev-deepawali";
/** The printed book — the on-site UPI purchase flow. */
export const talkToFounderHref = "/buy";

export const calendlyUrl = "/buy";

export type NavItem = { label: string; href: string; description?: string };

export type NavMenu = {
  label: string;
  href?: string;
  layout?: "detail" | "grid" | "list";
  items?: NavItem[];
};

export const navMenus: NavMenu[] = [
  {
    label: "The Journey",
    layout: "detail",
    items: [
      {
        label: "Birth — Gomukh",
        description: "Grey-blue meltwater at 4,023 metres. Where she begins.",
        href: "/services/birth-gomukh",
      },
      {
        label: "Gathering — Prayagraj",
        description: "Two rivers meet; 120 million people come to watch.",
        href: "/services/gathering-prayagraj",
      },
      {
        label: "Reckoning — Varanasi",
        description: "84 stone ghats where dying beside her is liberation.",
        href: "/services/reckoning-varanasi",
      },
      {
        label: "Return — Gangasagar",
        description: "After 2,525 km she meets the sea, and lets go of her name.",
        href: "/services/return-gangasagar",
      },
    ],
  },
  { label: "FACE", href: "/#work" },
  { label: "The Book", href: "/buy" },
  { label: "Dev Deepawali", href: "/dev-deepawali" },
];

export const socials = [
  { label: "Instagram", href: instagramHref },
  { label: "WhatsApp", href: whatsappHref },
] as const;

/** The river's two ends, in place of city clocks. */
export const clockCities = [
  { city: "Gomukh", label: "KM 0 — GOMUKH", timeZone: "Asia/Kolkata" },
  { city: "Gangasagar", label: "KM 2,525 — GANGASAGAR", timeZone: "Asia/Kolkata" },
] as const;

export const footerTagline = ["Walk with the river", "@gangatiram"];

export const footerColumns = [
  {
    title: "The River",
    links: [
      { label: "Birth — Gomukh", href: "/services/birth-gomukh" },
      { label: "Naming — Rishikesh", href: "/services/naming-rishikesh" },
      { label: "Testing — Haridwar", href: "/services/testing-haridwar" },
      { label: "Gathering — Prayagraj", href: "/services/gathering-prayagraj" },
      { label: "Reckoning — Varanasi", href: "/services/reckoning-varanasi" },
      { label: "Return — Gangasagar", href: "/services/return-gangasagar" },
    ],
  },
  {
    title: "The Mission",
    links: [
      { label: "Festivals", href: "/#work" },
      { label: "Art", href: "/#work" },
      { label: "Craft & Cuisine", href: "/#work" },
      { label: "Environment", href: "/#work" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Dev Deepawali — 24 Nov", href: "/dev-deepawali" },
      { label: "WhatsApp circle", href: whatsappHref },
      { label: "Keep a Lamp", href: "/#faq" },
    ],
  },
  {
    title: "The Book",
    links: [
      { label: "Get the Book — ₹999", href: "/buy" },
      { label: "Look inside", href: "/#book" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
] as const;
