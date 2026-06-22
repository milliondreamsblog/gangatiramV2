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
  PackageCheck,
  Menu,
  X
} from 'lucide-react';
import { gangaPlaces, contribFACE, GangaPlace } from './data';

const aiBookSlider = '/book/ai-book-slider.png';
const paymentQr = '/book/payment-qr.jpeg';

const bookHighlights = [
  {
    icon: Route,
    title: '75 documented locations',
    description: 'A chronological map tracing the entire 2,525 km river course through 75 documented locations.'
  },
  {
    icon: Landmark,
    title: 'Art and living traditions',
    description: 'Explore 15 specific riverside art styles, 45 ancient temples, and local culinary traditions.'
  },
  {
    icon: Images,
    title: 'Large visual spreads',
    description: 'Features 240 high-resolution full-page photographs printed on 170 GSM matte art paper.'
  },
  {
    icon: PackageCheck,
    title: 'Direct delivery order',
    description: 'Scan the direct UPI QR code, upload your transfer receipt, and receive tracking within 24 hours.'
  }
];

const bookSliderSlides = [
  {
    image: aiBookSlider,
    title: 'The Printed Collection',
    subtitle: 'A tangible 300-page visual trail across 75 sacred locations.'
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

const heritageImages = [
  "./images/ganga_art_new.png",
  "./images/ganga_music_new.png",
  "./images/ganga_environment_new.png"
];

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20">
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
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D241E] font-sans pb-24 md:pb-0">
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
          <div className="flex items-center gap-4">
            <button onClick={goToCheckout} className="bg-[#3A7CA5] text-white px-5 md:px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#2F668A] transition-colors shadow-lg flex items-center gap-2 min-h-[44px]">
              <ShoppingBag size={18} /> <span className="hidden sm:inline">Buy Book</span>
            </button>
            <button 
              className="md:hidden p-2 text-[#2D241E] min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={28} />
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
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#EAEAEA]">
          <img 
            src="./images/hero_background_new.png" 
            alt="Ganga River at Varanasi" 
            className="w-full h-full object-cover brightness-[0.65] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#FDFCF8]"></div>
        </div>
        
        {/* Floating Images for Header (Polaroid Style) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            initial={{ opacity: 0, x: -50, y: 20, rotate: -15 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute top-24 md:top-32 left-[-2%] sm:left-[2%] md:left-[8%] p-2 sm:p-3 bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-top-left"
          >
            <img src="./images/haridwar_floating_new.png" className="w-24 sm:w-32 md:w-56 aspect-[3/4] object-cover rounded-sm" alt="Haridwar Aarti" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50, y: 20, rotate: 15 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 8 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute bottom-28 md:bottom-32 right-[-2%] sm:right-[2%] md:right-[8%] p-2 sm:p-3 bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-bottom-right"
          >
            <img src="./images/varanasi_floating_new.png" className="w-28 sm:w-36 md:w-64 aspect-[4/5] object-cover rounded-sm" alt="Varanasi Ghats" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: -20, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="absolute top-32 right-[20%] p-2.5 bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] hidden lg:block"
          >
            <img src="./images/ganga_craft_new.png" className="w-32 md:w-48 aspect-square object-cover rounded-sm" alt="Riverside Craft" />
          </motion.div>
        </div>
        
        <div className="relative z-10 text-center px-4 mt-8 w-full">
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
            className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed bg-black/30 p-5 sm:p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
          >
            Experience the exact route of the Ganga through 75 documented sacred locations, interactive digital archives, and direct artisan support.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5 px-2"
          >
            <button 
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#D4A373] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B1895D] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(212,163,115,0.3)] w-full sm:w-auto min-h-[56px]"
            >
              Start the Journey <ChevronRight size={20} />
            </button>
            <button onClick={goToCheckout} className="bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2F668A] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(58,124,165,0.3)] w-full sm:w-auto min-h-[56px]">
              <ShoppingBag size={20} /> Buy the Book Now
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white animate-bounce cursor-pointer z-20 transition-colors"
          onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown size={36} />
        </motion.div>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        
        {/* FACE Framework Introduction */}
        <div className="mb-20 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-[#3A7CA5] font-black text-sm uppercase tracking-[0.3em] mb-4">Action Framework</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-6">The FACE of Ganga</h3>
            <div className="flex flex-wrap justify-center gap-4 text-[#5A4B3F] font-bold">
              <span className="bg-white px-4 py-2 rounded-full border border-[#E8DCC4] shadow-sm">F: FESTIVALS (digital)</span>
              <span className="bg-white px-4 py-2 rounded-full border border-[#E8DCC4] shadow-sm">A: Art</span>
              <span className="bg-white px-4 py-2 rounded-full border border-[#E8DCC4] shadow-sm">C: Craft</span>
              <span className="bg-white px-4 py-2 rounded-full border border-[#E8DCC4] shadow-sm">E: Environmental issue</span>
            </div>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {contribFACE.map((item) => (
              <motion.div 
                key={item.letter}
                whileHover={{ y: -10 }}
                className="group relative bg-white h-[400px] md:h-[450px] min-w-[85vw] md:min-w-0 snap-center shrink-0 rounded-[2rem] overflow-hidden border border-[#E8DCC4] shadow-sm hover:shadow-2xl transition-all"
              >
                {/* Background Image with Overlay */}
                <img 
                  src={(item as any).image} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                  <p className="text-white/80 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transform">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <div id="journey" className="mb-20 md:mb-32">
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
        <div id="heritage" className="bg-[#2D241E] rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-stretch shadow-2xl">
          <div className="lg:w-1/2 relative min-h-[300px] md:min-h-[400px]">
            <HeritageImageSlider />
          </div>
          <div className="lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center text-white bg-gradient-to-br from-[#2D241E] to-[#16110D]">
            <h2 className="text-[#D4A373] font-bold text-sm uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Sparkles size={16} /> Experience the Legacy
            </h2>
            <h3 className="text-5xl md:text-6xl font-serif font-bold mb-12 leading-tight drop-shadow-lg">A Civilization Born of the Holy Waters</h3>
            
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
            
            <button className="mt-14 bg-[#D4A373] text-white px-10 py-5 rounded-full font-bold hover:bg-[#B1895D] hover:scale-105 transition-all w-fit flex items-center gap-3 shadow-[0_10px_20px_rgba(212,163,115,0.2)]">
              Explore Cuisines & Art <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Action / Contribution Section */}
        <div id="action" className="mt-20 md:mt-32 text-center bg-[#F4EDDE] p-8 md:p-12 lg:p-24 rounded-[2rem] md:rounded-[3rem] border border-[#E8DCC4] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h2 className="text-[#3A7CA5] font-black text-sm uppercase tracking-[0.3em] mb-6">Join the 75-Ghat Initiative</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#2D241E] mb-8">Help Preserve 2,525 km of Heritage</h3>
          <p className="text-[#5A4B3F] max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
            Directly fund artisan livelihoods, volunteer in monthly plastic cleanups, or host digital heritage archives to ensure Ganga's culture thrives.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#E8DCC4] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(45,36,30,0.1)] hover:border-[#D4A373]/50 flex flex-col justify-between h-full">
              <div>
                <HandHelping className="mx-auto text-[#D4A373] mb-6" size={48} />
                <h4 className="text-2xl font-bold mb-4 text-[#2D241E]">Volunteer</h4>
                <p className="text-[#5A4B3F] mb-8 text-sm leading-relaxed">Preservation workshops to school children.</p>
              </div>
              <button className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest hover:underline mt-auto">Register as Volunteer</button>
            </div>
            <div className="bg-gradient-to-br from-[#3A7CA5] to-[#2F668A] p-10 rounded-3xl shadow-xl text-white transform md:scale-105 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_25px_55px_rgba(58,124,165,0.3)] flex flex-col justify-between h-full">
              <div>
                <Heart className="mx-auto text-white mb-6 animate-pulse" size={48} fill="white" />
                <h4 className="text-2xl font-bold mb-4">Direct Support</h4>
                <p className="text-white/80 mb-8 text-sm leading-relaxed">Cleaning supplies for riverbed teams.</p>
              </div>
              <button className="bg-white text-[#3A7CA5] px-8 py-3 rounded-full font-bold hover:bg-[#F4EDDE] transition-all mt-auto self-center">Fund a Family</button>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#E8DCC4] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(45,36,30,0.1)] hover:border-[#D4A373]/50 flex flex-col justify-between h-full">
              <div>
                <Globe className="mx-auto text-[#3A7CA5] mb-6" size={48} />
                <h4 className="text-2xl font-bold mb-4 text-[#2D241E]">Share Heritage</h4>
                <p className="text-[#5A4B3F] mb-8 text-sm leading-relaxed">Download our open-access digital heritage kit containing 75 high-res photos and maps to share with your network.</p>
              </div>
              <button className="text-[#3A7CA5] font-black text-xs uppercase tracking-widest hover:underline mt-auto">Download Kit</button>
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
                
                <div className="mt-12 pt-8 border-t border-[#E8DCC4] flex justify-between items-center">
                  <p className="text-xs text-[#A8988A] italic">Part of the 75 Heritage Places initiative.</p>
                  <button className="bg-[#3A7CA5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2F668A] transition-all">Plan Visit</button>
                </div>
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
              <h5 className="font-bold mb-6 text-[#D4A373]">Ganga Network</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">75 Places Trail</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-[#D4A373]">Connect</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Volunteer Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 uppercase tracking-widest font-bold">
            <p>© 2026 Mother Ganga Heritage Preservation. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTA for Mobile */}
      {(!showCheckout && !showAllPlaces) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-[#E8DCC4] p-4 md:hidden pb-safe">
          <button 
            onClick={goToCheckout} 
            className="w-full bg-[#3A7CA5] text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <ShoppingBag size={20} /> Buy the Book Now
          </button>
        </div>
      )}
    </div>
  );
}

function BookSlider({ compact = false }: { compact?: boolean }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = bookSliderSlides[activeSlide];
  const hasMultipleSlides = bookSliderSlides.length > 1;

  return (
    <div className={compact ? 'book-slider compact' : 'book-slider'}>
      <div className="book-slider-frame">
        <img src={slide.image} alt="Ganga Tiram Heritage Collection Printed Book" />
        <div className="book-slider-caption">
          <span>Heritage Book</span>
          <h3>{slide.title}</h3>
          {!compact && <p>{slide.subtitle}</p>}
        </div>
      </div>

      <div className="book-slider-controls">
        <button
          type="button"
          disabled={!hasMultipleSlides}
          onClick={() => setActiveSlide((activeSlide - 1 + bookSliderSlides.length) % bookSliderSlides.length)}
          aria-label="Previous book image"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="book-slider-dots">
          {bookSliderSlides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={index === activeSlide ? 'active' : ''}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${item.title}`}
            />
          ))}
        </div>
        <button
          type="button"
          disabled={!hasMultipleSlides}
          onClick={() => setActiveSlide((activeSlide + 1) % bookSliderSlides.length)}
          aria-label="Next book image"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

