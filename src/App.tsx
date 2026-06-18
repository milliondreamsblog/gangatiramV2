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

                    <button type="submit" className="w-full bg-[#2D241E] text-white py-4 rounded-full font-bold hover:bg-[#3A7CA5] transition-colors flex items-center justify-center gap-2">
                      Submit Book Order <ChevronRight size={20} />
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

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b border-[#E8DCC4] pb-8"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-4">The Complete Sacred Path</h1>
            <p className="text-[#5A4B3F] text-lg max-w-3xl">Explore every major landmark, heritage site, and spiritual hub along the 2,525 km journey of the holy river.</p>
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
                className="bg-white rounded-3xl p-8 border border-[#E8DCC4] hover:shadow-xl transition-all group cursor-pointer w-full max-w-[320px]"
              >
                <div className="flex justify-between items-start mb-6">
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
                <div className="relative h-64 bg-[#3A7CA5]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E] to-transparent"></div>
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
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <Waves className="text-[#3A7CA5]" size={18} /> Heritage
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.heritage}</p>
                      </div>
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <Palette className="text-[#3A7CA5]" size={18} /> Art & Craft
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.art}</p>
                      </div>
                      <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#E8DCC4]">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <Music className="text-[#3A7CA5]" size={18} /> Cuisine
                        </h4>
                        <p className="text-sm text-[#5A4B3F]">{selectedPlace.cuisine}</p>
                      </div>
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
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D241E] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#E8DCC4] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Waves className="text-[#3A7CA5] w-8 h-8" />
            <span className="text-2xl font-serif font-bold tracking-tight text-[#2D241E]">Ganga Tiram</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-[#5A4B3F]">
            <button onClick={() => {
              document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
              setActiveTab('journey');
            }} className={`${activeTab === 'journey' ? 'text-[#3A7CA5] border-b-2 border-[#3A7CA5]' : ''} hover:text-[#3A7CA5] transition-colors`}>Journey</button>
            <button onClick={() => {
              document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' });
              setActiveTab('heritage');
            }} className={`${activeTab === 'heritage' ? 'text-[#3A7CA5] border-b-2 border-[#3A7CA5]' : ''} hover:text-[#3A7CA5] transition-colors`}>Heritage</button>
            <button onClick={() => {
              document.getElementById('action')?.scrollIntoView({ behavior: 'smooth' });
              setActiveTab('action');
            }} className={`${activeTab === 'action' ? 'text-[#3A7CA5] border-b-2 border-[#3A7CA5]' : ''} hover:text-[#3A7CA5] transition-colors`}>Contribute</button>
          </div>
          <button onClick={goToCheckout} className="bg-[#3A7CA5] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#2F668A] transition-colors shadow-lg flex items-center gap-2">
            <ShoppingBag size={16} /> Buy Book
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/ganga_river_hero_1777100817848.png" 
            alt="Ganga River" 
            className="w-full h-full object-cover brightness-75 scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590053450410-090c29188092?auto=format&fit=crop&q=80&w=2000';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFCF8]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif text-white mb-6 font-bold"
          >
            The Eternal Grace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-[#E8DCC4] max-w-2xl mx-auto mb-10 leading-relaxed italic"
          >
            "A journey of 2,525 kilometers, a legacy of 5,000 years, and the heartbeat of a billion souls."
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button 
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B1895D] transition-all flex items-center gap-2 shadow-xl"
            >
              Start the Journey <ChevronRight size={20} />
            </button>
            <button onClick={goToCheckout} className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/30 transition-all">
              Buy the book
            </button>
          </motion.div>
        </div>
      </section>

      <section id="book" className="book-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="book-stage"
            >
              <BookSlider />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#D4A373] font-black text-sm uppercase tracking-[0.3em] mb-5">Featured Book</p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#2D241E] mb-6">Own the Ganga Tiram Book</h2>
              <p className="text-[#5A4B3F] text-lg leading-relaxed mb-8 max-w-2xl">
                A visual and cultural journey across the sacred river, designed for readers who want a meaningful keepsake of Ganga's heritage.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <span className="book-chip"><BookOpen size={16} /> Printed Edition</span>
                <span className="book-chip"><Waves size={16} /> Heritage Journey</span>
                <span className="book-chip"><ShoppingBag size={16} /> Direct QR Payment</span>
              </div>
              <button
                onClick={goToCheckout}
                className="bg-[#3A7CA5] text-white px-10 py-4 rounded-full font-bold hover:bg-[#2F668A] transition-all shadow-xl flex items-center gap-3 w-fit"
              >
                Buy Now <ChevronRight size={20} />
              </button>
            </motion.div>
          </div>

          <div className="book-benefits">
            <div className="book-benefits-heading">
              <p className="text-[#3A7CA5] font-black text-xs uppercase tracking-[0.25em] mb-3">What you get</p>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2D241E]">A complete Ganga journey in one collectible book</h3>
            </div>

            <div className="book-benefit-grid">
              {bookHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="book-benefit-card">
                    <div className="book-benefit-icon">
                      <Icon size={22} />
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="book-contents-strip">
              <div>
                <span>Inside</span>
                <strong>Gomukh, Rishikesh, Haridwar, Prayagraj, Varanasi, Patna, Kolkata, Gangasagar</strong>
              </div>
              <button onClick={goToCheckout}>
                Order Copy <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* FACE Framework Introduction */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-[#3A7CA5] font-black text-sm uppercase tracking-[0.3em] mb-4">Preservation Framework</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-6">The FACE of Ganga</h3>
            <p className="text-[#5A4B3F] max-w-2xl mx-auto italic">"F - Festivals, A - Arts, C - Culture, E - Environmental Preservation"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contribFACE.map((item) => (
              <motion.div 
                key={item.letter}
                whileHover={{ y: -10 }}
                className="group relative bg-white h-[450px] rounded-[2rem] overflow-hidden border border-[#E8DCC4] shadow-sm hover:shadow-2xl transition-all"
              >
                {/* Background Image with Overlay */}
                <img 
                  src={(item as any).image} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590159411986-3023021f1d1d?auto=format&fit=crop&q=80&w=600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/60 transition-colors"></div>
                
                <div className="absolute -right-4 -top-4 text-[12rem] font-black text-white/10 select-none">
                  {item.letter}
                </div>

                <div className="absolute bottom-0 p-8 text-white">
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                    {item.icon === 'Sparkles' && <Sparkles className="text-[#D4A373]" />}
                    {item.icon === 'Palette' && <Palette className="text-[#3A7CA5]" />}
                    {item.icon === 'Music' && <Music className="text-[#D4A373]" />}
                    {item.icon === 'Leaf' && <Leaf className="text-[#3A7CA5]" />}
                  </div>
                  <h4 className="text-2xl font-serif font-bold mb-3">{item.title}</h4>
                  <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 transform">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <div id="journey" className="mb-32">
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

          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full">
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
                    className="bg-white rounded-[2.5rem] p-10 border border-[#E8DCC4] shadow-sm hover:shadow-2xl transition-all group cursor-pointer w-full max-w-[380px] h-full flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-8">
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
        <div id="heritage" className="bg-[#2D241E] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-stretch shadow-2xl">
          <div className="lg:w-1/2 relative min-h-[400px]">
            <img 
              src="/images/ganga_culture_heritage_1777100835789.png" 
              alt="Heritage Culture" 
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1000';
              }}
            />
          </div>
          <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center text-white">
            <h2 className="text-[#D4A373] font-bold text-sm uppercase tracking-[0.3em] mb-6">Experience the Legacy</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">A Civilization Born of the Holy Waters</h3>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="bg-[#3A7CA5]/20 p-4 rounded-2xl shrink-0">
                  <Palette className="text-[#3A7CA5]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Art & Craftsmanship</h4>
                  <p className="text-gray-400 leading-relaxed">From the intricate Silk of Banaras to the vibrant Madhubani of Bihar, Ganga's banks have nurtured artistic brilliance for millennia.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="bg-[#D4A373]/20 p-4 rounded-2xl shrink-0">
                  <Music className="text-[#D4A373]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Music & Philosophy</h4>
                  <p className="text-gray-400 leading-relaxed">The rhythmic sound of temple bells and the soulful kirtans create a spiritual melody that resonates across the river's path.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="bg-[#3A7CA5]/20 p-4 rounded-2xl shrink-0">
                  <Waves className="text-[#3A7CA5]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Sustainable Living</h4>
                  <p className="text-gray-400 leading-relaxed">Honoring the river means protecting the life she sustains, from the Gangetic dolphins to the local farming communities.</p>
                </div>
              </div>
            </div>
            <button className="mt-12 bg-white text-[#2D241E] px-10 py-4 rounded-full font-bold hover:bg-[#D4A373] hover:text-white transition-all w-fit">
              Explore Cuisines & Art
            </button>
          </div>
        </div>

        {/* Action / Contribution Section */}
        <div id="action" className="mt-32 text-center bg-[#F4EDDE] p-12 md:p-24 rounded-[3rem] border border-[#E8DCC4]">
          <h2 className="text-[#3A7CA5] font-black text-sm uppercase tracking-[0.3em] mb-6">Make a Difference</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#2D241E] mb-8">Contribute to the Legacy</h3>
          <p className="text-[#5A4B3F] max-w-2xl mx-auto mb-16 text-lg">
            Mother Ganga has given us everything. It's time we reciprocate. Become a volunteer, donate to the cleaning mission, or simply spread the knowledge of her rich heritage.
          </p>
