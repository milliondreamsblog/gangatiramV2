/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useMotionValueEvent,
  useReducedMotion
} from 'motion/react';
import {
  Waves,
  MapPin,
  ChevronRight,
  ChevronDown,
  Search,
  Info,
  BookOpen,
  ShoppingBag,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Upload,
  CheckCircle2,
  Menu,
  Copy,
  Check,
  Maximize2,
  X
} from 'lucide-react';
import {
  Confetti,
  PaintBrush,
  Scissors,
  Leaf,
  MusicNotes,
  BowlFood,
  Bank,
  Plant,
  HandHeart,
  Heart,
  ShareNetwork
} from '@phosphor-icons/react';
import { gangaPlaces, contribFACE, GangaPlace } from './data';
import AdminPanel from './AdminPanel';
import Logo from './Logo';
import { useSmoothScrollTo, useScrollLock } from './smooth-scroll';

const paymentQr = '/book/payment-qr.png';

/** Where book payments land — mirrors the account encoded in the QR above. */
const UPI_ID = '9830181700@sbi';
const UPI_PAYEE = 'Rakesh Mahapatra';
const UPI_BANK = 'State Bank of India';

const BOOK_PRICE = 999;
const SHIPPING_PRICE = 145;
const ORDER_TOTAL = BOOK_PRICE + SHIPPING_PRICE;
const inr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/** Opens the visitor's UPI app with payee and amount filled in — phones can't scan their own screen. */
const upiDeepLink =
  `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE)}` +
  `&am=${ORDER_TOTAL}&cu=INR&tn=${encodeURIComponent('Ganga Tiram book')}`;

/* ------------------------------------------------------------------ *
 * Scroll motion primitives
 *
 * The whole page moves with one gesture: things arrive from below, a
 * touch out of focus, and settle on a long soft curve — the way a current
 * carries something to the surface rather than the way a slide snaps in.
 * Everything here goes still when the visitor prefers reduced motion.
 * ------------------------------------------------------------------ */

/** A long settle — fast to 80%, then a slow glide into place. */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Fire a little before the element is fully on screen, so nothing pops. */
const REVEAL_VIEWPORT = { once: true, margin: '-8% 0px -12% 0px' } as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /* This project has no @types/react, so JSX contributes no IntrinsicAttributes —
     `key` has to be declared on the props of any component we render in a list. */
  key?: React.Key;
  /** Seconds to hold before starting — stagger siblings by index. Keep chains short. */
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
};

/**
 * The site's one shared entrance. Renders a plain div when motion is
 * reduced so the layout is identical either way.
 *
 * Deliberately opacity + transform only. Animating `filter: blur()` reads
 * lovely in isolation but repaints the whole subtree every frame, and the
 * `blur(0px)` it settles on keeps an extra composited layer alive for the
 * rest of the session — it was the main cause of scroll jank here.
 */
function Reveal({ children, className, id, delay = 0, y = 22, x = 0, duration = 0.55 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className} id={id}>{children}</div>;
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hairline rail across the top of the window, coloured like the river itself.
 * It still reports position under reduced motion — it just tracks the scroll
 * exactly instead of springing past it.
 */
function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  /* Stiff and well damped: it should sit under your finger, not chase it. */
  const smoothed = useSpring(scrollYProgress, { stiffness: 400, damping: 45, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ scaleX: reduceMotion ? scrollYProgress : smoothed }}
    />
  );
}

/** Return to the source — desktop only, since the phone has the sticky CTA down there. */
function BackToTop() {
  const scrollTo = useSmoothScrollTo();
  const { scrollYProgress } = useScroll();
  const ring = useSpring(scrollYProgress, { stiffness: 400, damping: 45, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    /* Only touch state on the threshold crossing — this fires on every
       scroll frame, and scheduling a render each time is pure waste. */
    const next = value > 0.12;
    if (next !== visibleRef.current) {
      visibleRef.current = next;
      setVisible(next);
    }
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          onClick={() => scrollTo(0)}
          className="back-to-top show-md-flex"
          aria-label="Back to the top of the page"
        >
          <svg className="back-to-top-ring" viewBox="0 0 54 54" fill="none" aria-hidden="true">
            <circle cx="27" cy="27" r="25" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            <motion.circle
              cx="27"
              cy="27"
              r="25"
              stroke="#D4A373"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 27 27)"
              style={{ pathLength: ring }}
            />
          </svg>
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** A number that counts up the first time it scrolls into view. */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (latest) => setValue(Math.round(latest))
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to]);

  return <span ref={ref}>{value.toLocaleString('en-IN')}{suffix}</span>;
}

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

/** The single course the River Line draws — shared by the thread and the light on it. */
const RIVER_PATH =
  'M 50 0 C 30 40, 70 90, 50 140 C 30 190, 72 240, 50 290 C 28 340, 70 390, 48 440 C 30 490, 68 540, 50 590 C 32 640, 70 690, 50 740 C 30 790, 66 840, 50 890 C 44 930, 52 960, 50 1000';

/**
 * The River Line — a single thread drawn down the page as you scroll,
 * glacial teal at the source, river blue midstream, delta amber at the sea,
 * with a soft light riding the current at your scroll position.
 * Decorative only: aria-hidden, no pointer events, static when the visitor
 * prefers reduced motion.
 */
function RiverLine() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], [0.02, 1]);
  /* Stiff enough to stay under the scroll position — a soft spring here reads as lag, not grace. */
  const mainLength = useSpring(progress, { stiffness: 240, damping: 38, restDelta: 0.001 });
  /* Fork and comet track the scroll directly: no spring means no rAF loop and nothing trailing. */
  const forkLength = useTransform(scrollYProgress, [0.82, 1], [0, 1]);
  /* Stops just short of 1 so the lit segment stays on the path at the very bottom. */
  const cometOffset = useTransform(scrollYProgress, [0, 1], [0, 0.94]);

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
          d={RIVER_PATH}
          stroke="url(#river-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: reduceMotion ? 1 : mainLength }}
        />
        {/* The glow is a wider translucent stroke under a bright one — an
            feGaussianBlur here looked the same and cost a full filter
            re-render on every scroll frame. */}
        {!reduceMotion && (
          <>
            <motion.path
              d={RIVER_PATH}
              stroke="#F5E4C3"
              strokeOpacity="0.35"
              strokeWidth="9"
              strokeLinecap="round"
              style={{ pathLength: 0.05, pathOffset: cometOffset }}
            />
            <motion.path
              d={RIVER_PATH}
              stroke="#F5E4C3"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{ pathLength: 0.05, pathOffset: cometOffset }}
            />
          </>
        )}
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

/**
 * The hero, on three planes. As you scroll away the photograph drifts down
 * and swells, the words lift and dissolve, and the photo ticker slides out
 * last — so leaving the hero feels like the page pulling away from the river
 * rather than a block of content scrolling off.
 */
function HeroSection({ onBuy, onStartJourney }: { onBuy: () => void; onStartJourney: () => void }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  /* 0 while the hero fills the window, 1 once its bottom edge reaches the top. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const tickerY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const tickerOpacity = useTransform(scrollYProgress, [0.35, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden pb-10">
      <div className="absolute inset-0 z-0 bg-[#EAEAEA]">
        <motion.img
          src="./images/hero_background_new.png"
          alt="Ganga River at Varanasi"
          className="w-full h-full object-cover brightness-[0.6] scale-105"
          /* will-change pins this to its own layer so the brightness filter is
             rasterized once instead of on every parallax frame. */
          style={reduceMotion ? undefined : { y: bgY, scale: bgScale, willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-[#F5FAF9]"></div>
      </div>

      <motion.div
        className="relative z-10 text-center px-4 w-full pt-32 md:pt-36"
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity, willChange: 'transform, opacity' }}
      >
        <motion.button
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onClick={onBuy}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white/90 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-8 transition-colors"
        >
          <BookOpen size={14} className="text-[#D4A373]" /> The printed book is out — ₹999 <ChevronRight size={13} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 font-bold tracking-[-0.02em] drop-shadow-[0_2px_28px_rgba(0,0,0,0.6)]">
            2,525 Kilometers<br/><span className="text-[#D4A373] italic font-medium">of Heritage</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          Her exact route, told through 75 sacred places — in a printed book that funds the mission to keep her alive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5 px-2"
        >
          <button onClick={onBuy} className="bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B1895D] transition-all flex items-center justify-center gap-2 w-full sm:w-auto min-h-[56px]">
            <ShoppingBag size={20} /> Buy the Book — ₹999
          </button>
          <button
            onClick={onStartJourney}
            className="bg-white/10 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 w-full sm:w-auto min-h-[56px]"
          >
            Start the Journey <ChevronRight size={20} />
          </button>
        </motion.div>
      </motion.div>

      {/* Place-photo ticker — the river scrolls past */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 mt-14 md:mt-16"
      >
        <motion.div style={reduceMotion ? undefined : { y: tickerY, opacity: tickerOpacity }}>
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
      </motion.div>
    </section>
  );
}

/**
 * One of her three gifts. The photograph drifts against the card as it
 * crosses the window — the card holds still, the image inside it does not,
 * which is what reads as depth.
 */
function GiftCard({
  gift,
  index,
  onSelectPlace
}: {
  key?: React.Key;
  gift: (typeof threeGifts)[number];
  index: number;
  onSelectPlace: (place: GangaPlace) => void;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? undefined : { opacity: 0, y: 40 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_OUT }}
      className="group relative h-[440px] lg:h-[500px] min-w-[85vw] sm:min-w-[420px] lg:min-w-0 snap-center shrink-0 rounded-[28px] overflow-hidden border border-[#E8DCC4] transition-all"
    >
      {/* Taller than the card so the drift never exposes an edge */}
      <motion.div
        className="absolute -inset-y-[10%] inset-x-0"
        style={reduceMotion ? undefined : { y: imageY, willChange: 'transform' }}
      >
        <img
          src={gift.image}
          alt={`${gift.label} — ${gift.headline}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>
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
                onClick={() => place && onSelectPlace(place)}
                className="text-[11px] font-bold uppercase tracking-wider bg-white/15 hover:bg-[#D4A373] border border-white/25 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                {placeName} <ChevronRight size={12} />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
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
  const [activeFace, setActiveFace] = useState('F');
  const [shareCopied, setShareCopied] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [qrZoomed, setQrZoomed] = useState(false);

  // Escape closes the enlarged QR — the scroll lock below keeps the page still behind it.
  useEffect(() => {
    if (!qrZoomed) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setQrZoomed(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [qrZoomed]);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch { /* clipboard blocked — the ID is on screen to type manually */ }
  };

  useEffect(() => {
    // Scroll events can fire several times per frame, and this reads
    // getBoundingClientRect — an unthrottled layout read there stutters the
    // whole page. Coalesce to at most one read per frame.
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 60);
      const wound = document.getElementById('wound');
      if (!wound) return;
      setPastWound(wound.getBoundingClientRect().bottom < window.innerHeight * 0.5);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
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

  const scrollTo = useSmoothScrollTo();

  /* The mobile menu is deliberately not in this list: it is a full-screen
     opaque overlay whose buttons navigate the page behind it — locking would
     swallow those scrolls. */
  useScrollLock(Boolean(selectedPlace) || showVolunteerForm || showContributeForm || qrZoomed);

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
    scrollTo(0, { immediate: true });
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
      scrollTo('journey');
    } else if (action === 'art') {
      const place = gangaPlaces.find((p) => p.name === 'Patna');
      if (place) setSelectedPlace(place);
    } else if (action === 'craft') {
      const place = gangaPlaces.find((p) => p.name === 'Varanasi');
      if (place) setSelectedPlace(place);
    } else {
      scrollTo('action');
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
              <Logo size={28} />
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
                <div className="bg-white border border-[#E8DCC4] rounded-2xl p-5 mb-6 space-y-2.5 text-sm text-[#5A4B3F]">
                  <div className="flex justify-between"><span>Book · 300 pages</span><span className="font-bold text-[#2D241E]">{inr(BOOK_PRICE)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-[#2D241E]">{inr(SHIPPING_PRICE)}</span></div>
                  <div className="flex justify-between border-t border-[#E8DCC4] pt-2.5 mt-1 text-base"><span className="font-bold text-[#2D241E]">Total to pay</span><span className="font-black text-[#3A7CA5]">{inr(ORDER_TOTAL)}</span></div>
                </div>
                <ol className="checkout-steps">
                  <li>Scan the QR and pay {inr(ORDER_TOTAL)}</li>
                  <li>Screenshot the confirmation</li>
                  <li>Upload it with your delivery address</li>
                </ol>
              </div>
            </section>

            <section className="bg-white border border-[#E8DCC4] rounded-3xl p-6 md:p-10">
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
                  <div className="grid grid-cols-1 md:grid-cols-[216px_1fr] gap-8 md:gap-10 mb-10">
                    <figure className="qr-card">
                      <button
                        type="button"
                        className="qr-zoom-trigger"
                        onClick={() => setQrZoomed(true)}
                        aria-label="Enlarge the payment QR code"
                      >
                        <img src={paymentQr} alt={`UPI QR code to pay ${UPI_PAYEE}`} />
                        <span className="qr-zoom-badge"><Maximize2 size={14} /></span>
                      </button>
                      <figcaption>Tap the code to enlarge</figcaption>
                    </figure>

                    <div className="flex flex-col justify-center">
                      <p className="text-[#D4A373] text-xs font-black uppercase tracking-[0.25em] mb-3">Step 1</p>
                      <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-4">Pay {inr(ORDER_TOTAL)} for the book</h2>
                      <p className="text-[#5A4B3F] leading-relaxed mb-6">
                        {inr(BOOK_PRICE)} for the book plus {inr(SHIPPING_PRICE)} shipping. Once it goes through, screenshot the confirmation and upload it below with your address.
                      </p>

                      <div className="payee-card">
                        <div>
                          <span>Paying</span>
                          <strong>{UPI_PAYEE}</strong>
                          <p>{UPI_BANK}</p>
                        </div>
                        <button type="button" onClick={copyUpiId} aria-label={`Copy UPI ID ${UPI_ID}`}>
                          {UPI_ID}
                          {upiCopied ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                      </div>

                      <a href={upiDeepLink} className="upi-open-btn flex md:hidden">
                        Open in a UPI app <ChevronRight size={17} />
                      </a>
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

        {/* Enlarged QR — big enough to scan from another device across a desk */}
        <AnimatePresence>
          {qrZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="qr-lightbox"
              onClick={() => setQrZoomed(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Enlarged payment QR code"
            >
              <motion.div
                initial={{ scale: 0.92, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 12 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="qr-lightbox-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="qr-lightbox-close"
                  onClick={() => setQrZoomed(false)}
                  aria-label="Close enlarged QR code"
                >
                  <X size={20} />
                </button>
                <img src={paymentQr} alt={`UPI QR code to pay ${UPI_PAYEE}`} />
                <div className="qr-lightbox-meta">
                  <span>Paying · {inr(ORDER_TOTAL)}</span>
                  <strong>{UPI_PAYEE}</strong>
                  <p>{UPI_ID} · {UPI_BANK}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (showAllPlaces) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#2D241E] font-sans selection:bg-[#3A7CA5] selection:text-white">
        <ScrollProgress />
        <BackToTop />
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#E8DCC4] px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAllPlaces(false)}>
              <Logo size={30} />
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
            {filteredPlaces.map((place, index) => (
              /* 75 cards: reveal them row by row on scroll rather than all at once on mount */
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6% 0px -8% 0px' }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: EASE_OUT }}
                onClick={() => setSelectedPlace(place)}
                className="group bg-white rounded-3xl p-3 border border-[#E8DCC4] hover:border-[#2D241E]/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer w-full max-w-[320px] flex flex-col"
              >
                {place.imageUrl ? (
                  <div className="w-full h-40 rounded-2xl overflow-hidden shrink-0">
                    <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-full h-20 rounded-2xl bg-[#F4EDDE] shrink-0 flex items-center justify-center">
                    <Waves className="text-[#C9BBA4]" size={24} />
                  </div>
                )}
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="place-tag">{place.state}</span>
                    <span className="place-tag">{journeyStages[place.stage - 1].name}</span>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[#2D241E] mb-2">{place.name}</h4>
                  <p className="text-[#5A4B3F] text-sm leading-relaxed mb-5 line-clamp-3 flex-grow">{place.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#A8988A]">{place.features[0]}</span>
                    <span className="card-arrow">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
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
                data-lenis-prevent
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
                            <Bank size={18} weight="duotone" className="text-[#3A7CA5]" /> Heritage
                          </h4>
                          <p className="text-sm text-[#5A4B3F]">{selectedPlace.heritage}</p>
                        </div>
                      )}
                      {selectedPlace.art && (
                        <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                          <h4 className="font-bold flex items-center gap-2 mb-3">
                            <PaintBrush size={18} weight="duotone" className="text-[#3A7CA5]" /> Art & Craft
                          </h4>
                          <p className="text-sm text-[#5A4B3F]">{selectedPlace.art}</p>
                        </div>
                      )}
                      {selectedPlace.cuisine && (
                        <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                          <h4 className="font-bold flex items-center gap-2 mb-3">
                            <BowlFood size={18} weight="duotone" className="text-[#3A7CA5]" /> Cuisine
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#F5FAF9] via-[#FDFCF8] to-[#FBF2E7] text-[#2D241E] font-sans pb-24 md:pb-0 selection:bg-[#3A7CA5] selection:text-white">
      <ScrollProgress />
      <BackToTop />
      <RiverLine />
      {/* Navigation — transparent over the hero, floating dark pill once scrolled */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto flex items-center transition-all duration-500 ease-out ${
            scrolled
              ? 'mt-3 gap-1 md:gap-2 bg-[#2D241E]/90 backdrop-blur-xl rounded-full py-2 pl-4 pr-2 shadow-[0_8px_24px_rgba(0,0,0,0.25)] border border-white/10'
              : 'w-full max-w-7xl justify-between px-6 py-5 mx-auto'
          }`}
        >
          <button
            className="flex items-center gap-2 shrink-0"
            onClick={() => scrollTo(0)}
            aria-label="Back to top"
          >
            <Logo size={scrolled ? 26 : 34} onDark />
            <span className={`font-serif font-bold tracking-tight text-white transition-all ${scrolled ? 'text-lg show-sm-inline' : 'text-2xl drop-shadow'}`}>
              Ganga Tiram
            </span>
          </button>

          {/* Links live inside their own contained pill so the group reads as one control over the photo */}
          <div className={`show-md-flex items-center gap-1 rounded-full p-1 ${scrolled ? 'mx-2 bg-white/10' : 'bg-white/10 backdrop-blur-md border border-white/15'}`}>
            {[
              { id: 'journey', label: 'Journey' },
              { id: 'heritage', label: 'Heritage' },
              { id: 'action', label: 'Contribute' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative px-4 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-colors ${
                  activeTab === item.id ? 'text-[#2D241E]' : 'text-white/70 hover:text-white'
                }`}
              >
                {activeTab === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white"
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
              className={`bg-[#D4A373] text-white rounded-full font-bold hover:bg-[#B1895D] transition-all flex items-center gap-2 min-h-[44px] ${
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
                scrollTo('journey');
                setActiveTab('journey');
              }} className="hover:text-[#3A7CA5] transition-colors">The Journey</button>
              <button onClick={() => {
                setIsMobileMenuOpen(false);
                scrollTo('heritage');
                setActiveTab('heritage');
              }} className="hover:text-[#3A7CA5] transition-colors">Heritage</button>
              <button onClick={() => {
                setIsMobileMenuOpen(false);
                scrollTo('action');
                setActiveTab('action');
              }} className="hover:text-[#3A7CA5] transition-colors">Contribute</button>
            </div>
            
            <button onClick={() => {
              setIsMobileMenuOpen(false);
              goToCheckout();
            }} className="absolute bottom-12 bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3">
              <ShoppingBag size={20} /> Buy the Book
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSection
        onBuy={goToCheckout}
        onStartJourney={() => scrollTo('journey')}
      />

      {/* Her Three Gifts — Soul · Body · Mind */}
      <section id="gifts" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <Reveal className="text-center mb-14">
          <span className="section-tag mb-5">Her three gifts</span>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-4">One river. Soul, body, and mind.</h3>
          <p className="text-[#5A4B3F] max-w-2xl mx-auto">
            History and nourishment in three currents — what she has given every civilization that rose on her banks.
          </p>
        </Reveal>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar lg:grid lg:grid-cols-3 gap-6 lg:gap-8 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {threeGifts.map((gift, index) => (
            <GiftCard key={gift.label} gift={gift} index={index} onSelectPlace={setSelectedPlace} />
          ))}
        </div>
      </section>

      <section id="book" className="book-section">
        <div className="max-w-7xl mx-auto px-6">
          {/* Beat 1 + 5: the object and the ask */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
            <Reveal className="book-stage" x={-36} y={0} duration={0.65}>
              <Book3D />
            </Reveal>

            <Reveal delay={0.1}>
              <span className="section-tag tag-gold mb-5">The book</span>
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
                  className="bg-[#D4A373] text-white px-10 py-4 rounded-full font-bold hover:bg-[#B1895D] transition-all flex items-center gap-3 w-fit"
                >
                  Get the Book — ₹999 <ChevronRight size={20} />
                </button>
                <p className="text-[#A8988A] text-xs font-bold uppercase tracking-widest">+ ₹145 shipping · Direct UPI · tracking in 24 hours</p>
              </div>
            </Reveal>
          </div>

          {/* Beat 2: look inside */}
          <div className="mt-20 md:mt-24">
            <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <span className="section-tag mb-4">Look inside</span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2D241E]">Six spreads from the journey</h3>
              </div>
              <p className="text-[#5A4B3F] text-sm max-w-sm md:text-right">Real pages from the printed edition — swipe through the river’s course.</p>
            </Reveal>

            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
              {bookSpreads.map((spread, index) => (
                /* Off-screen spreads reveal as you swipe them in, not all at once */
                <Reveal
                  key={spread.image}
                  className="snap-center shrink-0 w-[88vw] md:w-[720px]"
                  delay={index < 2 ? index * 0.08 : 0}
                  y={36}
                >
                  <figure>
                    <div className="rounded-2xl overflow-hidden border border-[#E8DCC4] bg-white">
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
                </Reveal>
              ))}
            </div>
          </div>

          {/* Beat 3: one voice from the book */}
          <motion.blockquote
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            className="mt-20 md:mt-24 max-w-3xl mx-auto text-center"
          >
            <span className="section-tag tag-gold mb-6">From the opening page</span>
            <p className="font-serif italic text-xl md:text-2xl text-[#5A4B3F] leading-relaxed mb-6">
              “I am very much satisfied with your austerities and am now prepared to give you benedictions as you desire.”
            </p>
            <footer className="text-[#A8988A] text-sm">
              <p className="font-bold">Mother Ganga to King Bhagīratha — Śrīmad Bhāgavatam 9.9.3</p>
              <p className="mt-2">A pilgrimage inspired by Radhanath Swami’s <em>The Journey Home</em></p>
            </footer>
          </motion.blockquote>

          {/* Beat 4: what it holds, what it funds */}
          <Reveal className="book-contents-strip mt-20 md:mt-24">
            <div>
              <span>Every copy carries the mission</span>
              <strong>75 places · 2,525 km · 240 photographs · 300 pages — and every order helps fund ghat cleanups and keeps weaver looms running.</strong>
            </div>
            <button onClick={goToCheckout}>
              Get the Book — ₹999 <ChevronRight size={18} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        
        {/* FACE Framework Introduction */}
        <div className="mb-20 md:mb-32">
          <Reveal className="text-center mb-16">
            <span className="section-tag mb-5">The mission</span>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-6">The FACE of Ganga</h3>
            <p className="text-[#5A4B3F] max-w-2xl mx-auto text-lg">
              FACE is how we serve her — <strong>F</strong>estivals, <strong>A</strong>rt, <strong>C</strong>raft, <strong>E</strong>nvironment. Four promises, kept every month.
            </p>
          </Reveal>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:h-[540px]">
            {contribFACE.map((item, index) => {
              const isActive = activeFace === item.letter;
              return (
                <motion.div
                  key={item.letter}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  onMouseEnter={() => setActiveFace(item.letter)}
                  onFocus={() => setActiveFace(item.letter)}
                  onClick={() => setActiveFace(item.letter)}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ duration: 0.55, delay: index * 0.07, ease: EASE_OUT }}
                  className={`group relative rounded-[28px] overflow-hidden border border-[#E8DCC4] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? 'h-[440px] md:h-full md:flex-[3]' : 'h-16 md:h-full md:flex-[1]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-100' : 'scale-110'}`}
                  />
                  <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent' : 'bg-black/55'}`}></div>

                  {/* Collapsed cover: the full form, written vertically on desktop */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span className="show-md-block text-white font-serif font-bold uppercase text-3xl lg:text-4xl tracking-[0.15em] [writing-mode:vertical-rl]">
                      {item.title}
                    </span>
                    <span className="md:hidden text-white font-serif font-bold uppercase text-lg tracking-[0.25em]">
                      {item.title}
                    </span>
                  </div>

                  {/* Expanded content */}
                  <div className={`absolute -right-4 -top-4 text-[10rem] font-black text-white/10 select-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    {item.letter}
                  </div>
                  <div className={`absolute bottom-0 p-6 md:p-8 text-white w-full transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white/20 backdrop-blur-md w-11 h-11 rounded-xl flex items-center justify-center border border-white/30 shrink-0">
                        {item.icon === 'Confetti' && <Confetti size={22} weight="duotone" className="text-[#D4A373]" />}
                        {item.icon === 'PaintBrush' && <PaintBrush size={22} weight="duotone" className="text-[#D4A373]" />}
                        {item.icon === 'Scissors' && <Scissors size={22} weight="duotone" className="text-[#D4A373]" />}
                        {item.icon === 'Leaf' && <Leaf size={22} weight="duotone" className="text-[#D4A373]" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{item.letter} — {item.title}</span>
                    </div>
                    <h4 className="text-2xl md:text-3xl font-serif font-bold mb-3 leading-snug">{item.headline}</h4>
                    <p className="text-white/75 text-sm leading-relaxed mb-5 max-w-md">{item.stat}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleFaceAction(item.action); }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white bg-white/15 hover:bg-[#3A7CA5] border border-white/25 px-4 py-2 rounded-full transition-colors"
                    >
                      {item.cta} <ChevronRight size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Journey Section */}
        <div id="journey" className="mb-20 md:mb-32 scroll-mt-24">
          <Reveal className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="section-tag tag-gold mb-4">The sacred trail</span>
              <h3 className="text-4xl font-serif font-bold text-[#2D241E]">The Heritage Path</h3>
              <p className="text-[#5A4B3F] mt-2">75 places across 2,525 km, told as eight chapters of one life.</p>
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
          </Reveal>

          {/* Eight stations of the river's life */}
          <div className="mb-12">
            <span className="section-tag mb-6">Eight chapters of her life — tap one to follow it</span>
            <div className="relative">
              {/* The connecting thread draws itself left to right as the row arrives */}
              <motion.div
                className="absolute left-0 right-0 top-[8px] h-0.5 bg-gradient-to-r from-[#8FBFBF] via-[#3A7CA5] to-[#C97B4A] opacity-40 rounded-full show-lg-block origin-left"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={REVEAL_VIEWPORT}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              ></motion.div>
              <div className="flex overflow-x-auto hide-scrollbar gap-8 lg:gap-2 lg:grid lg:grid-cols-8 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                {journeyStages.map((s, index) => {
                  const isActive = selectedStage === s.stage;
                  return (
                    <motion.button
                      key={s.stage}
                      onClick={() => setSelectedStage(isActive ? null : s.stage)}
                      aria-pressed={isActive}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={REVEAL_VIEWPORT}
                      transition={{ duration: 0.45, delay: 0.06 + index * 0.04, ease: EASE_OUT }}
                      className="group/station flex flex-col items-center gap-2 shrink-0 min-w-[72px]"
                    >
                      <span
                        className={`w-[18px] h-[18px] rounded-full border-2 transition-all ${isActive ? 'scale-125' : 'bg-[#FDFCF8] group-hover/station:scale-110'}`}
                        style={isActive ? { backgroundColor: s.color, borderColor: s.color } : { borderColor: s.color }}
                      ></span>
                      <span className={`text-xs font-black uppercase tracking-wider transition-colors ${isActive ? 'text-[#2D241E]' : 'text-[#A8988A] group-hover/station:text-[#5A4B3F]'}`}>{s.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9BBA4]">{s.km}</span>
                    </motion.button>
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
                {prominentPlaces.map((place, index) => (
                  <motion.div
                    key={place.id}
                    layout
                    initial={{ opacity: 0, y: 36, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={REVEAL_VIEWPORT}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.55, delay: (index % 3) * 0.07, ease: EASE_OUT }}
                    onClick={() => setSelectedPlace(place)}
                    className="group bg-white rounded-3xl p-3 border border-[#E8DCC4] hover:border-[#2D241E]/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer w-full min-w-[85vw] md:min-w-0 md:max-w-[380px] snap-center shrink-0 flex flex-col"
                  >
                    {place.imageUrl ? (
                      <div className="w-full h-52 rounded-2xl overflow-hidden shrink-0">
                        <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-2xl bg-[#F4EDDE] shrink-0 flex items-center justify-center">
                        <Waves className="text-[#C9BBA4]" size={28} />
                      </div>
                    )}
                    <div className="flex flex-col flex-grow p-4 md:p-5">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="place-tag">{place.state}</span>
                        <span className="place-tag">{journeyStages[place.stage - 1].name}</span>
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-[#2D241E] mb-2">{place.name}</h4>
                      <p className="text-[#5A4B3F] text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">{place.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8988A]">{place.features[0]}</span>
                        <span className="card-arrow">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
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
                  scrollTo(0, { immediate: true });
                }}
                className="mt-16 bg-[#2D241E] text-white px-12 py-5 rounded-full font-bold hover:bg-[#3A7CA5] transition-all flex items-center gap-3"
              >
                See all 75 places <ChevronRight size={20} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Heritage & Culture Highlight */}
        <div id="heritage" className="scroll-mt-24 bg-[#2D241E] rounded-[28px] md:rounded-[32px] overflow-hidden flex flex-col lg:flex-row items-stretch">
          <div className="lg:w-1/2 relative min-h-[300px] md:min-h-[400px]">
            <HeritageImageSlider />
          </div>
          <div className="lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center text-white bg-gradient-to-br from-[#2D241E] to-[#16110D]">
            <Reveal>
              <span className="section-tag tag-dark tag-gold mb-5 w-fit">Experience the legacy</span>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-8 md:mb-12 leading-tight">A Civilization Born of the Holy Waters</h3>
            </Reveal>

            <div className="space-y-10">
              <Reveal className="flex gap-8 items-start group" x={26} y={0} delay={0.04}>
                <div className="bg-[#3A7CA5]/10 p-5 rounded-2xl shrink-0 border border-[#3A7CA5]/20 group-hover:bg-[#3A7CA5]/20 group-hover:scale-110 transition-all duration-300">
                  <PaintBrush size={28} weight="duotone" className="text-[#3A7CA5]" />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-3 text-white/95">Art & Craftsmanship</h4>
                  <p className="text-white/70 leading-relaxed text-lg">Sourcing authentic <span className="text-[#D4A373] font-semibold">Banarasi silk</span> directly from 50 weaver looms in ancient Kashi, and supporting traditional <span className="text-[#D4A373] font-semibold">Madhubani canvas painters</span> along Bihar's sacred riverbanks.</p>
                </div>
              </Reveal>

              <Reveal className="flex gap-8 items-start group" x={26} y={0} delay={0.12}>
                <div className="bg-[#D4A373]/10 p-5 rounded-2xl shrink-0 border border-[#D4A373]/20 group-hover:bg-[#D4A373]/20 group-hover:scale-110 transition-all duration-300">
                  <MusicNotes size={28} weight="duotone" className="text-[#D4A373]" />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-3 text-white/95">Music & Philosophy</h4>
                  <p className="text-white/70 leading-relaxed text-lg">Immerse in 500+ hours of high-fidelity recordings featuring <span className="text-[#D4A373] font-semibold">morning Ragas</span>, resonant temple bells, and transcendent <span className="text-[#D4A373] font-semibold">Sanskrit hymns</span> performed right at the water's edge.</p>
                </div>
              </Reveal>

              <Reveal className="flex gap-8 items-start group" x={26} y={0} delay={0.2}>
                <div className="bg-[#3A7CA5]/10 p-5 rounded-2xl shrink-0 border border-[#3A7CA5]/20 group-hover:bg-[#3A7CA5]/20 group-hover:scale-110 transition-all duration-300">
                  <Plant size={28} weight="duotone" className="text-[#3A7CA5]" />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-3 text-white/95">Ecological Action</h4>
                  <p className="text-white/70 leading-relaxed text-lg">Funding crucial clean-water patrols to monitor the 50km <span className="text-[#D4A373] font-semibold">Gangetic Dolphin Sanctuary</span> and aggressively eliminating harmful chemical waste from local farmlands.</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.28}>
              <button
                onClick={() => { setShowAllPlaces(true); scrollTo(0, { immediate: true }); }}
                className="mt-14 bg-[#3A7CA5] text-white px-10 py-5 rounded-full font-bold hover:bg-[#2F668A] transition-all w-fit flex items-center gap-3"
              >
                Explore art & cuisine of 75 places <ChevronRight size={20} />
              </button>
            </Reveal>
          </div>
        </div>

        {/* The Wound — the dark interlude */}
        <motion.div
          id="wound"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="mt-20 md:mt-32 bg-[#2D241E] rounded-[28px] md:rounded-[32px] px-8 md:px-16 py-16 md:py-24 text-center"
        >
          <Reveal delay={0.08}>
            <span className="section-tag tag-dark tag-amber mb-6">The wound</span>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white/95 max-w-3xl mx-auto mb-14 leading-tight">
              “Here we put her in chains; the river that was a river begins to thin.”
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-left md:text-center">
            {[
              { title: 'Her source retreats', body: 'The Gangotri glacier has been pulling back for a hundred years — the mouth she is born from keeps moving away.' },
              { title: 'Her middle runs foul', body: 'At Kanpur, tannery waste stains the current that a whole plain drinks and farms from.' },
              { title: 'Her end is chained', body: 'At Farakka the barrage thins her flow — and with it, the river dolphins that need her deep and moving.' }
            ].map((item, index) => (
              <Reveal key={item.title} delay={0.18 + index * 0.08} y={22}>
                <p className="font-serif text-2xl text-[#C97B4A] font-bold mb-2">{item.title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{item.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.42}>
            <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.25em] mt-14">From her own chapters — Gomukh · Kanpur · Farakka</p>
          </Reveal>
        </motion.div>

        {/* Action / Contribution Section */}
        <div id="action" className="scroll-mt-24 mt-8 md:mt-12 text-center bg-[#F4EDDE] p-8 md:p-12 lg:p-24 rounded-[28px] md:rounded-[32px] border border-[#E8DCC4]">
          <Reveal>
            <span className="section-tag mb-6">Take a Sankalp — a vow to her</span>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#2D241E] mb-8">Which part of her life will you keep alive?</h3>
            <p className="text-[#5A4B3F] max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
              Volunteer on your stretch of the river, contribute to the monthly work, or share her story onward.
            </p>
          </Reveal>

          {/* The numbers count themselves up the first time they come into view */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16">
            {[
              { to: 5000, suffix: ' kg', label: 'plastic off her banks, monthly' },
              { to: 50, suffix: '', label: 'weaver looms kept running' },
              { to: 150, suffix: '', label: 'painters funded riverside' }
            ].map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.08} y={20}>
                <p className="font-serif text-4xl font-bold text-[#2D241E]">
                  <CountUp to={stat.to} suffix={stat.suffix} />
                </p>
                <p className="text-[#A8988A] text-[10px] font-black uppercase tracking-widest mt-1">{stat.label}</p>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <Reveal className="bg-white p-8 lg:p-10 rounded-3xl border border-[#E8DCC4] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A373] flex flex-col justify-between h-full" y={34}>
              <div>
                <HandHeart size={48} weight="duotone" className="mx-auto text-[#D4A373] mb-6" />
                <h4 className="text-2xl font-bold mb-4 text-[#2D241E]">Volunteer</h4>
                <p className="text-[#5A4B3F] mb-8 text-sm leading-relaxed">Cleanups, workshops, archiving — on your own stretch of the river.</p>
              </div>
              <button onClick={() => { setShowVolunteerForm(true); setVolunteerFormSubmitted(false); }} className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest hover:underline mt-auto">Register as Volunteer</button>
            </Reveal>
            <Reveal className="bg-gradient-to-br from-[#3A7CA5] to-[#2F668A] p-8 lg:p-10 rounded-3xl text-white transform md:scale-105 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full" y={34} delay={0.08}>
              <div>
                <Heart size={48} weight="fill" className="mx-auto text-white mb-6 animate-pulse" />
                <h4 className="text-2xl font-bold mb-4">Direct Support</h4>
                <p className="text-white/80 mb-8 text-sm leading-relaxed">Cleaning supplies for riverbed teams.</p>
              </div>
              <button onClick={() => { setShowContributeForm(true); setContributeFormSubmitted(false); }} className="bg-white text-[#3A7CA5] px-8 py-3 rounded-full font-bold hover:bg-[#F4EDDE] transition-all mt-auto self-center">Contribute</button>
            </Reveal>
            <Reveal className="bg-white p-8 lg:p-10 rounded-3xl border border-[#E8DCC4] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A373] flex flex-col justify-between h-full" y={34} delay={0.16}>
              <div>
                <ShareNetwork size={48} weight="duotone" className="mx-auto text-[#3A7CA5] mb-6" />
                <h4 className="text-2xl font-bold mb-4 text-[#2D241E]">Share Heritage</h4>
                <p className="text-[#5A4B3F] mb-8 text-sm leading-relaxed">Send her story onward — every retelling recruits another pair of hands for the river.</p>
              </div>
              <button onClick={handleShare} className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest hover:underline mt-auto">{shareCopied ? 'Link copied!' : 'Share the Story'}</button>
            </Reveal>
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
              data-lenis-prevent
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
                          <Bank size={18} weight="duotone" className="text-[#3A7CA5]" /> Heritage
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.heritage}</p>
                      </div>
                    )}
                    {selectedPlace.art && (
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <PaintBrush size={18} weight="duotone" className="text-[#3A7CA5]" /> Art & Craft
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.art}</p>
                      </div>
                    )}
                    {selectedPlace.cuisine && (
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <BowlFood size={18} weight="duotone" className="text-[#3A7CA5]" /> Cuisine
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
              data-lenis-prevent
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
                  <HandHeart size={32} weight="duotone" className="text-[#D4A373]" />
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
                      <button type="submit" disabled={volunteerSubmitting} className="bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B1895D] transition-all flex items-center gap-2 disabled:opacity-60">
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
              data-lenis-prevent
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
                  <Heart size={32} weight="duotone" className="text-[#3A7CA5]" />
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
                      <button type="submit" disabled={contributeSubmitting} className="bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2F668A] transition-all flex items-center gap-2 disabled:opacity-60">
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

      {/* Delta footer — a closing statement carries the page out, link columns to the side,
          and the wordmark sits behind it all as a tonal watermark. */}
      <footer className="site-footer">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-14 lg:gap-20">
            <div>
              <div className="flex items-center gap-2 mb-10">
                <Logo size={32} onDark />
                <span className="text-2xl font-serif font-bold tracking-tight">Ganga Tiram</span>
              </div>
              <Reveal>
                <p className="footer-statement">
                  <span className="headline-muted">She has carried us for 2,525 kilometers.</span><br />
                  Now she needs us.
                </p>
                <button onClick={goToCheckout} className="footer-cta">
                  Get the Book — {inr(BOOK_PRICE)} <ArrowUpRight size={18} />
                </button>
              </Reveal>
            </div>

            <Reveal className="grid grid-cols-2 gap-10 lg:pt-2" delay={0.1}>
              <div>
                <h5 className="footer-col-head">The River</h5>
                <ul className="footer-links">
                  <li><button onClick={() => { setShowAllPlaces(true); scrollTo(0, { immediate: true }); }}>All 75 Places</button></li>
                  <li><button onClick={() => scrollTo('journey')}>The Journey</button></li>
                  <li><button onClick={() => scrollTo('heritage')}>Heritage</button></li>
                  <li><button onClick={goToCheckout}>Get the Book</button></li>
                </ul>
              </div>
              <div>
                <h5 className="footer-col-head">Connect</h5>
                <ul className="footer-links">
                  <li><button onClick={() => { setShowVolunteerForm(true); setVolunteerFormSubmitted(false); }}>Volunteer</button></li>
                  <li><button onClick={() => { setShowContributeForm(true); setContributeFormSubmitted(false); }}>Contribute</button></li>
                  <li><button onClick={handleShare}>{shareCopied ? 'Link copied!' : 'Share the Story'}</button></li>
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 tracking-tight">
            <p>© 2026 Mother Ganga Heritage Preservation</p>
            <p>Gomukh → Gangasagar · 2,525 km</p>
          </div>
        </div>
        <span className="footer-watermark" aria-hidden="true">GANGA TIRAM</span>
      </footer>

      {/* Sticky Bottom CTA for Mobile — buy until the Wound has landed, then join */}
      {(!showCheckout && !showAllPlaces) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-[#E8DCC4] p-4 md:hidden pb-safe">
          {pastWound ? (
            <button
              onClick={() => scrollTo('action')}
              className="w-full bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <HandHeart size={20} weight="bold" /> Join the Mission
            </button>
          ) : (
            <button
              onClick={goToCheckout}
              className="w-full bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <ShoppingBag size={20} /> Get the Book — ₹999
            </button>
          )}
        </div>
      )}
    </div>
  );
}


