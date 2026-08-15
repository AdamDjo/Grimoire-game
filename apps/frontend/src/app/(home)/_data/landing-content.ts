export const LANDING_FOOTER_LINKS = [
  { label: 'Discord', href: null, external: true },
  { label: 'GitHub', href: 'https://github.com/AdamDjo/Grimoire-game', external: true },
  { label: 'Contact', href: 'mailto:adem.benmessaoud.dev@gmail.com', external: false },
] as const

// À remplacer par le profil créateur dès que son URL Buy Me a Coffee est créée.
export const LANDING_SUPPORT_LINK = 'https://www.buymeacoffee.com/'

export const LANDING_MEDIA = {
  heroPlate: '/landing/plates/new-hero.png',
  heroPlateWebp: '/landing/plates/new-hero.webp',
  heroIdleVideo: '/landing/video/hero-ambient.mp4',
  heroFrames: '/landing/frames/hero-gameplay',
  heroFrameCount: 96,
  heroScrubLength: 140,
  gameplayPlate: '/landing/plates/new-gameplay.jpg',
  gameplayPlateWebp: '/landing/plates/new-gameplay.webp',
  gameplayVideo: null,
  castlePlate: '/landing/plates/Castle.jpg',
  outroPlate: '/landing/plates/plate-03-auberge-clean.png',
  outroPlateWebp: '/landing/plates/plate-03-auberge-clean.webp',
  outroVideo: null,
} as const

export const GAMEPLAY_STATS = [
  { labelKey: 'blood', value: '3/6', filled: 3, tone: 'blood' },
  { labelKey: 'breath', value: '4/6', filled: 4, tone: 'soul' },
  { labelKey: 'will', value: '2/6', filled: 2, tone: 'ash' },
] as const
