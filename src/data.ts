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
  },
  {
    id: 4,
    name: "Harshil",
    state: "Uttarakhand",
    stage: 1,
    description: "Deodar-forested valley of apple orchards where Vishnu turned to stone to calm two feuding rivers, and Frederick Wilson introduced apples and rajma in the mid-19th century.",
    features: ["Apple Festival", "Lamkhaga Pass Trek", "Hari Ka Shila Rock"],
    cuisine: "Kafuli & Mandua Ki Roti",
    art: "Bhotia Handwoven Woolens",
    heritage: "Vishnu's Rock On Gangotri Route",
    imageUrl: ""
  },
  {
    id: 5,
    name: "Uttarkashi",
    state: "Uttarakhand",
    stage: 1,
    description: "The 'Kashi of the North' on the Bhagirathi, where January's Magh Mela draws tens of thousands for holy dips as local deities parade in decorated palanquins.",
    features: ["Vishwanath Temple", "Magh Mela Fair", "Budhi Diwali Festival"],
    cuisine: "Aloo Ke Gutke & Jhangora Kheer",
    art: "Deodar & Walnut Wood Carving",
    heritage: "Kashi Of The North",
    imageUrl: ""
  },
  {
    id: 6,
    name: "Guptkashi",
    state: "Uttarakhand",
    stage: 1,
    description: "'Hidden Kashi' where Shiva vanished from the Pandavas as a bull, and the Manikarnika Kund inside Vishwanath Temple unites waters of Ganga and Yamuna.",
    features: ["Vishwanath Temple", "Manikarnika Kund", "Tungnath Trek Base"],
    cuisine: "",
    art: "Pashmina Shawls & Aipan Art",
    heritage: "Hidden Kashi Of Panch Kedar Legend",
    imageUrl: ""
  },
  {
    id: 7,
    name: "Ukhimath",
    state: "Uttarakhand",
    stage: 1,
    description: "Winter seat of the Kedarnath and Madhyamaheshwar deities on the Mandakini, with serene viewpoints of the Chaukhamba peaks and emperor Mandhata's Omkareshwar Temple.",
    features: ["Omkareshwar Temple", "Deoria Tal Trek", "Chaukhamba Peak Views"],
    cuisine: "",
    art: "Aipan Murals & Wood Carving",
    heritage: "Kedarnath Deity's Winter Abode",
    imageUrl: ""
  },
  {
    id: 8,
    name: "Badrinath",
    state: "Uttarakhand",
    stage: 1,
    description: "Char Dham shrine on the Alaknanda where Lakshmi became a berry tree to shield meditating Vishnu; pilgrims cleanse sins in the Tapt Kund hot spring.",
    features: ["Tapt Kund Hot Spring", "Mana Village Vyasa Cave", "Vasudhara Falls Trek"],
    cuisine: "Thechwani Potato-Radish Preparation",
    art: "",
    heritage: "Char Dham Restored By Shankaracharya",
    imageUrl: ""
  },
  {
    id: 9,
    name: "Vishnuprayag",
    state: "Uttarakhand",
    stage: 1,
    description: "First of the Panch Prayags, where the Dhauliganga meets the Alaknanda, and gateway to the Valley of Flowers with over 600 species of exotic blooms.",
    features: ["Alaknanda-Dhauliganga Sangam", "Valley Of Flowers Trek", "Kagbhusandi Lake Trek"],
    cuisine: "",
    art: "",
    heritage: "First Panch Prayag, Narada's Penance Site",
    imageUrl: ""
  },
  {
    id: 10,
    name: "Nandprayag",
    state: "Uttarakhand",
    stage: 1,
    description: "Second Panch Prayag at 1,358 meters, where the Nandakini joins the Alaknanda beside the slab on which Nanda Maharaj performed his great yagna.",
    features: ["Nanda Temple", "Alaknanda-Nandakini Sangam", "Nanda Devi Raj Jat"],
    cuisine: "",
    art: "Cane & Bamboo Weaving",
    heritage: "Site Of Nanda Maharaj's Sacred Yagna",
    imageUrl: ""
  },
  {
    id: 11,
    name: "Karnaprayag",
    state: "Uttarakhand",
    stage: 1,
    description: "At 1,451 meters on the Alaknanda-Pindar confluence, a town of 16 ancient temples where Karna's arduous penance won the Sun God's blessing.",
    features: ["Uma Devi Temple", "Adi Badri Temple", "Roopkund Trek Base"],
    cuisine: "",
    art: "Thulma Blankets & Aipan Art",
    heritage: "Karna's Penance To The Sun God",
    imageUrl: ""
  },
  {
    id: 12,
    name: "Kedarnath",
    state: "Uttarakhand",
    stage: 1,
    description: "One of twelve Jyotirlingas, reached by a tough 16 km trek from Gaurikund, where the Pandavas found Shiva's hump and the Mandakini springs from Chorabari glacier.",
    features: ["Jyotirlinga Shrine", "Gaurikund Trek", "Vasuki Tal Lake"],
    cuisine: "",
    art: "Pandav Lila Folk Dance",
    heritage: "Jyotirlinga Built By The Pandavas",
    imageUrl: ""
  },
  {
    id: 13,
    name: "Sonprayag",
    state: "Uttarakhand",
    stage: 1,
    description: "Sangam of the Mandakini and Basuki rivers near Triyuginarayan Temple, where the flame lit at Shiva and Parvati's divine wedding still burns today.",
    features: ["Mandakini-Basuki Sangam", "Triyuginarayan Temple", "Gauri Mata Hot Spring"],
    cuisine: "",
    art: "",
    heritage: "Gateway To Kedarnath Pilgrimage",
    imageUrl: ""
  },
  {
    id: 14,
    name: "Rudraprayag",
    state: "Uttarakhand",
    stage: 1,
    description: "Panch Prayag town at the Alaknanda-Mandakini confluence, named for the fearsome Rudra form in which Shiva appeared to bless sage Narada's penance.",
    features: ["Alaknanda-Mandakini Sangam", "Koteshwar Mahadev Temple", "Kartikswami Temple"],
    cuisine: "Bhatt Ki Churkani & Bal Mithai",
    art: "Wood Carving & Kumaoni Textiles",
    heritage: "Shiva's Rudra Form Blessed Narada",
    imageUrl: ""
  },
  {
    id: 15,
    name: "Devprayag",
    state: "Uttarakhand",
    stage: 2,
    description: "Where the turquoise Alaknanda merges with the Bhagirathi and the united river first becomes Ganga, beginning her 1000-mile journey to Gangasagar.",
    features: ["Raghunathji Temple", "Ram Kunda Footprints", "Nakshatra Veda Shala Observatory"],
    cuisine: "Singori & Mandua Ki Roti",
    art: "",
    heritage: "Where River Ganga Begins Her Name",
    imageUrl: ""
  },
  {
    id: 16,
    name: "Vashistha Gufa",
    state: "Uttarakhand",
    stage: 2,
    description: "Descend 200 steps off the Rishikesh-Badrinath highway to the riverside cave where sage Vashistha meditated for decades, a small Shiva Linga at its inner end.",
    features: ["Vashistha Meditation Cave", "Arundhati Cave", "Pristine Ganga Beach"],
    cuisine: "",
    art: "",
    heritage: "Meditation Cave Of Saptarishi Vashistha",
    imageUrl: ""
  },
  {
    id: 17,
    name: "Brahmapuri",
    state: "Uttarakhand",
    stage: 2,
    description: "Riverside spot where Ganga, honoring Lord Ram's penance, still flows slow and silent along a 600-700 metre stretch past the old Sri Ram Tapaswali ashram.",
    features: ["Sri Ram Tapaswali Ashram", "Silent Ganga Stretch", "Lord Ram Penance Site"],
    cuisine: "",
    art: "",
    heritage: "Lord Ram's Silent Penance Site",
    imageUrl: ""
  },
  {
    id: 18,
    name: "Rishikesh",
    state: "Uttarakhand",
    stage: 2,
    description: "Where the clear Ganga flows rapidly over boulders past 200+ ashrams, offering Grade IV white-water rapids.",
    features: ["White-Water Rafting", "Beatles Ashram", "Lakshman Jhula"],
    cuisine: "Organic Ayurvedic Herbal Tea",
    art: "Riverside Ghat Wall Murals",
    heritage: "Yoga & Meditation Retreats",
    imageUrl: "./images/rishikesh_river_1781868284118.png"
  },
  {
    id: 19,
    name: "Haridwar",
    state: "Uttarakhand",
    stage: 3,
    description: "The gateway where the river exits the mountains, illuminated by 1,000 floating leaf-lamps at Har Ki Pauri every evening.",
    features: ["Har Ki Pauri Aarti", "Mansa Devi Ropeway", "Kumbh Mela Site"],
    cuisine: "Aloo Puri & Kulhad Lassi",
    art: "Clay Diya & Flower Basket Craft",
    heritage: "Footprint of Lord Vishnu",
    imageUrl: "./images/haridwar_aarti_1781868296149.png"
  },
  {
    id: 20,
    name: "Shukratal",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Under the still-standing Akshayavat banyan, sage Sukhdev Goswami recited the 18,000-verse Srimad Bhagavatam to Emperor Parikshit, who had been cursed to die within seven days.",
    features: ["Akshayavat Banyan Tree", "Kartika Poornima Holy Dip", "Srimad Bhagavatam Recital Site"],
    cuisine: "",
    art: "",
    heritage: "Where Srimad Bhagavatam Was First Spoken",
    imageUrl: ""
  },
  {
    id: 21,
    name: "Meerut",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Trigger point of the 1857 rebellion, with the Mahabharata's Lakshagraha palace under excavation at Barnava village on the Ganga, 32 km away.",
    features: ["Augharnath Temple", "Nauchandi Mela", "Shahid Smarak Memorial"],
    cuisine: "",
    art: "Musical Instruments & Engraved Woodwork",
    heritage: "First Flashpoint of 1857 Rebellion",
    imageUrl: ""
  },
  {
    id: 22,
    name: "Haiderpur Wetland",
    state: "Uttar Pradesh",
    stage: 3,
    description: "A man-made wetland formed by the 1984 Madhya Ganga Barrage — India's 47th Ramsar Site — sheltering over 300 bird species on the Central Asian Flyway.",
    features: ["300+ Bird Species", "Eco Hut Wetland Trails", "Endangered Gharial Habitat"],
    cuisine: "",
    art: "",
    heritage: "India's 47th Ramsar Site",
    imageUrl: ""
  },
  {
    id: 23,
    name: "Hastinapur Forest Reserve",
    state: "Uttar Pradesh",
    stage: 3,
    description: "The Kauravas' cursed capital turned dense forest, where Draupadi's bathing ghats survive and gharials and Gangetic dolphins still swim the Ganga.",
    features: ["Draupadi's Bathing Ghats", "Pandava Tila Excavations", "Gangetic Dolphin Spotting"],
    cuisine: "Simple Jain Vegetarian Food",
    art: "Painted Grey Ware Pottery",
    heritage: "Ancient Capital of the Kauravas",
    imageUrl: ""
  },
  {
    id: 24,
    name: "Garhmukteswar",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Riverside town of about 50,000 where Ganga took human form to wed King Santanu, and pilgrims camp in tents for the Kartik Purnima Garh Ganga Fair.",
    features: ["Mukteshwar Mahadev Temple", "Brij Ghat", "Garh Ganga Fair"],
    cuisine: "",
    art: "",
    heritage: "Where Ganga Wed King Santanu",
    imageUrl: ""
  },
  {
    id: 25,
    name: "Belon Devi",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Shakti Peeth temple 5 km from Narora's nuclear plant, built by Rao Bhup Singh after the goddess, buried deep in the earth, appeared in his dream.",
    features: ["Sarva Mangala Devi Temple", "Navratri Festival", "Kartik Purnima Gatherings"],
    cuisine: "",
    art: "",
    heritage: "Shakti Peeth Risen from the Earth",
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
