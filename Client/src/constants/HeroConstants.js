/**
 * FDT Estate — Hero design tokens & static data (v2 — Arabic/RTL native)
 *
 * Palette is unchanged from v1 (add to tailwind.config.js if you want named
 * utilities — components use arbitrary values so they work with zero config):
 *
 *   ink        #090B10   base background
 *   panel      #10141C   raised surfaces / glass panels
 *   grid       #4E79FF   blueprint gridlines (used at 6-8% opacity only)
 *   brass      #C9A227   primary luxury accent
 *   brassLight #E8C766   accent hover / glow
 *   bone       #F3F1EC   primary text on dark
 *
 * Type (v2 — Arabic-first):
 *   display  'Alexandria'          — headline only, 600 weight
 *   body     'IBM Plex Sans Arabic'— UI, nav, paragraphs
 *   mono     'JetBrains Mono'      — numerals only (wrapped dir="ltr")
 *
 * Add once, in index.html <head>:
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 */

import { Home, Building2, Landmark, Waves } from "lucide-react";
import { ShieldCheck, BadgeCheck, Sparkles, Lock, Gem } from "lucide-react";

export const NAV_LINKS = [
  { label: "الرئيسية", href: "#home" },
  { label: "المميزات", href: "#features" },
  { label: "من نحن", href: "#about" },
  { label: "تواصل معنا", href: "#contact" },
];

export const COPY = {
  eyebrow: "شبكة عقارية ذكية",
  headlineLine1: "بدقة الخريطة،",
  headlineLine2: "وثقة السوق.",
  description:
    "استكشف عقارات موثّقة في أرقى المناطق المصرية، بمساعدة بحث ذكي يفهم ما تبحث عنه بدقة.",
  ctaPrimary: "استكشف العقارات",
  ctaSecondary: "شاهد كيف تعمل المنصة",
  logoPrefix: "FDT",
  logoSuffix: "Estate",
};

// Stylized node positions live on a 400x520 SVG canvas (see HeroVisual).
// These are schematic coordinates for a decorative network map, not
// geographic data — do not use for anything requiring real accuracy.
// `listing` powers the floating Property Preview card on selection.
export const CITIES = [
  {
    id: "cairo",
    name: "القاهرة",
    x: 215,
    y: 270,
    isHub: true,
    listing: {
      title: "شقة بانورامية",
      bedrooms: 3,
      area: 210,
      priceM: 6.2,
      verified: true,
    },
  },
  {
    id: "sheikh-zayed",
    name: "الشيخ زايد",
    x: 105,
    y: 245,
    listing: {
      title: "فيلا فاخرة",
      bedrooms: 4,
      area: 560,
      priceM: 14.5,
      verified: true,
    },
  },
  {
    id: "fifth-settlement",
    name: "التجمع الخامس",
    x: 300,
    y: 250,
    listing: {
      title: "تاون هاوس",
      bedrooms: 4,
      area: 380,
      priceM: 9.8,
      verified: true,
    },
  },
  {
    id: "new-capital",
    name: "العاصمة الإدارية",
    x: 345,
    y: 288,
    listing: {
      title: "شقة إدارية فاخرة",
      bedrooms: 3,
      area: 195,
      priceM: 5.4,
      verified: true,
    },
  },
  {
    id: "north-coast",
    name: "الساحل الشمالي",
    x: 140,
    y: 72,
    icon: Waves,
    listing: {
      title: "شاليه على البحر",
      bedrooms: 3,
      area: 140,
      priceM: 7.9,
      verified: true,
    },
  },
  {
    id: "ain-sokhna",
    name: "العين السخنة",
    x: 305,
    y: 400,
    icon: Waves,
    listing: {
      title: "شاليه خاص",
      bedrooms: 2,
      area: 120,
      priceM: 4.6,
      verified: true,
    },
  },
  {
    id: "alexandria",
    name: "الإسكندرية",
    x: 55,
    y: 62,
    icon: Waves,
    listing: {
      title: "شقة إطلالة بحرية",
      bedrooms: 3,
      area: 175,
      priceM: 5.9,
      verified: true,
    },
  },
];

export const PROPERTY_TYPES = [
  { id: "apartment", label: "شقة", icon: Building2 },
  { id: "villa", label: "فيلا", icon: Home },
  { id: "chalet", label: "شاليه", icon: Waves },
  { id: "commercial", label: "تجاري", icon: Landmark },
];

export const BUDGET_RANGES = [
  { id: "under-3m", label: "أقل من 3 مليون" },
  { id: "3m-6m", label: "3 – 6 مليون" },
  { id: "6m-12m", label: "6 – 12 مليون" },
  { id: "12m-plus", label: "أكثر من 12 مليون" },
];

// Rotating example queries for the Zen AI search hint.
export const AI_SEARCH_EXAMPLES = [
  "فيلا 4 غرف قريبة من التجمع الخامس بأقل من 6 مليون",
  "شقة بإطلالة بحرية في الساحل الشمالي",
  "شاليه للإيجار في العين السخنة هذا الصيف",
];

export const TRUST_INDICATORS = [
  { id: "verified", label: "عقارات موثّقة", icon: BadgeCheck },
  { id: "agencies", label: "وكالات موثوقة", icon: ShieldCheck },
  { id: "ai", label: "مدعوم بالذكاء الاصطناعي", icon: Sparkles },
  { id: "secure", label: "منصة آمنة", icon: Lock },
  { id: "premium", label: "عقارات فاخرة", icon: Gem },
];

export const HERO_STATS = [
  { id: "properties", value: 12400, suffix: "+", label: "عقار متاح" },
  { id: "cities", value: 18, suffix: "", label: "مدينة" },
  { id: "agencies", value: 340, suffix: "+", label: "وكالة موثقة" },
  { id: "clients", value: 27000, suffix: "+", label: "عميل" },
];