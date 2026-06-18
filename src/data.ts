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
