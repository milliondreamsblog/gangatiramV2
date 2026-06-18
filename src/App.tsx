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
