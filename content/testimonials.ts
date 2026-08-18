/**
 * Her three gifts — soul, body, and mind — as the big-card marquee.
 * Copy carried from the live gangatiram.in "three gifts" section.
 */
const SOURCE = "/#services";

const PHOTOS = ["/testimonials/soul.png", "/testimonials/body.png", "/testimonials/mind.png"];
const LOGO = "/logos/birth.svg";

type Source = {
  name: string;
  role: string;
  quote: string;
  clutch: string;
  photo?: string;
  logo?: string;
};

const sources: Source[] = [
  {
    name: "Soul",
    role: "Haridwar · Varanasi",
    photo: "/testimonials/soul.png",
    quote:
      "A single dip at Har Ki Pauri is said to wash lifetimes. At Kashi, to die beside her is liberation itself.",
    clutch: SOURCE,
  },
  {
    name: "Body",
    role: "Patna · Bhagalpur",
    photo: "/testimonials/body.png",
    quote:
      "Her silt raises the grain of the plains; her current turns looms, nets, and wheels from the hills to the sea.",
    clutch: SOURCE,
  },
  {
    name: "Mind",
    role: "Rishikesh · Nabadwip",
    photo: "/testimonials/mind.png",
    quote:
      "Three thousand years of scholars, ragas, and verse rose beside her — India learned to think on her banks.",
    clutch: SOURCE,
  },
];

export const testimonialsHeading = ["Her three gifts.", "One river — soul, body, and mind."];

export const testimonials = sources.map((s, i) => ({
  ...s,
  quote: `“${s.quote}”`,
  photo: s.photo ?? PHOTOS[i % PHOTOS.length],
  logo: s.logo ?? LOGO,
}));
