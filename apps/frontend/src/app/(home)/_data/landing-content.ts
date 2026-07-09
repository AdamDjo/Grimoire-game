export const LANDING_NAV_LINKS = [
  { label: 'Velkhar', href: '#velkhar' },
  { label: 'Mémoire', href: '#gameplay' },
  { label: 'Auberge', href: '#auberge' },
] as const

export const LANDING_MEDIA = {
  heroPlate: '/landing/plates/new-hero.png',
  heroPlateWebp: '/landing/plates/new-hero.webp',
  heroIdleVideo: '/landing/video/hero-ambient.mp4',
  heroFrames: '/landing/frames/hero-gameplay',
  heroFrameCount: 96,
  heroScrubLength: 260,
  gameplayPlate: '/landing/plates/new-gameplay.jpg',
  gameplayPlateWebp: '/landing/plates/new-gameplay.webp',
  gameplayVideo: null,
  aubergePlate: '/landing/plates/plate-03-auberge-clean.png',
  aubergePlateWebp: '/landing/plates/plate-03-auberge-clean.webp',
  aubergeVideo: null,
  quillFrames: '/landing/frames/quill-map',
  quillFrameCount: 0,
  quillFallback: '/landing/transitions/quill-map-transition.webp',
} as const

export const HERO_COPY = {
  eyebrow: 'Un monde qui se souvient.',
  titleLines: ['ÉCRIS TON', 'HISTOIRE'],
  body: ['Agis librement. Le Maître du Jeu répond.', 'Velkhar garde les traces.'],
  primaryCta: 'Entrer dans l’auberge',
  secondaryCta: 'Voir le gameplay',
  scrollHint: 'Défiler',
} as const

export const GAMEPLAY_CARDS = [
  {
    index: '1',
    title: 'Action du joueur',
    body: 'Je tends la main vers la porte scellée.',
    tone: 'gold',
  },
  {
    index: '2',
    title: 'Résolution',
    body: 'SOUFFLE d20 · réussite partielle',
    tone: 'soul',
  },
  {
    index: '3',
    title: 'Mémoire du monde',
    body: 'L’Aveugle se souvient de ton serment.',
    tone: 'ash',
  },
] as const

export const GAMEPLAY_COPY = {
  section: 'Section 2/3',
  label: 'Gameplay',
  titleLines: ["Ce n'est pas", 'une cinématique.', "C'est ta partie."],
  body: [
    'Tu écris une action libre.',
    'Les dés tranchent les pivots.',
    'Le monde garde la conséquence.',
  ],
  cta: 'Tester le seuil',
} as const

export const GAMEPLAY_STATS = [
  { label: 'Sang', value: '3/6', filled: 3, tone: 'blood' },
  { label: 'Souffle', value: '4/6', filled: 4, tone: 'soul' },
  { label: 'Cendre', value: '2/6', filled: 2, tone: 'ash' },
] as const

export const AUBERGE_COPY = {
  quote: ['A la fin,', 'il ne reste que ce dont', 'on se souvient.'],
  title: 'L’Aveugle t’attend.',
  body: 'Entre, donne ton nom, et laisse Velkhar répondre.',
  cta: 'Commencer la partie',
  footerLinks: ['Discord', 'FAQ', 'Mentions'],
} as const
