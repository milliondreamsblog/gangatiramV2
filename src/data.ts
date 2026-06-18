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
