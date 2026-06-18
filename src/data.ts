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
    description: "The source of the Bhagirathi river, one of the primary headstreams of the Ganges.",
    features: ["Glacier", "Trekking", "High Altitude"],
    cuisine: "Local Pahadi food",
    art: "Natural Ice structures",
    heritage: "Purest form of the river"
  },
  {
    id: 2,
    name: "Rishikesh",
    state: "Uttarakhand",
    description: "The Yoga Capital of the World and a gateway to the Himalayas.",
    features: ["Yoga", "Rafting", "Ganga Aarti"],
    cuisine: "Ayurvedic Food",
    art: "Wall murals",
    heritage: "Ashram culture"
  },
  {
    id: 3,
    name: "Haridwar",
    state: "Uttarakhand",
    description: "One of the seven holiest places in Hinduism, where Ganga enters the plains.",
    features: ["Har Ki Pauri", "Kumbh Mela", "Mansa Devi"],
    cuisine: "Aloo Puri, Lassi",
    art: "Handmade Diya making",
    heritage: "Ancient Gate of the Gods"
  },
  {
    id: 4,
    name: "Prayagraj",
    state: "Uttar Pradesh",
    description: "The site of the Triveni Sangam, the confluence of Ganga, Yamuna, and the mythical Saraswati.",
    features: ["Triveni Sangam", "Kumbh Mela", "Anand Bhawan"],
    cuisine: "Guava (Allahabadi Surkha)",
    art: "Kumbh Art",
    heritage: "Cultural hub of India"
  },
  {
    id: 5,
    name: "Varanasi",
    state: "Uttar Pradesh",
    description: "One of the world's oldest continuously inhabited cities, the spiritual heart of India.",
    features: ["Kashi Vishwanath", "84 Ghats", "Banarasi Saree"],
    cuisine: "Banarasi Paan, Chaat, Kachori Sabzi",
    art: "Banarasi Silk Weaving",
    heritage: "Living Heritage City"
  },
  {
    id: 6,
    name: "Gangasagar",
    state: "West Bengal",
    description: "Where the holy Ganga meets the Bay of Bengal.",
    features: ["Sagar Sangam", "Kapil Muni Temple", "Sagar Mela"],
    cuisine: "Bengali delicacies",
    art: "Coir craft",
    heritage: "Ultimate Pilgrimage point"
  },
  {
    id: 11,
    name: "Patna",
    state: "Bihar",
    description: "Ancient Pataliputra, the capital of Maurya and Gupta empires.",
    features: ["Golghar", "Gandhi Maidan", "Patna Saheb"],
    cuisine: "Litti Chokha",
    art: "Madhubani Painting (region)",
    heritage: "Imperial History"
  },
  {
    id: 12,
    name: "Bhagalpur",
    state: "Bihar",
    description: "The Silk City, famous for its Tussar silk and as a hub for river dolphin conservation.",
    features: ["Silk Weaving", "Vikramshila", "Dolphin Sanctuary"],
    cuisine: "Fish curry",
    art: "Manjusha Art",
    heritage: "Ancient University ruins"
  },
  {
    id: 13,
    name: "Murshidabad",
    state: "West Bengal",
    description: "The last capital of independent Bengal, famous for Hazarduari Palace.",
    features: ["Hazarduari Palace", "Silk industry", "Terracotta temples"],
    cuisine: "Murshidabadi Biryani",
    art: "Ivory carving (historical)",
    heritage: "Nawabi History"
  },
  {
    id: 14,
    name: "Kolkata",
    state: "West Bengal",
    description: "The City of Joy, with a rich colonial and cultural history along the Hooghly.",
    features: ["Dakshineswar", "Howrah Bridge", "Victoria Memorial"],
    cuisine: "Rosogolla, Mishti Doi, Fish Fry",
    art: "Kalighat Painting",
    heritage: "Renaissance of Bengal"
  }
];

export const contribFACE = [
  {
    letter: "F",
    title: "Festivals",
    description: "Celebrate and promote the grand festivals like Kumbh Mela and Ganga Aarti that showcase India's soul.",
    icon: "Sparkles",
    image: "/images/ganga_festivals_aarti_1777100934524.png"
  },
  {
    letter: "A",
    title: "Arts",
    description: "Support the local artisans and traditional crafts like Banarasi weaving and Madhubani painting.",
    icon: "Palette",
    image: "/images/ganga_art_crafts_1777100912325.png"
  },
  {
    letter: "C",
    title: "Culture",
    description: "Experience and preserve the diverse cuisines, music, and philosophical traditions of the Ganga basin.",
    icon: "Music",
    image: "/images/ganga_culture_heritage_1777100835789.png"
  },
  {
    letter: "E",
    title: "Environmental Preservation",
    description: "Join the mission to clean Mother Ganga, protect river dolphins, and restore the ecosystem.",
    icon: "Leaf",
    image: "/images/ganga_environment_preservation_1777100892208.png"
  }
];
