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

export const SECTION_IDS = ['hero', 'cendres', 'artefact', 'nuit', 'auberge'] as const

/**
 * Phrases kinetic révélées char-by-char (KineticText) au centre de chaque
 * tableau cinématique. Une phrase par section, canon Velkhar.
 */
export const KINETIC_LINES = {
  cendres: 'Ici, le silence a la couleur de l’or.',
  artefact: 'Les Archontes ont laissé des mots dans la pierre.',
  nuit: 'Le vent porte une odeur de feu.',
} as const

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
    title: 'Velkhar',
    description:
      'Velkhar n’est pas une carte. C’est un désert qui se souvient des âmes qui le traversent.',
  },
  {
    eyebrow: 'II',
    title: 'Les Visages',
    description:
      'Chaque visage porte une Calamine. Chaque PNJ se souvient de ce que tu lui as dit — et te le rendra, un jour.',
  },
  {
    eyebrow: 'III',
    title: 'Les Cendres',
    description:
      'Tes choix ne s’effacent pas. Ils deviennent rumeur, serment, malédiction. Les Cendres gardent tout.',
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

/**
 * Paliers du carrousel de texte du hero (auto en boucle).
 * Textes diégétiques canon Velkhar (cf. docs/02-design/GAME_DESIGN.md) :
 * 1) l'invitation · 2) la menace (la Brume Dorée) · 3) le poids des choix.
 */
export const HERO_SLIDES = [
  {
    tagline: 'Un monde. Des Cendres. Un million de destins.',
    title: 'ÉCRIS TON HISTOIRE',
    description:
      'Un monde vivant. Des visages qui se souviennent. Des conséquences qui traversent le temps.',
  },
  {
    tagline: "Aux Cendres de Velkhar, l'or brûle encore.",
    title: "L'OR AVANCE",
    description:
      'La Brume Dorée dévore les caravanes tandis que les vivants s’accrochent. Chaque heure a un prix. Chaque silence en réclame un autre.',
  },
  {
    tagline: 'Ici, nul dieu ne vient te sauver.',
    title: "RIEN NE S'OUBLIE",
    description:
      'Un serment qu’on n’oublie pas. Une main qui revient. Le monde garde mémoire de tes pas — et te répond, longtemps après.',
  },
] as const

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
