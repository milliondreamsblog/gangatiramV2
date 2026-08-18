/**
 * Chapter pages (`/services/[slug]`) — one page per chapter of the river's life.
 */
export type ServicePage = {
  slug: string;
  eyebrow: string;
  headline: string;
  intro: string;
  heroImage: string;
};

export const servicePages: ServicePage[] = [
  {
    slug: "birth-gomukh",
    eyebrow: "Chapter One — Birth",
    headline: "Where the river is born",
    intro:
      "A trek to 4,023 metres ends at the mouth of the Gangotri glacier, where grey-blue meltwater rushes out of the ice. The source has been retreating for a hundred years — the mouth she is born from keeps moving away.",
    heroImage: "/services/hero-birth-gomukh.png",
  },
  {
    slug: "naming-rishikesh",
    eyebrow: "Chapter Two — Naming",
    headline: "Where she earns her name",
    intro:
      "At Devprayag the Bhagirathi and Alaknanda converge, and from that point the river is called Ganga. At Rishikesh she runs clear and fast over boulders, past two hundred ashrams built to listen to her.",
    heroImage: "/services/hero-naming-rishikesh.png",
  },
  {
    slug: "testing-haridwar",
    eyebrow: "Chapter Three — Testing",
    headline: "Where she leaves the mountains",
    intro:
      "Haridwar is the gateway between the hills and the plains. Every evening at Har Ki Pauri, a thousand floating leaf-lamps mark her passage — the aarti that has seen her off for centuries.",
    heroImage: "/services/hero-testing-haridwar.png",
  },
  {
    slug: "gathering-prayagraj",
    eyebrow: "Chapter Four — Gathering",
    headline: "Where the waters meet",
    intro:
      "At the Triveni Sangam the muddy Ganga embraces the deep-blue Yamuna. Once every twelve years the Kumbh Mela gathers 120 million people here — the largest meeting of human beings on earth.",
    heroImage: "/services/hero-gathering-prayagraj.png",
  },
  {
    slug: "reckoning-varanasi",
    eyebrow: "Chapter Five — Reckoning",
    headline: "The city of liberation",
    intro:
      "Eighty-four stone ghats descend to the water in a three-thousand-year-old crescent. Here the fires never go out, and to die beside her is called moksha — liberation itself.",
    heroImage: "/services/hero-reckoning-varanasi.png",
  },
  {
    slug: "working-life-patna",
    eyebrow: "Chapter Six — Working Life",
    headline: "The river that feeds a nation",
    intro:
      "On the plains she spreads five kilometres wide, over the ruins of the Maurya capital. Her silt raises the grain that feeds four in ten Indians; her current turns looms, nets, and wheels.",
    heroImage: "/services/hero-working-life-patna.png",
  },
  {
    slug: "the-wound",
    eyebrow: "Chapter Seven — The Wound",
    headline: "The river that was a river begins to thin",
    intro:
      "At Kanpur, tannery waste stains the current a whole plain drinks from. At Farakka, the barrage thins her flow — and with it the Gangetic dolphins that need her deep and moving. This chapter is why the mission exists.",
    heroImage: "/services/hero-the-wound.png",
  },
  {
    slug: "return-gangasagar",
    eyebrow: "Chapter Eight — Return",
    headline: "Where she lets go of her name",
    intro:
      "After 2,525 kilometres, at the island of Gangasagar, the river meets the Bay of Bengal. The journey that began in ice ends in salt — and every January, half a million pilgrims come to watch her go.",
    heroImage: "/services/hero-return-gangasagar.png",
  },
];

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug);
