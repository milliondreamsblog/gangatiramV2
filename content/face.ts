/**
 * The FACE of Ganga — four wings of the mission, shown as click-to-expand
 * tabs (letter → full form). Numbers as published on gangatiram.in.
 */
export type FaceWing = {
  letter: string;
  name: string;
  claim: string;
  body: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export const faceHeading = ["The FACE", "of Ganga"];
export const faceIntro =
  "FACE is how we serve her — Festivals, Art, Craft & Cuisine, Environment. Four promises, kept every month.";

export const faceWings: FaceWing[] = [
  {
    letter: "F",
    name: "Festivals",
    claim: "No festival dies if it is recorded.",
    body: "A digital 4K archive — the Kumbh Mela and the daily aartis of 84 ghats, filmed before they fade.",
    image: "/work/cards/festivals.png",
    ctaLabel: "Join Dev Deepawali — 24 Nov",
    ctaHref: "/dev-deepawali",
  },
  {
    letter: "A",
    name: "Art",
    claim: "150 painters still paint her.",
    body: "Madhubani, Kalighat, and Patachitra artists funded along her banks — the living culture, not the museum.",
    image: "/work/cards/art.png",
    ctaLabel: "See the chapters",
    ctaHref: "/#services",
  },
  {
    letter: "C",
    name: "Craft & Cuisine",
    claim: "50 looms weave her. Her kitchens feed her.",
    body: "Banarasi silk sourced straight from weaver families — and her table kept alive: kulhad chai, malaiyo, prasad, the recipes her ghats have always served.",
    image: "/work/cards/craft-cuisine.png",
    ctaLabel: "See the chapters",
    ctaHref: "/#services",
  },
  {
    letter: "E",
    name: "Environment",
    claim: "5,000 kg of plastic leaves her banks monthly.",
    body: "Ghat cleanups and the Gangetic dolphin watch — stewardship, every single month, with numbers published.",
    image: "/work/cards/environment.png",
    ctaLabel: "Keep a Lamp",
    ctaHref: "/#faq",
  },
];
