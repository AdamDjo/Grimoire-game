import {
  BookOpen,
  Users,
  MapPin,
  Globe,
  Sword,
  Star,
  Feather,
  ShoppingBag,
  HelpCircle,
} from 'lucide-react'

import type { Variants } from 'framer-motion'

export const HERO_IMG = '/illustration-hero.png'
export const MAP_IMG = '/map.jpeg'
export const GRIMOIRE_IMG =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80&auto=format&fit=crop'

export const PORTRAITS = [
  {
    id: 1,
    role: 'Guerrier',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&crop=face',
  },
  {
    id: 2,
    role: 'Mage',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&fit=crop&crop=face',
  },
  {
    id: 3,
    role: 'Rôdeur',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop&crop=face',
  },
  {
    id: 4,
    role: 'Poète',
    img: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&q=80&fit=crop&crop=face',
  },
  {
    id: 5,
    role: 'Négociant',
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80&fit=crop&crop=face',
  },
  {
    id: 6,
    role: 'Cupidon',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&fit=crop&crop=face',
  },
  {
    id: 7,
    role: 'Voleur',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&fit=crop&crop=face',
  },
  {
    id: 8,
    role: 'Alchimiste',
    img: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=200&q=80&fit=crop&crop=face',
  },
] as const

export const ROLES = [
  { icon: Sword, label: 'Cupidon' },
  { icon: Star, label: 'Mage' },
  { icon: Feather, label: 'Voleur' },
  { icon: BookOpen, label: 'Poète' },
  { icon: ShoppingBag, label: 'Négociant' },
  { icon: HelpCircle, label: 'Autre' },
] as const

export const UNIVERS_PILLS = [
  { icon: BookOpen, label: 'Histoire' },
  { icon: Users, label: 'Factions' },
  { icon: MapPin, label: 'Lieux' },
  { icon: Globe, label: 'Cultures' },
] as const

export const MAP_LABELS = [
  { label: 'NORDALIS', top: '8%', left: '52%' },
  { label: 'FORGOTTEN\nLANDS', top: '22%', left: '68%' },
  { label: 'FURELIA', top: '42%', left: '42%' },
  { label: 'EASTERN\nREALMS', top: '46%', left: '72%' },
  { label: 'SEA OF FOAM', top: '60%', left: '52%' },
  { label: 'SANDS OF ORION', top: '78%', left: '55%' },
] as const

export const NAV_LINKS = ['Accueil', 'Univers', 'Règles', 'Communauté', 'FAQ'] as const

export const SECTION_IDS = ['hero', 'univers', 'personnage', 'communaute'] as const

export function generateParticles() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.2 + Math.random() * 2,
    dur: 4 + Math.random() * 7,
    delay: Math.random() * 8,
    opacity: 0.4 + Math.random() * 0.4,
  }))
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}
