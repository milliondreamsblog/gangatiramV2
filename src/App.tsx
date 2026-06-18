/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Route,
  Landmark,
  Images,
  PackageCheck
} from 'lucide-react';
import { gangaPlaces, contribFACE, GangaPlace } from './data';

const aiBookSlider = '/book/ai-book-slider.png';
const paymentQr = '/book/payment-qr.jpeg';

const bookHighlights = [
  {
    icon: Route,
    title: '75 panoramic locations',
    description: 'A guided visual trail from Gomukh to Gangasagar across the sacred river path.'
  },
  {
    icon: Landmark,
    title: 'Heritage and culture',
    description: 'Temples, ghats, stories, rituals, art, cuisine, and living traditions along Ganga.'
  },
  {
    icon: Images,
    title: 'Large visual spreads',
    description: 'Photo-rich pages designed as a memorable coffee-table style reading experience.'
  },
  {
    icon: PackageCheck,
    title: 'Direct delivery order',
    description: 'Simple QR payment flow with delivery details and payment screenshot upload.'
  }
];

const bookSliderSlides = [
  {
    image: aiBookSlider,
    title: 'Thick hardcover edition',
    subtitle: 'Premium 3D product view with visible cover, spine, and page depth.'
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

export default function App() {
  const [activeTab, setActiveTab] = useState('journey');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredPlaces = gangaPlaces.filter(place => 
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const prominentPlaces = filteredPlaces.slice(0, 6);

  const goToCheckout = () => {
    setShowCheckout(true);
    setOrderSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const updateOrderField = (field: keyof OrderForm, value: string | File | null) => {
    setOrderForm((current) => ({ ...current, [field]: value }));
  };

  const handleOrderSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderSubmitted(true);
  };

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

        <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <section className="checkout-book-panel">
              <BookSlider compact />
              <div>
                <p className="text-[#3A7CA5] text-xs font-black uppercase tracking-[0.25em] mb-3">Book Order</p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5">Ganga Tiram</h1>
                <p className="text-[#5A4B3F] leading-relaxed">
                  Scan the payment QR, complete payment, then upload the payment screenshot with your delivery details.
                </p>
              </div>
            </section>

            <section className="bg-white border border-[#E8DCC4] rounded-3xl p-6 md:p-10 shadow-xl">
              {orderSubmitted ? (
                <div className="min-h-[520px] flex flex-col justify-center items-center text-center">
                  <CheckCircle2 className="text-[#3A7CA5] mb-6" size={72} />
                  <h2 className="text-4xl font-serif font-bold mb-4">Order Details Received</h2>
                  <p className="text-[#5A4B3F] max-w-xl mb-8">
                    Your payment screenshot and delivery details are ready for review. Add a backend or form service before production if you need these orders stored automatically.
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
                      <h2 className="text-3xl font-serif font-bold mb-4">Pay for the book</h2>
                      <p className="text-[#5A4B3F] leading-relaxed">
                        Use any UPI app to scan the QR. After payment, take a screenshot and upload it below with your shipping address.
                      </p>
                    </div>
                  </div>

