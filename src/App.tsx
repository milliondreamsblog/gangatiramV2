/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';
import {
  Waves,
  MapPin,
  Sparkles,
  Palette,
  Music,
  Leaf,
  Heart,
  ChevronRight,
  ChevronDown,
  Search,
  Globe,
  HandHelping,
  Info,
  BookOpen,
  ShoppingBag,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Scissors,
  Menu,
  X
} from 'lucide-react';
import { gangaPlaces, contribFACE, GangaPlace } from './data';
import AdminPanel from './AdminPanel';

const paymentQr = '/book/payment-qr.jpeg';

const BOOK_VIEWS = { front: 28, spine: 90, back: 152 } as const;
type BookView = keyof typeof BOOK_VIEWS;

function Book3D({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<BookView>('front');
  const [autoTour, setAutoTour] = useState(!compact);

  useEffect(() => {
    if (!autoTour || reduceMotion) return;
    const order: BookView[] = ['front', 'spine', 'back'];
    const timer = setInterval(() => {
      setView((current) => order[(order.indexOf(current) + 1) % order.length]);
    }, 3500);
    return () => clearInterval(timer);
  }, [autoTour, reduceMotion]);

  return (
    <div>
      <div className={compact ? 'book3d-stage compact' : 'book3d-stage'}>
        <div className="book3d" style={{ transform: `rotateY(${BOOK_VIEWS[view]}deg)` }}>
          <img className="book3d-front" src="/book/ganga-tiram-front.jpg" alt="Ganga Tiram book — front cover" />
          <img className="book3d-back" src="/book/ganga-tiram-back.jpg" alt="Ganga Tiram book — back cover" />
          <img className="book3d-spine" src="/book/ganga-tiram-spine.jpg" alt="" aria-hidden="true" />
          <div className="book3d-pages" aria-hidden="true"></div>
        </div>
      </div>
      {!compact && (
        <div className="book3d-views">
          {(Object.keys(BOOK_VIEWS) as BookView[]).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              className={view === v ? 'active' : ''}
              onClick={() => { setAutoTour(false); setView(v); }}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const bookSpreads = [
  {
    image: '/book/spreads/spread-01-gomukh.jpg',
    caption: 'Gomukh — where she is born',
    pages: 'Pages 10–11'
  },
  {
    image: '/book/spreads/spread-02-haridwar.jpg',
    caption: 'Haridwar — evening aarti at Har Ki Pauri',
    pages: 'Pages 60–61'
  },
  {
    image: '/book/spreads/spread-03-prayagraj.jpg',
    caption: 'Prayagraj — the world’s largest human gathering',
    pages: 'Pages 104–105'
  },
  {
    image: '/book/spreads/spread-04-varanasi.jpg',
    caption: 'Varanasi — the city of liberation',
    pages: 'Pages 114–115'
  },
  {
    image: '/book/spreads/spread-05-sonepur.jpg',
    caption: 'Sonepur Mela — the great riverside animal fair',
    pages: 'Pages 130–131'
  },
  {
    image: '/book/spreads/spread-06-gangasagar.jpg',
    caption: 'Gangasagar — where she meets the sea',
    pages: 'Pages 208–209'
  }
];

type OrderForm = {
  name: string;
  address: string;
  pincode: string;
  country: string;
  state: string;
  paymentScreenshot: File | null;
};

type ContributeForm = {
  name: string;
  email: string;
  amount: string;
  paymentMethod: string;
  message: string;
};

type VolunteerForm = {
  name: string;
  email: string;
  place: string;
  interest: string;
  availability: string;
  message: string;
};

const tickerPlaces = gangaPlaces.filter((p) => p.imageUrl);

const heritageImages = [
  "./images/ganga_art_new.png",
  "./images/ganga_music_new.png",
  "./images/ganga_environment_new.png"
];

const threeGifts = [
  {
    label: 'Soul',
    headline: 'She carries the soul home.',
    body: 'A single dip at Har Ki Pauri is said to wash lifetimes. At Kashi, to die beside her is liberation itself.',
    image: './images/haridwar_aarti_1781868296149.png',
    places: ['Haridwar', 'Varanasi']
  },
  {
    label: 'Body',
    headline: 'She feeds four in ten Indians.',
    body: 'Her silt raises the grain of the plains; her current turns looms, nets, and wheels from the hills to the sea.',
    image: './images/patna_river_1781868354310.png',
    places: ['Patna', 'Bhagalpur']
  },
  {
    label: 'Mind',
    headline: 'On her banks, India learned to think.',
    body: 'Three thousand years of scholars, ragas, and verse rose beside her — from Rishikesh’s retreats to Nabadwip’s logicians.',
    image: './images/rishikesh_river_1781868284118.png',
    places: ['Rishikesh', 'Nabadwip']
  }
];

const journeyStages = [
  { stage: 1, name: 'Birth', line: 'She wakes in the glacier already knowing she will end — and begins anyway.', anchor: 'Gomukh', km: 'km 0', color: '#8FBFBF' },
  { stage: 2, name: 'Naming', line: 'Where two waters meet she is given a name and becomes herself: Ganga.', anchor: 'Devprayag', km: 'km 230', color: '#5FA3AD' },
  { stage: 3, name: 'Testing', line: 'The first hands worship her and use her in the very same gesture.', anchor: 'Haridwar', km: 'km 320', color: '#3A7CA5' },
  { stage: 4, name: 'Gathering', line: 'The largest crowd on earth comes to her; she meets it as one face.', anchor: 'Prayagraj', km: 'km 1,230', color: '#2F668A' },
  { stage: 5, name: 'Reckoning', line: 'At her still centre, dying is the point — and she holds it without breaking.', anchor: 'Kashi', km: 'km 1,384', color: '#35586E' },
  { stage: 6, name: 'Working Life', line: 'She rises the next morning and simply works, carrying a country that never thanks her.', anchor: 'Patna–Bhagalpur', km: 'km 1,700', color: '#6B5A44' },
  { stage: 7, name: 'Wound', line: 'Here we put her in chains; the river that was a river begins to thin.', anchor: 'Farakka', km: 'km 2,200', color: '#4A3B30' },
  { stage: 8, name: 'Return', line: 'She widens past being a river at all — given back to the sea and sky.', anchor: 'Gangasagar', km: 'km 2,525', color: '#C97B4A' }
];

/**
 * The River Line — a single thread drawn down the page as you scroll,
 * glacial teal at the source, river blue midstream, delta amber at the sea.
 * Decorative only: aria-hidden, no pointer events, static when the visitor
 * prefers reduced motion.
 */
function RiverLine() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], [0.02, 1]);
  const mainLength = useSpring(progress, { stiffness: 80, damping: 25 });
  const forkLength = useSpring(useTransform(scrollYProgress, [0.82, 1], [0, 1]), { stiffness: 80, damping: 25 });

  return (
    <div aria-hidden="true" className="absolute inset-y-0 left-0 w-10 md:w-24 z-20 pointer-events-none opacity-25 md:opacity-40">
      <svg className="h-full w-full" viewBox="0 0 100 1000" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="river-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8FBFBF" />
            <stop offset="0.3" stopColor="#3A7CA5" />
            <stop offset="0.6" stopColor="#2F668A" />
            <stop offset="0.78" stopColor="#35586E" />
            <stop offset="0.9" stopColor="#8A5A3B" />
            <stop offset="1" stopColor="#C97B4A" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 50 0 C 30 40, 70 90, 50 140 C 30 190, 72 240, 50 290 C 28 340, 70 390, 48 440 C 30 490, 68 540, 50 590 C 32 640, 70 690, 50 740 C 30 790, 66 840, 50 890 C 44 930, 52 960, 50 1000"
          stroke="url(#river-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: reduceMotion ? 1 : mainLength }}
        />
        <motion.path
          d="M 50 890 C 40 930, 28 960, 22 1000"
          stroke="#C97B4A"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ pathLength: reduceMotion ? 1 : forkLength }}
        />
        <motion.path
          d="M 50 890 C 60 930, 74 960, 80 1000"
          stroke="#C97B4A"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ pathLength: reduceMotion ? 1 : forkLength }}
        />
      </svg>
    </div>
  );
}

function HeritageImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heritageImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#2D241E]">
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={heritageImages[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Heritage & Culture"
        />
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#admin');
  useEffect(() => {
    const onHashChange = () => setIsAdminRoute(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const [activeTab, setActiveTab] = useState('journey');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [pastWound, setPastWound] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const wound = document.getElementById('wound');
      if (!wound) return;
      setPastWound(wound.getBoundingClientRect().bottom < window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the nav item for the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    ['journey', 'heritage', 'action'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'Ganga Tiram — 2,525 Kilometers of Heritage',
      text: '75 sacred places along the Ganga, one river’s life story — help keep her alive.',
      url
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* visitor dismissed the share sheet */ }
    } else {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };
  const [selectedPlace, setSelectedPlace] = useState<GangaPlace | null>(null);
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '',
    address: '',
    pincode: '',
    country: 'India',
    state: '',
    paymentScreenshot: null
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [volunteerFormSubmitted, setVolunteerFormSubmitted] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [contributeFormSubmitted, setContributeFormSubmitted] = useState(false);
  const [contributeFormState, setContributeFormState] = useState<ContributeForm>({
    name: '',
    email: '',
    amount: 'INR 1000',
    paymentMethod: 'UPI',
    message: ''
  });

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [volunteerError, setVolunteerError] = useState('');
  const [contributeSubmitting, setContributeSubmitting] = useState(false);
  const [contributeError, setContributeError] = useState('');

  const updateContributeField = (field: keyof ContributeForm, value: string) => {
    setContributeFormState((current) => ({ ...current, [field]: value }));
  };

  const handleContributeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContributeSubmitting(true);
    setContributeError('');
    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contributeFormState)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setContributeFormSubmitted(true);
    } catch (err) {
      setContributeError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setContributeSubmitting(false);
    }
  };

  const [volunteerFormState, setVolunteerFormState] = useState<VolunteerForm>({
    name: '',
    email: '',
    place: '',
    interest: 'Cleanup Drives',
    availability: 'Weekends',
    message: ''
  });

  const updateVolunteerField = (field: keyof VolunteerForm, value: string) => {
    setVolunteerFormState((current) => ({ ...current, [field]: value }));
  };

  const handleVolunteerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVolunteerSubmitting(true);
    setVolunteerError('');
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerFormState)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setVolunteerFormSubmitted(true);
    } catch (err) {
      setVolunteerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setVolunteerSubmitting(false);
    }
  };

  const filteredPlaces = gangaPlaces.filter(place => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      place.name.toLowerCase().includes(query) ||
      place.state.toLowerCase().includes(query);
    const matchesStage = selectedStage === null || place.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const prominentPlaces = [...filteredPlaces]
    .sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)))
    .slice(0, 6);

  const goToCheckout = () => {
    setShowCheckout(true);
    setOrderSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const updateOrderField = (field: keyof OrderForm, value: string | File | null) => {
    setOrderForm((current) => ({ ...current, [field]: value }));
  };

  const handleOrderSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orderForm.paymentScreenshot) return;
    setOrderSubmitting(true);
    setOrderError('');
    try {
      const formData = new FormData();
      formData.append('name', orderForm.name);
      formData.append('address', orderForm.address);
      formData.append('pincode', orderForm.pincode);
      formData.append('country', orderForm.country);
      formData.append('state', orderForm.state);
      formData.append('screenshot', orderForm.paymentScreenshot);
      const res = await fetch('/api/order', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setOrderId(data.orderId ?? null);
      setOrderSubmitted(true);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleFaceAction = (action: string) => {
    if (action === 'festivals') {
      setSelectedStage(4);
      document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'art') {
      const place = gangaPlaces.find((p) => p.name === 'Patna');
      if (place) setSelectedPlace(place);
    } else if (action === 'craft') {
      const place = gangaPlaces.find((p) => p.name === 'Varanasi');
      if (place) setSelectedPlace(place);
    } else {
      document.getElementById('action')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdminRoute) {
    return <AdminPanel />;
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#2D241E] font-sans selection:bg-[#3A7CA5] selection:text-white">
        <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-[#E8DCC4] px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setShowCheckout(false)}
              className="flex items-center gap-2 text-[#2D241E] hover:text-[#3A7CA5] transition-colors font-bold"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <div className="flex items-center gap-2">
              <Waves className="text-[#3A7CA5] w-7 h-7" />
              <span className="text-xl font-serif font-bold">Ganga Tiram</span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <section className="checkout-book-panel">
              <div className="flex justify-center mb-10">
                <Book3D compact />
              </div>
              <div>
                <p className="text-[#3A7CA5] text-xs font-black uppercase tracking-[0.25em] mb-3">Book Order</p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5">Ganga Tiram</h1>
                <div className="bg-white border border-[#E8DCC4] rounded-2xl p-5 mb-6 space-y-2 text-sm text-[#5A4B3F]">
                  <div className="flex justify-between"><span>Book</span><span className="font-bold text-[#2D241E]">₹999</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-[#2D241E]">₹145</span></div>
                  <div className="flex justify-between border-t border-[#E8DCC4] pt-2 text-base"><span className="font-bold text-[#2D241E]">Total to pay</span><span className="font-black text-[#3A7CA5]">₹1,144</span></div>
                </div>
                <p className="text-[#5A4B3F] leading-relaxed">
                  Scan the payment QR, complete payment, then upload the payment screenshot with your delivery details.
                </p>
              </div>
            </section>

            <section className="bg-white border border-[#E8DCC4] rounded-3xl p-6 md:p-10 shadow-xl">
              {orderSubmitted ? (
                <div className="min-h-[520px] flex flex-col justify-center items-center text-center">
                  <CheckCircle2 className="text-[#3A7CA5] mb-6" size={72} />
                  <h2 className="text-4xl font-serif font-bold mb-4">Order{orderId ? ` #${orderId}` : ''} Received</h2>
                  <p className="text-[#5A4B3F] max-w-xl mb-8">
                    Your payment screenshot and delivery details are saved. We will verify the payment and send your tracking details within 24 hours.
                  </p>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2F668A] transition-colors"
                  >
                    Return Home
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 mb-10">
                    <div className="bg-[#F4EDDE] rounded-2xl p-5 border border-[#E8DCC4]">
                      <img src={paymentQr} alt="Payment QR code" className="w-full rounded-xl bg-white p-3" />
                      <p className="text-center text-xs font-bold uppercase tracking-widest text-[#5A4B3F] mt-4">Scan to Pay</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#D4A373] text-xs font-black uppercase tracking-[0.25em] mb-3">Step 1</p>
                      <h2 className="text-3xl font-serif font-bold mb-4">Pay ₹1,144 for the book</h2>
                      <p className="text-[#5A4B3F] leading-relaxed">
                        Use any UPI app to scan the QR and pay <strong className="text-[#2D241E]">₹1,144</strong> (₹999 book + ₹145 shipping). Then take a screenshot and upload it below with your shipping address.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleOrderSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <label className="order-field md:col-span-2">
                        <span>Name</span>
                        <input required value={orderForm.name} onChange={(e) => updateOrderField('name', e.target.value)} placeholder="Full name" />
                      </label>
                      <label className="order-field md:col-span-2">
                        <span>Address</span>
                        <textarea required value={orderForm.address} onChange={(e) => updateOrderField('address', e.target.value)} placeholder="House number, street, city" rows={4} />
                      </label>
                      <label className="order-field">
                        <span>Pincode</span>
                        <input required value={orderForm.pincode} onChange={(e) => updateOrderField('pincode', e.target.value)} placeholder="Postal code" inputMode="numeric" />
                      </label>
                      <label className="order-field">
                        <span>Country</span>
                        <input required value={orderForm.country} onChange={(e) => updateOrderField('country', e.target.value)} placeholder="Country" />
                      </label>
                      <label className="order-field">
                        <span>State</span>
                        <input required value={orderForm.state} onChange={(e) => updateOrderField('state', e.target.value)} placeholder="State" />
                      </label>
                      <label className="order-field">
                        <span>Payment Screenshot</span>
                        <div className="upload-control">
                          <Upload size={18} />
                          <span>{orderForm.paymentScreenshot?.name || 'Upload image'}</span>
                          <input
                            required
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => updateOrderField('paymentScreenshot', e.target.files?.[0] || null)}
                          />
                        </div>
                      </label>
                    </div>

                    {orderError && <p className="text-red-700 text-sm font-bold text-center">{orderError}</p>}
                    <button type="submit" disabled={orderSubmitting} className="w-full bg-[#2D241E] text-white py-4 rounded-full font-bold hover:bg-[#3A7CA5] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:bg-[#2D241E]">
                      {orderSubmitting ? 'Submitting…' : 'Submit Book Order'} <ChevronRight size={20} />
                    </button>
                  </form>
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (showAllPlaces) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#2D241E] font-sans selection:bg-[#3A7CA5] selection:text-white">
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#E8DCC4] px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAllPlaces(false)}>
              <Waves className="text-[#3A7CA5] w-8 h-8" />
              <span className="text-2xl font-serif font-bold tracking-tight text-[#2D241E]">Ganga Tiram</span>
            </div>
            <button 
              onClick={() => setShowAllPlaces(false)}
              className="text-[#3A7CA5] font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
            >
              <ChevronRight className="rotate-180" size={20} /> Back to Home
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b border-[#E8DCC4] pb-8"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-4">The Complete Sacred Path</h1>
            <p className="text-[#5A4B3F] text-lg max-w-3xl">Explore every major landmark, heritage site, and spiritual hub along the 2,525 km journey of the holy river.</p>
            {selectedStage !== null && (
              <button
                onClick={() => setSelectedStage(null)}
                className="mt-5 inline-flex items-center gap-2 bg-[#3A7CA5]/10 border border-[#3A7CA5]/30 text-[#3A7CA5] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-[#3A7CA5] hover:text-white transition-colors"
              >
                Chapter: {journeyStages[selectedStage - 1].name} ({filteredPlaces.length} places) <X size={14} /> Show all 75
              </button>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredPlaces.map((place) => (
              <motion.div 
                key={place.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedPlace(place)}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-[#E8DCC4]/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-[#3A7CA5]/40 hover:shadow-[0_20px_50px_rgba(58,124,165,0.12)] transition-all duration-300 group cursor-pointer w-full max-w-[320px] flex flex-col"
              >
                {place.imageUrl && (
                  <div className="w-full h-40 mb-5 rounded-2xl overflow-hidden shrink-0">
                    <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[#3A7CA5] text-[10px] font-black uppercase tracking-widest bg-[#3A7CA5]/10 px-3 py-1 rounded-full">{place.state}</span>
                  <MapPin className="text-[#A8988A] group-hover:text-[#3A7CA5] transition-colors" size={20} />
                </div>
                <h4 className="text-2xl font-serif font-bold text-[#2D241E] mb-3 group-hover:text-[#3A7CA5] transition-colors">{place.name}</h4>
                <p className="text-[#5A4B3F] text-sm leading-relaxed mb-6 line-clamp-3">{place.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {place.features.slice(0, 2).map((f, i) => (
                    <span key={i} className="text-[9px] font-bold text-[#A8988A] border border-[#E8DCC4] px-2 py-1 rounded-md uppercase tracking-wider">{f}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reuse the Place Detail Modal */}
        <AnimatePresence>
          {selectedPlace && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedPlace(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full h-[100dvh] rounded-none md:h-auto md:max-h-[90vh] md:rounded-3xl max-w-3xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64 bg-[#3A7CA5] overflow-hidden rounded-t-none md:rounded-t-3xl">
                  {selectedPlace.imageUrl && (
                    <img src={selectedPlace.imageUrl} alt={selectedPlace.name} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E] via-[#2D241E]/40 to-transparent"></div>
                  <button 
                    onClick={() => setSelectedPlace(null)}
                    className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md"
                  >
                    <ChevronDown />
                  </button>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <span className="bg-[#D4A373] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-4 inline-block">{selectedPlace.state}</span>
                    <h2 className="text-4xl font-serif font-bold">{selectedPlace.name}</h2>
                  </div>
                </div>
                
                <div className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={14} /> Description
                      </h3>
                      <p className="text-[#5A4B3F] leading-relaxed mb-8">{selectedPlace.description}</p>
                      
                      <h3 className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Highlights
                      </h3>
                      <ul className="grid grid-cols-2 gap-4">
                        {selectedPlace.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-[#5A4B3F]">
                            <div className="w-1.5 h-1.5 bg-[#D4A373] rounded-full"></div>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-8">
                      {selectedPlace.heritage && (
                        <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                          <h4 className="font-bold flex items-center gap-2 mb-3">
                            <Waves className="text-[#3A7CA5]" size={18} /> Heritage
                          </h4>
                          <p className="text-sm text-[#5A4B3F]">{selectedPlace.heritage}</p>
                        </div>
                      )}
                      {selectedPlace.art && (
                        <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                          <h4 className="font-bold flex items-center gap-2 mb-3">
                            <Palette className="text-[#3A7CA5]" size={18} /> Art & Craft
                          </h4>
                          <p className="text-sm text-[#5A4B3F]">{selectedPlace.art}</p>
                        </div>
                      )}
                      {selectedPlace.cuisine && (
                        <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                          <h4 className="font-bold flex items-center gap-2 mb-3">
                            <Music className="text-[#3A7CA5]" size={18} /> Cuisine
                          </h4>
                          <p className="text-sm text-[#5A4B3F]">{selectedPlace.cuisine}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F5FAF9] via-[#FDFCF8] to-[#FBF2E7] text-[#2D241E] font-sans pb-24 md:pb-0">
      <RiverLine />
      {/* Navigation — transparent over the hero, floating dark pill once scrolled */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto flex items-center transition-all duration-500 ease-out ${
            scrolled
              ? 'mt-3 gap-1 md:gap-2 bg-[#2D241E]/90 backdrop-blur-xl rounded-full py-2 pl-4 pr-2 shadow-2xl border border-white/10'
              : 'w-full max-w-7xl justify-between px-6 py-5 mx-auto'
          }`}
        >
          <button
            className="flex items-center gap-2 shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <Waves className={scrolled ? 'text-[#8FBFBF] w-6 h-6' : 'text-white w-8 h-8 drop-shadow'} />
            <span className={`font-serif font-bold tracking-tight text-white transition-all ${scrolled ? 'text-lg hidden sm:inline' : 'text-2xl drop-shadow'}`}>
              Ganga Tiram
            </span>
          </button>

          <div className={`hidden md:flex items-center ${scrolled ? 'gap-1 mx-2' : 'gap-2 lg:gap-4'}`}>
            {[
              { id: 'journey', label: 'Journey' },
              { id: 'heritage', label: 'Heritage' },
              { id: 'action', label: 'Contribute' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeTab === item.id ? 'text-white' : scrolled ? 'text-white/60 hover:text-white' : 'text-white/75 hover:text-white'
                }`}
              >
                {activeTab === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className={`absolute inset-0 rounded-full ${scrolled ? 'bg-white/15' : 'bg-white/20 backdrop-blur-sm'}`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToCheckout}
              className={`bg-[#D4A373] text-white rounded-full font-bold hover:bg-[#B1895D] transition-all shadow-lg flex items-center gap-2 min-h-[44px] ${
                scrolled ? 'px-4 py-2 text-xs' : 'px-5 md:px-6 py-2.5 text-sm'
              }`}
            >
              <ShoppingBag size={16} /> <span>{scrolled ? '₹999' : 'Buy Book'}</span>
            </button>
            <button
              className={`md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-white`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={scrolled ? 22 : 28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-[#FDFCF8] flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-6 right-6 p-2 text-[#2D241E] min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col gap-10 text-3xl font-serif font-bold text-[#2D241E] items-center">
              <button onClick={() => {
                setIsMobileMenuOpen(false);
                document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
                setActiveTab('journey');
              }} className="hover:text-[#3A7CA5] transition-colors">The Journey</button>
              <button onClick={() => {
                setIsMobileMenuOpen(false);
                document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' });
                setActiveTab('heritage');
              }} className="hover:text-[#3A7CA5] transition-colors">Heritage</button>
              <button onClick={() => {
                setIsMobileMenuOpen(false);
                document.getElementById('action')?.scrollIntoView({ behavior: 'smooth' });
                setActiveTab('action');
              }} className="hover:text-[#3A7CA5] transition-colors">Contribute</button>
            </div>
            
            <button onClick={() => {
              setIsMobileMenuOpen(false);
              goToCheckout();
            }} className="absolute bottom-12 bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-3">
              <ShoppingBag size={20} /> Buy the Book
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pb-10">
        <div className="absolute inset-0 z-0 bg-[#EAEAEA]">
          <img
            src="./images/hero_background_new.png"
            alt="Ganga River at Varanasi"
            className="w-full h-full object-cover brightness-[0.6] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-[#FDFCF8]"></div>
        </div>

        <div className="relative z-10 text-center px-4 w-full pt-32 md:pt-36">
          <motion.button
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onClick={goToCheckout}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white/90 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-8 transition-colors"
          >
            <BookOpen size={14} className="text-[#D4A373]" /> The printed book is out — ₹999 <ChevronRight size={13} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              2,525 Kilometers<br/><span className="text-[#D4A373] italic font-medium">of Heritage</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          >
            Experience the exact route of the Ganga through 75 documented sacred locations, interactive digital archives, and direct artisan support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5 px-2"
          >
            <button onClick={goToCheckout} className="bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B1895D] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(212,163,115,0.35)] w-full sm:w-auto min-h-[56px]">
              <ShoppingBag size={20} /> Buy the Book — ₹999
            </button>
            <button
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 hover:scale-105 transition-all flex items-center justify-center gap-2 w-full sm:w-auto min-h-[56px]"
            >
              Start the Journey <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>

        {/* Place-photo ticker — the river scrolls past */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="relative z-10 mt-14 md:mt-16"
        >
          <div className="hero-ticker">
            <div className="hero-ticker-track">
              {[...tickerPlaces, ...tickerPlaces].map((place, i) => (
                <div key={`${place.id}-${i}`} className="hero-ticker-card">
                  <img src={place.imageUrl} alt={place.name} loading="lazy" />
                  <span>{place.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Her Three Gifts — Soul · Body · Mind */}
      <section id="gifts" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <h2 className="text-[#3A7CA5] font-black text-sm uppercase tracking-[0.3em] mb-4">Her Three Gifts</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-4">One river. Soul, body, and mind.</h3>
          <p className="text-[#5A4B3F] max-w-2xl mx-auto">
            History and nourishment in three currents — what she has given every civilization that rose on her banks.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar lg:grid lg:grid-cols-3 gap-6 lg:gap-8 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {threeGifts.map((gift, index) => (
            <motion.div
              key={gift.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative h-[440px] lg:h-[500px] min-w-[85vw] sm:min-w-[420px] lg:min-w-0 snap-center shrink-0 rounded-[2rem] overflow-hidden border border-[#E8DCC4] shadow-sm hover:shadow-2xl transition-all"
            >
              <img
                src={gift.image}
                alt={`${gift.label} — ${gift.headline}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full">{gift.label}</span>
              </div>
              <div className="absolute bottom-0 p-8 text-white">
                <h4 className="text-3xl font-serif font-bold mb-3 leading-snug">{gift.headline}</h4>
                <p className="text-white/85 text-sm leading-relaxed mb-5">{gift.body}</p>
                <div className="flex flex-wrap gap-2">
                  {gift.places.map((placeName) => {
                    const place = gangaPlaces.find((p) => p.name === placeName);
                    return (
                      <button
                        key={placeName}
                        onClick={() => place && setSelectedPlace(place)}
                        className="text-[11px] font-bold uppercase tracking-wider bg-white/15 hover:bg-[#D4A373] border border-white/25 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                      >
                        {placeName} <ChevronRight size={12} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="book" className="book-section">
        <div className="max-w-7xl mx-auto px-6">
          {/* Beat 1 + 5: the object and the ask */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="book-stage"
            >
              <Book3D />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#D4A373] font-black text-sm uppercase tracking-[0.3em] mb-5">The Book</p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#2D241E] mb-6">Hold all 2,525 kilometers in your hands</h2>
              <p className="text-[#5A4B3F] text-lg leading-relaxed mb-8 max-w-2xl">
                Seventy-five panoramic locations from Gomukh to Gangasagar — her glaciers, aartis, festivals, looms, and people — photographed and told place by place.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <span className="book-chip"><BookOpen size={16} /> 300 pages · 240 photographs</span>
                <span className="book-chip"><Waves size={16} /> 75 places, in river order</span>
                <span className="book-chip"><ShoppingBag size={16} /> Direct UPI payment</span>
              </div>
              <div className="flex flex-col gap-3 w-fit">
                <button
                  onClick={goToCheckout}
                  className="bg-[#D4A373] text-white px-10 py-4 rounded-full font-bold hover:bg-[#B1895D] transition-all shadow-xl flex items-center gap-3 w-fit"
                >
                  Get the Book — ₹999 <ChevronRight size={20} />
                </button>
                <p className="text-[#A8988A] text-xs font-bold uppercase tracking-widest">+ ₹145 shipping · Direct UPI · tracking in 24 hours</p>
              </div>
            </motion.div>
          </div>

          {/* Beat 2: look inside */}
          <div className="mt-20 md:mt-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-[#3A7CA5] font-black text-xs uppercase tracking-[0.25em] mb-3">Look inside</p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2D241E]">Six spreads from the journey</h3>
              </div>
              <p className="text-[#5A4B3F] text-sm max-w-sm md:text-right">Real pages from the printed edition — swipe through the river’s course.</p>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
              {bookSpreads.map((spread) => (
                <figure key={spread.image} className="snap-center shrink-0 w-[88vw] md:w-[720px]">
                  <div className="rounded-2xl overflow-hidden border border-[#E8DCC4] bg-white shadow-lg">
                    <img
                      src={spread.image}
                      alt={spread.caption}
                      loading="lazy"
                      className="w-full aspect-[2/1] object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-4 px-1">
                    <span className="text-[#2D241E] font-serif font-bold text-lg">{spread.caption}</span>
                    <span className="text-[#A8988A] text-[10px] font-black uppercase tracking-widest shrink-0">{spread.pages}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Beat 3: one voice from the book */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 md:mt-24 max-w-3xl mx-auto text-center"
          >
            <p className="text-[#D4A373] font-black text-[10px] uppercase tracking-[0.3em] mb-6">From the opening page</p>
            <p className="font-serif italic text-xl md:text-2xl text-[#5A4B3F] leading-relaxed mb-6">
              “I am very much satisfied with your austerities and am now prepared to give you benedictions as you desire.”
            </p>
            <footer className="text-[#A8988A] text-sm">
              <p className="font-bold">Mother Ganga to King Bhagīratha — Śrīmad Bhāgavatam 9.9.3</p>
              <p className="mt-2">A pilgrimage inspired by Radhanath Swami’s <em>The Journey Home</em></p>
            </footer>
          </motion.blockquote>

          {/* Beat 4: what it holds, what it funds */}
          <div className="book-contents-strip mt-20 md:mt-24">
            <div>
              <span>Every copy carries the mission</span>
              <strong>75 places · 2,525 km · 240 photographs · 300 pages — and every order helps fund ghat cleanups and keeps weaver looms running.</strong>
            </div>
            <button onClick={goToCheckout}>
              Get the Book — ₹999 <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        
        {/* FACE Framework Introduction */}
        <div className="mb-20 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-[#3A7CA5] font-black text-sm uppercase tracking-[0.3em] mb-4">The Mission</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-6">The FACE of Ganga</h3>
            <p className="text-[#5A4B3F] max-w-2xl mx-auto text-lg">
              FACE is how we serve her — <strong>F</strong>estivals, <strong>A</strong>rt, <strong>C</strong>raft, <strong>E</strong>nvironment. Four promises, kept every month.
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {contribFACE.map((item) => (
              <motion.div
                key={item.letter}
                whileHover={{ y: -10 }}
                className="group relative bg-white h-[420px] md:h-[470px] min-w-[85vw] md:min-w-0 snap-center shrink-0 rounded-[2rem] overflow-hidden border border-[#E8DCC4] shadow-sm hover:shadow-2xl transition-all"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent group-hover:via-black/60 transition-colors"></div>

                <div className="absolute -right-4 -top-4 text-[12rem] font-black text-white/10 select-none">
                  {item.letter}
                </div>

                <div className="absolute bottom-0 p-8 text-white w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 backdrop-blur-md w-11 h-11 rounded-xl flex items-center justify-center border border-white/30 shrink-0">
                      {item.icon === 'Sparkles' && <Sparkles size={20} className="text-[#D4A373]" />}
                      {item.icon === 'Palette' && <Palette size={20} className="text-[#D4A373]" />}
                      {item.icon === 'Scissors' && <Scissors size={20} className="text-[#D4A373]" />}
                      {item.icon === 'Leaf' && <Leaf size={20} className="text-[#D4A373]" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{item.letter} — {item.title}</span>
                  </div>
                  <h4 className="text-2xl font-serif font-bold mb-3 leading-snug">{item.headline}</h4>
                  <p className="text-white/75 text-sm leading-relaxed mb-5">{item.stat}</p>
                  <button
                    onClick={() => handleFaceAction(item.action)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white bg-white/15 hover:bg-[#3A7CA5] border border-white/25 px-4 py-2 rounded-full transition-colors"
                  >
                    {item.cta} <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <div id="journey" className="mb-20 md:mb-32 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-[#D4A373] font-black text-sm uppercase tracking-[0.3em] mb-4">The Sacred Trail</h2>
              <h3 className="text-4xl font-serif font-bold text-[#2D241E]">The Heritage Path</h3>
              <p className="text-[#5A4B3F] mt-2">Exploring the major landmarks from the glaciers to the delta.</p>
            </div>
            <div className="relative w-full md:w-80 border-b border-[#E8DCC4] pb-2">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#A8988A]" size={18} />
              <input
                type="text"
                placeholder="Search sacred places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent focus:outline-none text-[#2D241E]"
              />
            </div>
          </div>

          {/* Eight stations of the river's life */}
          <div className="mb-12">
            <p className="text-[#3A7CA5] font-black text-xs uppercase tracking-[0.25em] mb-6">Eight chapters of her life — tap one to follow it</p>
            <div className="relative">
              <div className="absolute left-0 right-0 top-[8px] h-0.5 bg-gradient-to-r from-[#8FBFBF] via-[#3A7CA5] to-[#C97B4A] opacity-40 rounded-full hidden lg:block" aria-hidden="true"></div>
              <div className="flex overflow-x-auto hide-scrollbar gap-8 lg:gap-2 lg:grid lg:grid-cols-8 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                {journeyStages.map((s) => {
                  const isActive = selectedStage === s.stage;
                  return (
                    <button
                      key={s.stage}
                      onClick={() => setSelectedStage(isActive ? null : s.stage)}
                      aria-pressed={isActive}
                      className="group/station flex flex-col items-center gap-2 shrink-0 min-w-[72px]"
                    >
                      <span
                        className={`w-[18px] h-[18px] rounded-full border-2 transition-all ${isActive ? 'scale-125' : 'bg-[#FDFCF8] group-hover/station:scale-110'}`}
                        style={isActive ? { backgroundColor: s.color, borderColor: s.color } : { borderColor: s.color }}
                      ></span>
                      <span className={`text-xs font-black uppercase tracking-wider transition-colors ${isActive ? 'text-[#2D241E]' : 'text-[#A8988A] group-hover/station:text-[#5A4B3F]'}`}>{s.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9BBA4]">{s.km}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedStage !== null && (() => {
                const s = journeyStages[selectedStage - 1];
                return (
                  <motion.div
                    key={s.stage}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="mt-8 bg-white/80 backdrop-blur-sm border border-[#E8DCC4] rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between"
                  >
                    <div>
                      <p className="font-serif italic text-lg md:text-xl text-[#2D241E] leading-snug">“{s.line}”</p>
                      <p className="text-[#A8988A] text-xs font-bold uppercase tracking-widest mt-2">
                        {s.name} · {s.anchor} · {s.km} — {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedStage(null)}
                      className="text-[#3A7CA5] text-xs font-black uppercase tracking-widest hover:underline shrink-0 self-start md:self-center"
                    >
                      Show all 75
                    </button>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center w-full pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              <AnimatePresence>
                {prominentPlaces.map((place) => (
                  <motion.div 
                    key={place.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    onClick={() => setSelectedPlace(place)}
                    className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-6 border border-[#E8DCC4]/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-[#3A7CA5]/40 hover:shadow-[0_20px_50px_rgba(58,124,165,0.12)] transition-all duration-300 group cursor-pointer w-full min-w-[85vw] md:min-w-0 md:max-w-[380px] snap-center shrink-0 flex flex-col overflow-hidden h-auto min-h-[480px] md:min-h-0 md:h-full"
                  >
                    {place.imageUrl && (
                      <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden shrink-0">
                        <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-[#F4F1EA] p-4 rounded-2xl group-hover:bg-[#3A7CA5] transition-colors">
                        <MapPin className="text-[#2D241E] group-hover:text-white" size={24} />
                      </div>
                      <span className="text-[#D4A373] text-xs font-bold uppercase tracking-widest">{place.state}</span>
                    </div>
                    <h4 className="text-3xl font-serif font-bold mb-4 group-hover:text-[#3A7CA5] transition-colors">{place.name}</h4>
                    <p className="text-[#5A4B3F] mb-10 leading-relaxed font-light flex-grow">{place.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {place.features.slice(0, 2).map((f, i) => (
                        <span key={i} className="text-[10px] px-3 py-1.5 bg-[#F4EDDE] rounded-full text-[#5A4B3F] font-bold uppercase tracking-wider">{f}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredPlaces.length > 6 && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setShowAllPlaces(true);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="mt-16 bg-[#2D241E] text-white px-12 py-5 rounded-full font-bold hover:bg-[#3A7CA5] hover:scale-105 transition-all shadow-xl flex items-center gap-3"
              >
                View More Places <ChevronRight size={20} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Heritage & Culture Highlight */}
        <div id="heritage" className="scroll-mt-24 bg-[#2D241E] rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-stretch shadow-2xl">
          <div className="lg:w-1/2 relative min-h-[300px] md:min-h-[400px]">
            <HeritageImageSlider />
          </div>
          <div className="lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center text-white bg-gradient-to-br from-[#2D241E] to-[#16110D]">
            <h2 className="text-[#D4A373] font-bold text-sm uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Sparkles size={16} /> Experience the Legacy
            </h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-8 md:mb-12 leading-tight drop-shadow-lg">A Civilization Born of the Holy Waters</h3>
            
            <div className="space-y-10">
              <div className="flex gap-8 items-start group">
                <div className="bg-[#3A7CA5]/10 p-5 rounded-2xl shrink-0 border border-[#3A7CA5]/20 group-hover:bg-[#3A7CA5]/20 group-hover:scale-110 transition-all duration-300">
                  <Palette className="text-[#3A7CA5]" size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-3 text-white/95">Art & Craftsmanship</h4>
                  <p className="text-gray-300 leading-relaxed text-lg">Sourcing authentic <span className="text-[#D4A373] font-semibold">Banarasi silk</span> directly from 50 weaver looms in ancient Kashi, and supporting traditional <span className="text-[#D4A373] font-semibold">Madhubani canvas painters</span> along Bihar's sacred riverbanks.</p>
                </div>
              </div>
              
              <div className="flex gap-8 items-start group">
                <div className="bg-[#D4A373]/10 p-5 rounded-2xl shrink-0 border border-[#D4A373]/20 group-hover:bg-[#D4A373]/20 group-hover:scale-110 transition-all duration-300">
                  <Music className="text-[#D4A373]" size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-3 text-white/95">Music & Philosophy</h4>
                  <p className="text-gray-300 leading-relaxed text-lg">Immerse in 500+ hours of high-fidelity recordings featuring <span className="text-[#D4A373] font-semibold">morning Ragas</span>, resonant temple bells, and transcendent <span className="text-[#D4A373] font-semibold">Sanskrit hymns</span> performed right at the water's edge.</p>
                </div>
              </div>
              
              <div className="flex gap-8 items-start group">
                <div className="bg-[#3A7CA5]/10 p-5 rounded-2xl shrink-0 border border-[#3A7CA5]/20 group-hover:bg-[#3A7CA5]/20 group-hover:scale-110 transition-all duration-300">
                  <Waves className="text-[#3A7CA5]" size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-3 text-white/95">Ecological Action</h4>
                  <p className="text-gray-300 leading-relaxed text-lg">Funding crucial clean-water patrols to monitor the 50km <span className="text-[#D4A373] font-semibold">Gangetic Dolphin Sanctuary</span> and aggressively eliminating harmful chemical waste from local farmlands.</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => { setShowAllPlaces(true); window.scrollTo({ top: 0, behavior: 'instant' }); }}
              className="mt-14 bg-[#3A7CA5] text-white px-10 py-5 rounded-full font-bold hover:bg-[#2F668A] hover:scale-105 transition-all w-fit flex items-center gap-3 shadow-[0_10px_20px_rgba(58,124,165,0.2)]"
            >
              Explore Cuisines & Art <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* The Wound — the dark interlude */}
        <motion.div
          id="wound"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          className="mt-20 md:mt-32 bg-[#2D241E] rounded-[2rem] md:rounded-[3rem] px-8 md:px-16 py-16 md:py-24 text-center shadow-2xl"
        >
          <h2 className="text-[#C97B4A] font-black text-xs uppercase tracking-[0.3em] mb-6">The Wound</h2>
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-white/95 max-w-3xl mx-auto mb-14 leading-tight">
            “Here we put her in chains; the river that was a river begins to thin.”
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-left md:text-center">
            <div>
              <p className="font-serif text-2xl text-[#C97B4A] font-bold mb-2">Her source retreats</p>
              <p className="text-white/60 text-sm leading-relaxed">The Gangotri glacier has been pulling back for a hundred years — the mouth she is born from keeps moving away.</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-[#C97B4A] font-bold mb-2">Her middle runs foul</p>
              <p className="text-white/60 text-sm leading-relaxed">At Kanpur, tannery waste stains the current that a whole plain drinks and farms from.</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-[#C97B4A] font-bold mb-2">Her end is chained</p>
              <p className="text-white/60 text-sm leading-relaxed">At Farakka the barrage thins her flow — and with it, the river dolphins that need her deep and moving.</p>
            </div>
          </div>
          <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.25em] mt-14">From her own chapters — Gomukh · Kanpur · Farakka</p>
        </motion.div>

        {/* Action / Contribution Section */}
        <div id="action" className="scroll-mt-24 mt-8 md:mt-12 text-center bg-[#F4EDDE] p-8 md:p-12 lg:p-24 rounded-[2rem] md:rounded-[3rem] border border-[#E8DCC4] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h2 className="text-[#3A7CA5] font-black text-sm uppercase tracking-[0.3em] mb-6">Take a Sankalp — a vow to her</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#2D241E] mb-8">Which part of her life will you keep alive?</h3>
          <p className="text-[#5A4B3F] max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            Volunteer on your stretch of the river, contribute to the monthly work, or share her story onward.
          </p>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16">
            <div>
              <p className="font-serif text-4xl font-bold text-[#2D241E]">5,000 kg</p>
              <p className="text-[#A8988A] text-[10px] font-black uppercase tracking-widest mt-1">plastic off her banks, monthly</p>
            </div>
            <div>
              <p className="font-serif text-4xl font-bold text-[#2D241E]">50</p>
              <p className="text-[#A8988A] text-[10px] font-black uppercase tracking-widest mt-1">weaver looms kept running</p>
            </div>
            <div>
              <p className="font-serif text-4xl font-bold text-[#2D241E]">150</p>
              <p className="text-[#A8988A] text-[10px] font-black uppercase tracking-widest mt-1">painters funded riverside</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#E8DCC4] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(45,36,30,0.1)] hover:border-[#D4A373]/50 flex flex-col justify-between h-full">
              <div>
                <HandHelping className="mx-auto text-[#D4A373] mb-6" size={48} />
                <h4 className="text-2xl font-bold mb-4 text-[#2D241E]">Volunteer</h4>
                <p className="text-[#5A4B3F] mb-8 text-sm leading-relaxed">Cleanups, workshops, archiving — on your own stretch of the river.</p>
              </div>
              <button onClick={() => { setShowVolunteerForm(true); setVolunteerFormSubmitted(false); }} className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest hover:underline mt-auto">Register as Volunteer</button>
            </div>
            <div className="bg-gradient-to-br from-[#3A7CA5] to-[#2F668A] p-8 lg:p-10 rounded-3xl shadow-xl text-white transform md:scale-105 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_25px_55px_rgba(58,124,165,0.3)] flex flex-col justify-between h-full">
              <div>
                <Heart className="mx-auto text-white mb-6 animate-pulse" size={48} fill="white" />
                <h4 className="text-2xl font-bold mb-4">Direct Support</h4>
                <p className="text-white/80 mb-8 text-sm leading-relaxed">Cleaning supplies for riverbed teams.</p>
              </div>
              <button onClick={() => { setShowContributeForm(true); setContributeFormSubmitted(false); }} className="bg-white text-[#3A7CA5] px-8 py-3 rounded-full font-bold hover:bg-[#F4EDDE] transition-all mt-auto self-center">Contribute</button>
            </div>
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#E8DCC4] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(45,36,30,0.1)] hover:border-[#D4A373]/50 flex flex-col justify-between h-full">
              <div>
                <Globe className="mx-auto text-[#3A7CA5] mb-6" size={48} />
                <h4 className="text-2xl font-bold mb-4 text-[#2D241E]">Share Heritage</h4>
                <p className="text-[#5A4B3F] mb-8 text-sm leading-relaxed">Send her story onward — every retelling recruits another pair of hands for the river.</p>
              </div>
              <button onClick={handleShare} className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest hover:underline mt-auto">{shareCopied ? 'Link copied!' : 'Share the Story'}</button>
            </div>
          </div>
        </div>
      </main>

      {/* Place Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 bg-[#3A7CA5] overflow-hidden rounded-t-3xl">
                {selectedPlace.imageUrl && (
                  <img src={selectedPlace.imageUrl} alt={selectedPlace.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E] via-[#2D241E]/40 to-transparent"></div>
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md"
                >
                  <ChevronDown />
                </button>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="bg-[#D4A373] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-4 inline-block">{selectedPlace.state}</span>
                  <h2 className="text-4xl font-serif font-bold">{selectedPlace.name}</h2>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Info size={14} /> Description
                    </h3>
                    <p className="text-[#5A4B3F] leading-relaxed mb-8">{selectedPlace.description}</p>
                    
                    <h3 className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin size={14} /> Highlights
                    </h3>
                    <ul className="grid grid-cols-2 gap-4">
                      {selectedPlace.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#5A4B3F]">
                          <div className="w-1.5 h-1.5 bg-[#D4A373] rounded-full"></div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-8">
                    {selectedPlace.heritage && (
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <Waves className="text-[#3A7CA5]" size={18} /> Heritage
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.heritage}</p>
                      </div>
                    )}
                    {selectedPlace.art && (
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <Palette className="text-[#3A7CA5]" size={18} /> Art & Craft
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.art}</p>
                      </div>
                    )}
                    {selectedPlace.cuisine && (
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <Music className="text-[#3A7CA5]" size={18} /> Cuisine
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.cuisine}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-[#E8DCC4] flex justify-between items-center">
                  <p className="text-xs text-[#A8988A] italic">Part of the 75 Heritage Places initiative.</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedPlace.name}, ${selectedPlace.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#3A7CA5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2F668A] transition-all"
                  >
                    Plan Visit
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volunteer Form Modal */}
      <AnimatePresence>
        {showVolunteerForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowVolunteerForm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-8 md:p-12 border-b border-[#E8DCC4] bg-[#FDFCF8] rounded-t-3xl">
                <button 
                  onClick={() => setShowVolunteerForm(false)}
                  className="absolute top-6 right-6 text-[#A8988A] hover:text-[#2D241E] p-2"
                >
                  <X />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <HandHelping className="text-[#D4A373]" size={32} />
                  <h2 className="text-3xl font-serif font-bold text-[#2D241E]">Volunteer with Us</h2>
                </div>
                <p className="text-[#5A4B3F] leading-relaxed">
                  Join our mission to preserve and protect the sacred river. Fill out the form below to get involved in our upcoming activities.
                </p>
              </div>
              
              <div className="p-8 md:p-12">
                {volunteerFormSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="mx-auto text-[#3A7CA5] mb-6" size={64} />
                    <h3 className="text-2xl font-serif font-bold mb-4">Thank you for registering!</h3>
                    <p className="text-[#5A4B3F] mb-8">Our volunteer coordinator will get in touch with you shortly.</p>
                    <button 
                      onClick={() => setShowVolunteerForm(false)}
                      className="bg-[#3A7CA5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2F668A] transition-all"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-bold text-[#2D241E]">Full Name</span>
                        <input required value={volunteerFormState.name} onChange={(e) => updateVolunteerField('name', e.target.value)} placeholder="Enter your full name" className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#2D241E]">Email Address</span>
                        <input required type="email" value={volunteerFormState.email} onChange={(e) => updateVolunteerField('email', e.target.value)} placeholder="your@email.com" className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#2D241E]">City / Location</span>
                        <input required list="ganga-cities" value={volunteerFormState.place} onChange={(e) => updateVolunteerField('place', e.target.value)} placeholder="e.g., Varanasi" className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
                        <datalist id="ganga-cities">
                          {gangaPlaces.map((p) => (
                            <option key={p.id} value={p.name} />
                          ))}
                        </datalist>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#2D241E]">Area of Interest</span>
                        <select value={volunteerFormState.interest} onChange={(e) => updateVolunteerField('interest', e.target.value)} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]">
                          <option>Cleanup Drives</option>
                          <option>Art & Craft Workshops</option>
                          <option>Digital Archiving</option>
                          <option>Teaching / Education</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#2D241E]">Availability</span>
                        <select value={volunteerFormState.availability} onChange={(e) => updateVolunteerField('availability', e.target.value)} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]">
                          <option>Weekends</option>
                          <option>Weekdays</option>
                          <option>Full-time for Camps</option>
                          <option>Remote Support</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-bold text-[#2D241E]">Brief Message (Optional)</span>
                        <textarea value={volunteerFormState.message} onChange={(e) => updateVolunteerField('message', e.target.value)} placeholder="How else can you contribute?" rows={3} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
                      </label>
                    </div>
                    {volunteerError && <p className="text-red-700 text-sm font-bold">{volunteerError}</p>}
                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={volunteerSubmitting} className="bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B1895D] transition-all shadow-lg flex items-center gap-2 disabled:opacity-60">
                        {volunteerSubmitting ? 'Submitting…' : 'Submit Registration'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contribute Form Modal */}
      <AnimatePresence>
        {showContributeForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowContributeForm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-8 md:p-12 border-b border-[#E8DCC4] bg-[#FDFCF8] rounded-t-3xl">
                <button 
                  onClick={() => setShowContributeForm(false)}
                  className="absolute top-6 right-6 text-[#A8988A] hover:text-[#2D241E] p-2"
                >
                  <X />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="text-[#3A7CA5]" size={32} />
                  <h2 className="text-3xl font-serif font-bold text-[#2D241E]">Direct Contribution</h2>
                </div>
                <p className="text-[#5A4B3F] leading-relaxed">
                  Every rupee goes to the monthly work — cleanup kits for the ghat teams, loom support for the weaver families, and the digital festival archive.
                </p>
              </div>
              
              <div className="p-8 md:p-12">
                {contributeFormSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="mx-auto text-[#3A7CA5] mb-6" size={64} />
                    <h3 className="text-2xl font-serif font-bold mb-4">Thank you for your generosity!</h3>
                    <p className="text-[#5A4B3F] mb-8">We will send you details for completing your contribution shortly.</p>
                    <button 
                      onClick={() => setShowContributeForm(false)}
                      className="bg-[#3A7CA5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2F668A] transition-all"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContributeSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-bold text-[#2D241E]">Full Name</span>
                        <input required value={contributeFormState.name} onChange={(e) => updateContributeField('name', e.target.value)} placeholder="Enter your full name" className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
                      </label>
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-bold text-[#2D241E]">Email Address</span>
                        <input required type="email" value={contributeFormState.email} onChange={(e) => updateContributeField('email', e.target.value)} placeholder="your@email.com" className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#2D241E]">Contribution Amount</span>
                        <select value={contributeFormState.amount} onChange={(e) => updateContributeField('amount', e.target.value)} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]">
                          <option>INR 500</option>
                          <option>INR 1000</option>
                          <option>INR 2500</option>
                          <option>INR 5000</option>
                          <option>Other Amount</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#2D241E]">Preferred Payment Method</span>
                        <select value={contributeFormState.paymentMethod} onChange={(e) => updateContributeField('paymentMethod', e.target.value)} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]">
                          <option>UPI</option>
                          <option>Credit/Debit Card</option>
                          <option>Net Banking</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-bold text-[#2D241E]">Message (Optional)</span>
                        <textarea value={contributeFormState.message} onChange={(e) => updateContributeField('message', e.target.value)} placeholder="Leave a message for the community" rows={3} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
                      </label>
                    </div>
                    {contributeError && <p className="text-red-700 text-sm font-bold">{contributeError}</p>}
                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={contributeSubmitting} className="bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2F668A] transition-all shadow-lg flex items-center gap-2 disabled:opacity-60">
                        {contributeSubmitting ? 'Submitting…' : 'Proceed to Payment'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-[#2D241E] text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <Waves className="text-[#3A7CA5] w-8 h-8" />
                <span className="text-3xl font-serif font-bold tracking-tight">Ganga Tiram</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Dedicated to the preservation, purification, and promotion of the holy river and the civilizational richness she has nurtured for millennia.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-[#D4A373]">The River</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><button onClick={() => { setShowAllPlaces(true); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="hover:text-white transition-colors">All 75 Places</button></li>
                <li><button onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">The Journey</button></li>
                <li><button onClick={goToCheckout} className="hover:text-white transition-colors">Get the Book — ₹999</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-[#D4A373]">Connect</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><button onClick={() => { setShowVolunteerForm(true); setVolunteerFormSubmitted(false); }} className="hover:text-white transition-colors">Volunteer</button></li>
                <li><button onClick={() => { setShowContributeForm(true); setContributeFormSubmitted(false); }} className="hover:text-white transition-colors">Contribute</button></li>
                <li><button onClick={handleShare} className="hover:text-white transition-colors">{shareCopied ? 'Link copied!' : 'Share the Story'}</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 uppercase tracking-widest font-bold">
            <p>© 2026 Mother Ganga Heritage Preservation. All Rights Reserved.</p>
            <p>Gomukh → Gangasagar · 2,525 km</p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTA for Mobile — buy until the Wound has landed, then join */}
      {(!showCheckout && !showAllPlaces) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-[#E8DCC4] p-4 md:hidden pb-safe">
          {pastWound ? (
            <button
              onClick={() => document.getElementById('action')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <HandHelping size={20} /> Join the Mission
            </button>
          ) : (
            <button
              onClick={goToCheckout}
              className="w-full bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <ShoppingBag size={20} /> Get the Book — ₹999
            </button>
          )}
        </div>
      )}
    </div>
  );
}


