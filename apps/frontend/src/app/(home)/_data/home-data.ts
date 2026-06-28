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

export const SECTION_IDS = ['hero', 'seuil', 'aveugle', 'pacte'] as const

/**
 * Manifeste révélé ligne par ligne dans Section2Seuil (mask-reveal scrubbé).
 * Typo Cinzel gradient gold, posé sur le fond cosmique.
 */
export const MANIFESTO_LINES = [
  'Aux Cendres de Valorain,',
  'là où les dieux se sont tus,',
  'un monde se souvient',
  'de chacun de tes pas.',
] as const

/**
 * Citations diégétiques posées en sous-titre cinéma au-dessus du diptyque
 * "l'aveugle" dans Section3Aveugle (paliers de scroll 0% / 40% / 80%).
 */
export const AVEUGLE_QUOTES = [
  {
    text: 'On ne choisit pas son rôle. On le devient.',
    align: 'left',
  },
  {
    text: 'Le sang séché est un serment qui ne s’efface pas.',
    align: 'right',
  },
  {
    text: 'À la fin, il ne reste que ce dont on se souvient.',
    align: 'left',
  },
] as const

/**
 * Piliers présentés en Section4Pacte — première rupture UI après le cinématique.
 */
export const PILLARS = [
  {
    eyebrow: 'I',
    title: 'Le Monde',
    description:
      'Valorain n’est pas une carte. C’est un théâtre de cendres qui se souvient des âmes qui le traversent.',
  },
  {
    eyebrow: 'II',
    title: 'Les Personnages',
    description:
      'Chaque visage porte un passé. Chaque PNJ se souvient de ce que tu lui as dit — et te le rendra, un jour.',
  },
  {
    eyebrow: 'III',
    title: 'La Mémoire',
    description:
      'Tes choix ne disparaissent pas. Ils deviennent légende, rumeur, malédiction. Le monde garde tout.',
  },
] as const

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

/**
 * Paliers du carrousel de texte du hero (auto en boucle).
 * Textes diégétiques tirés du lore Valorain (cf. docs/GAME_DESIGN.md) :
 * 1) l'invitation · 2) la menace (la Corruption) · 3) le poids des choix.
 */
export const HERO_SLIDES = [
  {
    tagline: 'Un monde. Des âmes. Une infinité de rôles.',
    title: 'ÉCRIS TON HISTOIRE',
    description:
      'Un monde vivant. Des personnages qui se souviennent. Des conséquences qui traversent le temps.',
  },
  {
    tagline: "Aux Cendres de Valorain, l'ombre avance.",
    title: "L'OMBRE AVANCE",
    description:
      'La Corruption ronge les villages tandis que les vivants hésitent. Chaque heure compte. Chaque silence se paie.',
  },
  {
    tagline: 'Ici, nul dieu ne vient te sauver.',
    title: "RIEN NE S'OUBLIE",
    description:
      'Un mensonge qu’on n’oublie pas. Un serment qui revient. Le monde garde mémoire de tes pas — et te répond, longtemps après.',
  },
] as const

/** Durée d'affichage de chaque palier du carrousel hero (ms). */
export const HERO_SLIDE_DURATION_MS = 5000

/**
 * Révélation « fondu + brume » d'un palier : le texte entre/sort avec un léger
 * flou qui se dissipe, cohérent avec le thème sable/cendres/gold.
 */
export const heroSlideReveal: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -18, filter: 'blur(8px)' },
}

export const FOOTER_LINKS = [
  { label: 'Mentions', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact', href: '#' },
] as const

export const SOCIAL_LINKS = [
  { key: 'discord', label: 'Discord', href: '#' },
  { key: 'twitter', label: 'Twitter / X', href: '#' },
  { key: 'instagram', label: 'Instagram', href: '#' },
] as const
