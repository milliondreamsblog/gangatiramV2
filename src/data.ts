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
  },
  {
    id: 26,
    name: "Vidur Ashram",
    state: "Uttar Pradesh",
    stage: 3,
    description: "The exile retreat where Vidura served Lord Krishna simple lentils — the same lentil variety still grows here, plucked by pilgrims to plant at home.",
    features: ["Krishna's Lentil Legend", "Budhi Ganga Ghats", "Vidura Pilgrimage Site"],
    cuisine: "Awadhi-Rohilkhandi Breads & Curries",
    art: "Nagina Wood Carving",
    heritage: "Exile Home of Sage Vidura",
    imageUrl: ""
  },
  {
    id: 27,
    name: "Hardoi",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Demon king Hiranyakashyapu's fabled capital, where the pool of Holika Dahan still exists and the Sandi Bird Sanctuary 20 km away hosts over 150 bird species.",
    features: ["Holika Dahan Pool", "Sandi Bird Sanctuary", "Winter Migratory Waterfowl"],
    cuisine: "Fragrant Kala Namak Rice",
    art: "Chikankari & Zardozi Embroidery",
    heritage: "Legendary City of Prahlad and Holika",
    imageUrl: ""
  },
  {
    id: 28,
    name: "Manasi Ganga",
    state: "Uttar Pradesh",
    stage: 3,
    description: "A lake on Govardhan Hill created by Krishna with invoked Ganga water after slaying the calf-demon Vatsasura; bathing here is said to bestow Prem Bhakti.",
    features: ["Govardhan Parikrama Start", "Kusum Sarovar", "Radha Kund & Shyam Kund"],
    cuisine: "Govardhan Prasad Offerings",
    art: "",
    heritage: "Krishna's Self-Created Ganga Lake",
    imageUrl: ""
  },
  {
    id: 29,
    name: "Tigri",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Since Shravan Kumar bathed here with his blind parents in Treta Yuga, millions camp for a week on sandy banks each Kartik Purnima for Ganga Snan.",
    features: ["Tigri Ganga Mela", "Kartik Purnima Holy Dip", "Riverside Tent Camping"],
    cuisine: "",
    art: "",
    heritage: "Western UP's 'Ardh Kumbh' Fair",
    imageUrl: ""
  },
  {
    id: 30,
    name: "Kannauj",
    state: "Uttar Pradesh",
    stage: 3,
    description: "India's GI-tagged perfume capital, where Deg-Bhapka copper stills condense riverbed clay into Mitti Attar that captures the scent of the first rain.",
    features: ["Mehendi Ghat", "Lakh Bahosi Wildlife Sanctuary", "Emperor Harsha's Fort Ruins"],
    cuisine: "",
    art: "Deg-Bhapka Attar Perfumery",
    heritage: "Ancient Kanyakubja, Harsha's Capital",
    imageUrl: ""
  },
  {
    id: 31,
    name: "Kanpur",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Once Karnapur, Duryodhana's gift to Karna, its circular Jagannath 'Rain Temple' at Behta Bujurg, 32 km away, seeps water days before the monsoon begins.",
    features: ["Behta Bujurg Rain Temple", "Brahmavarta Ghat", "Site of 1857 Uprising"],
    cuisine: "",
    art: "",
    heritage: "Karna's Gifted Land, Karnapur",
    imageUrl: ""
  },
  {
    id: 32,
    name: "Bithoor",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Where Lord Brahma created the first human, Valmiki penned the Ramayana, Sita raised Lav and Kush, and freedom icon Rani Laxmi Bai was born.",
    features: ["Valmiki Ashram", "Brahmghat", "Dhruva Teela"],
    cuisine: "",
    art: "",
    heritage: "Brahmavarta, Cradle of the Ramayana",
    imageUrl: ""
  },
  {
    id: 33,
    name: "Jajmau",
    state: "Uttar Pradesh",
    stage: 3,
    description: "An ancient Vedic sacrifice site whose 2-acre mound, said to be King Yayati's fort, has yielded artifacts dating back to 1300-1200 BCE.",
    features: ["Siddhanath Ghat", "Siddha Devi Temple", "King Yayati's Fort Mound"],
    cuisine: "",
    art: "",
    heritage: "Vedic Sacrifice Site Called Siddhapuri",
    imageUrl: ""
  },
  {
    id: 34,
    name: "Soron",
    state: "Uttar Pradesh",
    stage: 3,
    description: "Sacred Shukarkshetra where Lord Varaha appeared and poet Tulsidas was born, its October fair still auctioning horses and camels beside the Ganga's bathing ghats.",
    features: ["Varaha Temples", "Margashirsh Ekadashi Mela", "Kachhla Bridge Ghats"],
    cuisine: "",
    art: "Zari-Zardozi Embroidery",
    heritage: "Seat of Lord Varaha, Tulsidas's Birthplace",
    imageUrl: ""
  },
  {
    id: 35,
    name: "Prayagraj",
    state: "Uttar Pradesh",
    stage: 4,
    description: "Where the muddy Ganga merges with the deep blue Yamuna, hosting 120 million pilgrims during the Kumbh Mela.",
    features: ["Triveni Sangam", "Kumbh Mela Grounds", "Akshayavat Tree"],
    cuisine: "Allahabadi Surkha Guava & Chaat",
    art: "Kumbh Festival Sand Sculptures",
    heritage: "Gupta Era Patalpuri Temple",
    imageUrl: "./images/prayagraj_sangam_1781868310911.png"
  },
  {
    id: 36,
    name: "Mirzapur",
    state: "Uttar Pradesh",
    stage: 4,
    description: "A 1600s East India Company trading post turned carpet capital, whose handmade woolen carpets are exported worldwide and whose hills hide the Lakhania Dari waterfalls.",
    features: ["Vindhyachal Temple", "Lakhania Dari Waterfalls", "Ashtabhuja Temple"],
    cuisine: "",
    art: "Handmade Woolen Carpet Weaving",
    heritage: "Carpet Capital of India",
    imageUrl: ""
  },
  {
    id: 37,
    name: "Vindhyachal Temple",
    state: "Uttar Pradesh",
    stage: 4,
    description: "A Shakti Peetha of Goddess Durga on the Ganga's banks, where the infant who slipped from Kamsa's grasp revealed her true form and foretold his death.",
    features: ["Vindhyavasini Devi Shrine", "Nine-Day Navratri Celebrations", "Vindhya Forest Birdwatching"],
    cuisine: "Pedas & Jalebis",
    art: "Stone Carving & Brassware",
    heritage: "One of the Foremost Shakti Peethas",
    imageUrl: ""
  },
  {
    id: 38,
    name: "Varanasi",
    state: "Uttar Pradesh",
    stage: 5,
    description: "A 3,000-year-old crescent city where 84 stone steps (ghats) lead down to the river for daily wood-fire cremations and prayers.",
    features: ["Kashi Vishwanath Temple", "84 Ghats Boat Ride", "Subah-e-Banaras"],
    cuisine: "Tamatar Chaat & Banarasi Paan",
    art: "Generational Banarasi Silk Weaving",
    heritage: "Oldest Living City in the World",
    imageUrl: "./images/varanasi_ghats_1781868324109.png"
  },
  {
    id: 39,
    name: "Ballia",
    state: "Uttar Pradesh",
    stage: 5,
    description: "Revolutionary town at the Ganga-Ghaghara sangam that declared independence in 1942, where Surha Taal's sanctuary hosts millions of migratory birds flying in from Siberia each winter.",
    features: ["Jay Prakash Narayan Bird Sanctuary", "Bhrigu Ashram", "Dadri Cattle Fair"],
    cuisine: "Bhojpuri Litti Chokha",
    art: "Two-Century Rasra Ramleela",
    heritage: "Sage Bhrigu's hermitage; 1942 revolutionary town",
    imageUrl: ""
  },
  {
    id: 40,
    name: "Buxar",
    state: "Bihar",
    stage: 6,
    description: "Where the Ganga enters Bihar at sage Vishwamitra's Siddhashram, site of Ram's weapons initiation and the decisive 1764 battle that handed Bengal to the East India Company.",
    features: ["Ramrekha Ghat", "Siddhashram Of Vishwamitra", "Chhath Puja"],
    cuisine: "",
    art: "Terracotta And Embroidery Crafts",
    heritage: "Vishwamitra's Siddhashram and 1764 battlefield",
    imageUrl: ""
  },
  {
    id: 41,
    name: "Arrah",
    state: "Bihar",
    stage: 6,
    description: "Forest-named town ('Aranya') where the Sone meets the Ganges, home to Veer Kunwar Singh's Jagdishpur fort and blackbuck roaming the Kaimur hills.",
    features: ["Aranya Devi Temple", "Jagdishpur Fort", "Tarari Sun Temple"],
    cuisine: "",
    art: "Bidesia Folk Theatre",
    heritage: "1857 rebellion hub of Veer Kunwar Singh",
    imageUrl: ""
  },
  {
    id: 42,
    name: "Chappra",
    state: "Bihar",
    stage: 6,
    description: "At the Ganga-Ghaghara sangam Lord Ram freed Ahalya from her stone form, near Aami village's Ambika Bhawani Shakti Peeth of Puranic Gaj-Grah fame.",
    features: ["Ambika Bhawani Shakti Peeth", "Mahendranath Temple", "Ganga-Ghaghara Sangam"],
    cuisine: "",
    art: "Madhubani Paintings",
    heritage: "Ramayana site of Ahalya's liberation",
    imageUrl: ""
  },
  {
    id: 43,
    name: "Saran",
    state: "Bihar",
    stage: 6,
    description: "Riverine district ringed by the Ganges, Gandak, and Ghaghara, where sage Dadhichi surrendered his bones to forge the weapon that slew the demon Vritra.",
    features: ["Sage Dadhichi's Hermitage", "Three-River Fertile Plains", "Ancient Kosala Heritage"],
    cuisine: "",
    art: "",
    heritage: "Sage Dadhichi's ancient sacrifice ground",
    imageUrl: ""
  },
  {
    id: 44,
    name: "Sonepur Mela",
    state: "Bihar",
    stage: 6,
    description: "Centuries-old Kartik fair at the Ganga-Gandak confluence trading elephants, horses, and cattle beside the Harihar Nath Temple built by Lord Ram.",
    features: ["Harihar Nath Temple", "Kartik Animal Fair", "Ganga-Gandak Confluence"],
    cuisine: "Shahi Halwa-Paratha, Baskail Pickle",
    art: "Madhubani Folk Paintings",
    heritage: "Vedic-era fair with Mauryan elephant stables",
    imageUrl: ""
  },
  {
    id: 45,
    name: "Patna",
    state: "Bihar",
    stage: 6,
    description: "The flat plains capital where the Ganga spreads up to 5 kilometers wide, sitting on ruins of the Maurya dynasty's 80-pillared hall.",
    features: ["Golghar Granary", "Patna Museum", "Takht Sri Patna Sahib"],
    cuisine: "Litti Chokha & Sattu Sharbat",
    art: "Handmade Madhubani Paper Art",
    heritage: "Maurya Empire Throne Ruins",
    imageUrl: "./images/patna_river_1781868354310.png"
  },
  {
    id: 46,
    name: "Vaishali",
    state: "Bihar",
    stage: 6,
    description: "Birthplace of Mahavira and site of Buddha's final sermon, where Licchavi kings were crowned at the Abhishek Pushkarani tank beside Ashoka's pillar.",
    features: ["Ashoka Pillar", "Vishwa Shanti Stupa", "Abhishek Pushkarani Tank"],
    cuisine: "",
    art: "Sikki Grass And Lacquer Craft",
    heritage: "Mahavira's birthplace, Buddha's final sermon",
    imageUrl: ""
  },
  {
    id: 47,
    name: "Begusarai",
    state: "Bihar",
    stage: 6,
    description: "Bihar's industrial capital where King Janak performed Kartik Kalpavas at Simariya Ghat and Asia's largest freshwater ox-bow lake shelters 394 recorded animal species.",
    features: ["Simariya Ghat Kalpavas Mela", "Kanwar Lake Bird Sanctuary", "Naulakha Temple"],
    cuisine: "Dahi-Chura And Tilkut",
    art: "",
    heritage: "King Janak's Treta-yuga Kalpavas tapobhumi",
    imageUrl: ""
  },
  {
    id: 48,
    name: "Munger",
    state: "Bihar",
    stage: 6,
    description: "Ancient Moda-giri where Sita Kund's hot spring holds the heat of Sita's Agni-pariksha and the Bihar School of Yoga draws seekers worldwide.",
    features: ["Sita Kund Hot Spring", "Bihar School Of Yoga", "Kasta Harini Ghat"],
    cuisine: "",
    art: "Sohani And Samdaun Folk Music",
    heritage: "Ramayana bathing site, Jarasandha's Mahabharata seat",
    imageUrl: ""
  },
  {
    id: 49,
    name: "Jahnu Giri",
    state: "Bihar",
    stage: 6,
    description: "Sacred Sultanganj stretch where sage Jahnu swallowed the flooding Ganga and released her through his ear, with the Ajgaivinath Shiva temple rising mid-river on a rocky mound.",
    features: ["Ajgaivinath Island Temple", "Shravani Mela Kanwar Yatra", "Gangetic River Dolphins"],
    cuisine: "",
    art: "",
    heritage: "Where Jahnu released Ganga as Jahnavi",
    imageUrl: ""
  },
  {
    id: 50,
    name: "Bhagalpur",
    state: "Bihar",
    stage: 6,
    description: "The 50km river stretch where rare blind Gangetic dolphins surface, next to weaver looms weaving textured golden Tussar silk.",
    features: ["Dolphin Sanctuary", "Vikramshila University", "Tussar Silk Looms"],
    cuisine: "Traditional Fish Curry & Rice",
    art: "Generational Manjusha Folk Art",
    heritage: "8th-Century Buddhist Seat",
    imageUrl: "./images/bhagalpur_dolphins_1781868364980.png"
  },
  {
    id: 51,
    name: "Sahibganj",
    state: "Jharkhand",
    stage: 7,
    description: "Jharkhand's only Ganga district, where Maan Singh's Rajmahal forts overlook Siberian cranes at Udhwa Lake and Mandro's fossil park holds India's oldest plant fossils.",
    features: ["Rajmahal Hills And Forts", "Udhwa Lake Bird Sanctuary", "Mandro Fossil Park"],
    cuisine: "Fresh River Fish And Pitha",
    art: "Sohrai And Kumbh Tribal Paintings",
    heritage: "Historic Ganges port with Rajmahal forts",
    imageUrl: ""
  },
  {
    id: 52,
    name: "Kanai Natshala",
    state: "Jharkhand",
    stage: 7,
    description: "The Gupt Vrindavan where Chaitanya Mahaprabhu's mystical darshan launched his Sankirtan movement, dancing roughly 300 km to Mayapur, his resting tree still standing.",
    features: ["Gupt Vrindavan Raas Sthali", "Chaitanya's Resting Tree", "Sarhul And Karam Festivals"],
    cuisine: "Dhuska And Chilka Roti",
    art: "Dhokra And Kohbar Art",
    heritage: "Birthplace of Chaitanya's Sankirtan movement",
    imageUrl: ""
  },
  {
    id: 53,
    name: "Ramkeli",
    state: "West Bengal",
    stage: 7,
    description: "Malda pilgrimage site where ministers Rupa and Sanatana Goswami renounced palaces after meeting Chaitanya, whose 600-year-old Kadamba resting tree stands among eight sacred Gopi kundas.",
    features: ["Madan Mohan Temple", "Eight Sacred Gopi Kundas", "Ramkeli Mela"],
    cuisine: "",
    art: "",
    heritage: "Where the Goswami brothers joined Chaitanya",
    imageUrl: ""
  },
  {
    id: 54,
    name: "Kheturi Dham",
    state: "Rajshahi Division, Bangladesh",
    stage: 7,
    description: "Ancestral birthplace of saint Narottama Dasa Thakura, where a waterbody formed from thousands of devotees' tears at the first Gaur Purnima festival still remains.",
    features: ["Narottama Das Thakura Temple", "Tirobhav Mahotsava Festival", "Wetland Openbill Storks"],
    cuisine: "",
    art: "Garanhati Kirtan Tradition",
    heritage: "Birthplace of saint Narottama Dasa Thakura",
    imageUrl: ""
  },
  {
    id: 55,
    name: "Dudha Ghat",
    state: "West Bengal",
    stage: 8,
    description: "The ghat where saint Narottama Das Thakur's body melted into milky liquid and flowed into the Ganga, his samadhi nearby at Gambhila near Jiaganj.",
    features: ["Narottama's Disappearance Ghat", "Gambhila Samadhi Shrine", "Terracotta Temples"],
    cuisine: "",
    art: "Baluchari Silk Saree Weaving",
    heritage: "Narottama Thakur's mystical disappearance site",
    imageUrl: ""
  },
  {
    id: 56,
    name: "Ranibhabani Ghat",
    state: "West Bengal",
    stage: 8,
    description: "At Baranagar in Murshidabad, Rani Bhabani set out to recreate Varanasi with 108 temples, their terracotta panels depicting Ramayana and Mahabharata episodes.",
    features: ["Char Bangla Temple Complex", "Bhavaniswar Temple Lotus Dome", "River Boat Rides"],
    cuisine: "",
    art: "Terracotta And Stucco Temple Art",
    heritage: "Rani Bhabani's eighteenth-century temple city",
    imageUrl: "./images/murshidabad_palace_1781868377694.png"
  },
  {
    id: 57,
    name: "Agradwip",
    state: "West Bengal",
    stage: 8,
    description: "A Bhagirathi-bank village where, for over 450 years, Lord Gopinath himself is said to perform the annual last rites of his devotee Gobindo Ghosh.",
    features: ["Agradwip Gopinath Temple", "Punya Tithi Festival", "Svayambhu Gopinath Murtis"],
    cuisine: "",
    art: "Gobindo Ghosh Kirtan Style",
    heritage: "Site of Gopinath's eternal last rites",
    imageUrl: ""
  },
  {
    id: 58,
    name: "Nabadwip",
    state: "West Bengal",
    stage: 8,
    description: "Nine islands personifying nine forms of bhakti, birthplace of Chaitanya Mahaprabhu and 12th-century Sena capital, circled yearly by thousands on the Mandal Parikrama.",
    features: ["Navadwip Mandal Parikrama", "Gour Purnima Festival", "Nine Islands Of Bhakti"],
    cuisine: "",
    art: "Dokra Casting And Clay Dolls",
    heritage: "Cradle of the Sankirtan movement",
    imageUrl: ""
  },
  {
    id: 59,
    name: "Mayapur",
    state: "West Bengal",
    stage: 8,
    description: "At the Ganga-Jalangi confluence, the 600-year-old Neem tree beneath which Chaitanya Mahaprabhu was born still stands beside ISKCON's rising Temple of the Vedic Planetarium.",
    features: ["600-Year-Old Neem Tree", "Temple Of The Vedic Planetarium", "Gaura Purnima Festival"],
    cuisine: "Vegetarian ISKCON Prasadam",
    art: "",
    heritage: "Birthplace of Chaitanya Mahaprabhu",
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
