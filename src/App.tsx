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
