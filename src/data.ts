export interface GangaPlace {
  id: number;
  name: string;
  state: string;
  stage: number; // 1-8, the river-journey chapter (Birth ... Return)
  description: string;
  features: string[];
  cuisine: string;
  art: string;
  heritage: string;
  imageUrl: string;
}

// All 75 places from the Ganga Tiram book, in downstream order (Gomukh -> Sweta Ganga).
export const gangaPlaces: GangaPlace[
  ] = [
  {
    id: 1,
    name: "Gomukh",
    state: "Uttarakhand",
    stage: 1,
    description: "Trek to 4,023 meters altitude to witness the grey-blue meltwater rushing from the mouth of the Gangotri glacier.",
    features: ["Glacier Trek", "4,023m Glacier Snout", "Bhagirathi Source"],
    cuisine: "Warm Gahat Dal & Pahadi Roti",
    art: "Sculpted Ice Caves",
    heritage: "Gangotri Temple Shrine",
    imageUrl: "./images/gomukh_glacier_1781868272124.png"
  },
  {
    id: 2,
    name: "Gangotri",
    state: "Uttarakhand",
    stage: 1,
    description: "Chota Char Dham shrine where King Bhagiratha's penance brought Ganga to earth; the present temple was raised in the early 18th century by Gorkha commander Amar Singh Thapa.",
    features: ["Bhagirathi Shila", "Gartang Gali Bridge", "Ganga Dussehra Festival"],
    cuisine: "Kafuli, Phaanu & Arsa",
    art: "Woollen Shawls & Tibetan Artifacts",
    heritage: "Chota Char Dham Pilgrimage Shrine",
    imageUrl: ""
  },
  {
    id: 3,
    name: "Mukhba",
    state: "Uttarakhand",
    stage: 1,
    description: "Harsil-valley village that becomes Goddess Ganga's winter home when her deity arrives each Diwali in a flower-decorated palanquin escorted by priests and folk musicians.",
    features: ["Ganga Winter Temple", "Diwali Palanquin Procession", "Janaktal Trek"],
    cuisine: "Sisunak Saag & Gahat Dal",
    art: "Mukhota Wooden Mask Making",
    heritage: "Winter Abode Of Goddess Ganga",
    imageUrl: ""
  }
];

export interface FacePillar {
  letter: string;
  title: string;
  headline: string;
  stat: string;
  cta: string;
  action: 'festivals' | 'art' | 'craft' | 'environment';
  icon: string;
  image: string;
}

export const contribFACE: FacePillar[] = [
  {
    letter: "F",
    title: "Festivals",
    headline: "No festival dies if it is recorded.",
    stat: "A digital 4K archive — the Kumbh Mela and the daily aartis of 84 ghats.",
    cta: "Watch her festivals",
    action: "festivals",
    icon: "Sparkles",
    image: "./images/ganga_festival_new.png"
  },
  {
    letter: "A",
    title: "Art",
    headline: "150 painters still paint her.",
    stat: "Madhubani, Kalighat, and Patachitra artists funded along her banks.",
    cta: "Meet the painters",
    action: "art",
    icon: "Palette",
    image: "./images/ganga_art_new.png"
  },
  {
    letter: "C",
    title: "Craft",
    headline: "50 looms still weave her.",
    stat: "Banarasi and Tussar silk families, sourced directly — no middlemen.",
    cta: "See the looms",
    action: "craft",
    icon: "Scissors",
    image: "./images/ganga_craft_new.png"
  },
  {
    letter: "E",
    title: "Environment",
    headline: "5,000 kg of plastic leaves her banks monthly.",
    stat: "Ghat cleanups and the Gangetic dolphin watch, every single month.",
    cta: "Join a cleanup",
    action: "environment",
    icon: "Leaf",
    image: "./images/ganga_environment_new.png"
  }
];
