export interface GangaPlace {
  id: number;
  name: string;
  state: string;
  description: string;
  features: string[];
  cuisine: string;
  art: string;
  heritage: string;
}

export const gangaPlaces: GangaPlace[] = [
  {
    id: 1,
    name: "Gomukh",
    state: "Uttarakhand",
    description: "Trek to 3,892 meters altitude to witness the grey-blue meltwater rushing from the mouth of the Gangotri glacier.",
    features: ["Glacier Trek", "3,892m Peak", "Bhagirathi Source"],
    cuisine: "Warm Gahat Dal & Pahadi Roti",
    art: "Sculpted Ice Caves",
    heritage: "Gangotri Temple Shrine"
  },
  {
    id: 2,
    name: "Rishikesh",
    state: "Uttarakhand",
    description: "Where the clear Ganga flows rapidly over boulders past 200+ ashrams, offering Grade IV white-water rapids.",
    features: ["White-Water Rafting", "Beatles Ashram", "Lakshman Jhula"],
    cuisine: "Organic Ayurvedic Herbal Tea",
    art: "Riverside Ghat Wall Murals",
    heritage: "Yoga & Meditation Retreats"
  },
  {
    id: 3,
    name: "Haridwar",
    state: "Uttarakhand",
    description: "The gateway where the river exits the mountains, illuminated by 1,000 floating leaf-lamps at Har Ki Pauri every evening.",
    features: ["Har Ki Pauri Aarti", "Mansa Devi Ropeway", "Kumbh Mela Site"],
    cuisine: "Aloo Puri & Kulhad Lassi",
    art: "Clay Diya & Flower Basket Craft",
    heritage: "Footprint of Lord Vishnu"
  },
  {
    id: 4,
    name: "Prayagraj",
    state: "Uttar Pradesh",
    description: "Where the muddy Ganga merges with the deep blue Yamuna, hosting 120 million pilgrims during the Kumbh Mela.",
    features: ["Triveni Sangam", "Kumbh Mela Grounds", "Akshayavat Tree"],
    cuisine: "Allahabadi Surkha Guava & Chaat",
    art: "Kumbh Festival Sand Sculptures",
    heritage: "Gupta Era Patalpuri Temple"
  },
  {
    id: 5,
    name: "Varanasi",
    state: "Uttar Pradesh",
    description: "A 3,000-year-old crescent city where 84 stone steps (ghats) lead down to the river for daily wood-fire cremations and prayers.",
    features: ["Kashi Vishwanath Temple", "84 Ghats Boat Ride", "Subah-e-Banaras"],
    cuisine: "Tamatar Chaat & Banarasi Paan",
    art: "Generational Banarasi Silk Weaving",
    heritage: "Oldest Living City in the World"
  },
  {
    id: 6,
    name: "Gangasagar",
    state: "West Bengal",
    description: "The vast delta junction where the river empties into the ocean, hosting 5 million pilgrims who bathe in the cold sea every January.",
    features: ["Sagar Sangam Bath", "Kapil Muni Ashram", "Sagar Island Lighthouse"],
    cuisine: "Nolen Gur Sandesh & Khichuri",
    art: "Sundarbans Coir & Clay Dolls",
    heritage: "Kapil Muni Vedic Legend"
  },
  {
    id: 11,
    name: "Patna",
    state: "Bihar",
    description: "The flat plains capital where the Ganga spreads up to 5 kilometers wide, sitting on ruins of the Maurya dynasty's 80-pillared hall.",
    features: ["Golghar Granary", "Patna Museum", "Takht Sri Patna Sahib"],
    cuisine: "Litti Chokha & Sattu Sharbat",
    art: "Handmade Madhubani Paper Art",
    heritage: "Maurya Empire Throne Ruins"
  },
  {
    id: 12,
    name: "Bhagalpur",
    state: "Bihar",
    description: "The 50km river stretch where rare blind Gangetic dolphins surface, next to weaver looms weaving textured golden Tussar silk.",
    features: ["Dolphin Sanctuary", "Vikramshila University", "Tussar Silk Looms"],
    cuisine: "Traditional Fish Curry & Rice",
    art: "Generational Manjusha Folk Art",
    heritage: "8th-Century Buddhist Seat"
  },
  {
    id: 13,
    name: "Murshidabad",
    state: "West Bengal",
    description: "The river bend housing the Hazarduari Palace with its 1,000 doors, hosting the historic ivory carvers and fine Murshidabadi silk looms.",
    features: ["Hazarduari Palace", "Katra Mosque", "Imambara Palace"],
    cuisine: "Murshidabadi Biryani & Sheermal",
    art: "Sholapith Reed Craft & Ivory Carving",
    heritage: "Nawabs of Bengal Royal Seat"
  },
  {
    id: 14,
    name: "Kolkata",
    state: "West Bengal",
    description: "Where the Hooghly river flows under the cantilevered Howrah Bridge, passing the Dakshineswar Temple's 12 shrines.",
    features: ["Dakshineswar Temple", "Howrah Cantilever Bridge", "Victoria Memorial"],
    cuisine: "Rosogolla & Smoked Hilsa Fish",
    art: "Kalighat Patachitra Painting",
    heritage: "Bengal Renaissance Center"
  }
];

export const contribFACE = [
  {
    letter: "F",
    title: "FESTIVALS (digital)",
    description: "Access the world's first interactive 4K digital archive of the Kumbh Mela and all 84 Varanasi ghats' daily Aarti.",
    icon: "Sparkles",
    image: "/images/ganga_festivals_aarti_1777100934524.png"
  },
  {
    letter: "A",
    title: "Art",
    description: "Directly fund 150 independent painters preserving the ancient Madhubani and Kalighat art styles along the riverbanks.",
    icon: "Palette",
    image: "/images/ganga_art_crafts_1777100912325.png"
  },
  {
    letter: "C",
    title: "Craft",
    description: "Source authentic Banarasi silk and riverbed terracotta directly from 50 verified generational weaver and potter families.",
    icon: "Music",
    image: "/images/ganga_culture_heritage_1777100835789.png"
  },
  {
    letter: "E",
    title: "Environmental issue",
    description: "Monitor and support the active removal of 5,000 kilograms of plastic waste from the Varanasi ghats every month.",
    icon: "Leaf",
    image: "/images/ganga_environment_preservation_1777100892208.png"
  }
];
