/**
 * "Look inside" — six real spreads from the printed book, shown as the
 * scrolling strip. One product, one price: the book, ₹999.
 */
export type ShopItem = {
  slug: string;
  name: string;
  category: string;
  price: string;
  badge?: string;
  image: string;
  href: string;
};

export const shopHeading = ["Look inside —", "six spreads from the journey"];
export const shopIntro =
  "Real pages from the printed edition. Seventy-five places, told in river order — these are six of them.";

/** The purchase flow. */
export const bookHref = "/buy";

export const shopItems: ShopItem[] = [
  {
    slug: "gomukh",
    name: "Gomukh — where she is born",
    category: "From the printed book",
    price: "Pages 10–11",
    badge: "Opening spread",
    image: "/shop/spread-01-gomukh.jpg",
    href: bookHref,
  },
  {
    slug: "haridwar",
    name: "Haridwar — evening aarti at Har Ki Pauri",
    category: "From the printed book",
    price: "Pages 60–61",
    image: "/shop/spread-02-haridwar.jpg",
    href: bookHref,
  },
  {
    slug: "prayagraj",
    name: "Prayagraj — the world's largest human gathering",
    category: "From the printed book",
    price: "Pages 104–105",
    image: "/shop/spread-03-prayagraj.jpg",
    href: bookHref,
  },
  {
    slug: "varanasi",
    name: "Varanasi — the city of liberation",
    category: "From the printed book",
    price: "Pages 114–115",
    image: "/shop/spread-04-varanasi.jpg",
    href: bookHref,
  },
  {
    slug: "sonepur",
    name: "Sonepur Mela — the great riverside fair",
    category: "From the printed book",
    price: "Pages 130–131",
    image: "/shop/spread-05-sonepur.jpg",
    href: bookHref,
  },
  {
    slug: "gangasagar",
    name: "Gangasagar — where she meets the sea",
    category: "From the printed book",
    price: "Pages 208–209",
    badge: "Final spread",
    image: "/shop/spread-06-gangasagar.jpg",
    href: bookHref,
  },
];
