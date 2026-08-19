/**
 * The FACE of Ganga — four wings of the mission as full-bleed cards.
 */
type WorkItem = {
  name: string;
  title: string;
  subtitle: string | null;
  logo: string;
  mockup: string;
  href: string;
  video: string;
  dark: boolean;
  bg: string;
};

export const work: WorkItem[] = [
  {
    name: "Festivals",
    title: "Festivals",
    subtitle: "No festival dies if it is recorded",
    logo: "/work/logos/festivals.svg",
    mockup: "/work/cards/festivals.png",
    href: "/dev-deepawali",
    video: "",
    dark: false,
    bg: "#10201c",
  },
  {
    name: "Art",
    title: "Art",
    subtitle: "150 painters still paint her",
    logo: "/work/logos/art.svg",
    mockup: "/work/cards/art.png",
    href: "/#services",
    video: "",
    dark: false,
    bg: "#1c1410",
  },
  {
    name: "Craft & Cuisine",
    title: "Craft & Cuisine",
    subtitle: "50 looms weave her — and her kitchens feed her",
    logo: "/work/logos/craft.svg",
    mockup: "/work/cards/craft-cuisine.jpg",
    href: "/#services",
    video: "",
    dark: false,
    bg: "#181018",
  },
  {
    name: "Environment",
    title: "Environment",
    subtitle: "5,000 kg of plastic leaves her banks monthly",
    logo: "/work/logos/environment.svg",
    mockup: "/work/cards/environment.png",
    href: "/#services",
    video: "",
    dark: false,
    bg: "#101a20",
  },
];
