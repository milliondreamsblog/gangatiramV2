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
