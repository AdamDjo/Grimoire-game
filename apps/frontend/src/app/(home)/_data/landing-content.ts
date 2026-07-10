export const LANDING_NAV_LINKS = [
  { label: 'Velkhar', href: '#velkhar' },
  { label: 'Mémoire', href: '#gameplay' },
  { label: 'Auberge', href: '#outro' },
] as const

export const LANDING_AUTH_LINK = { label: 'Connexion', href: '/login' } as const

export const LANDING_FOOTER_LINKS = [
  { label: 'Discord', href: null, external: true },
  { label: 'GitHub', href: 'https://github.com/AdamDjo/Grimoire-game', external: true },
  { label: 'Contact', href: 'mailto:adem.benmessaoud.dev@gmail.com', external: false },
] as const

// À remplacer par le profil créateur dès que son URL Buy Me a Coffee est créée.
export const LANDING_SUPPORT_LINK = {
  label: 'Buy me a coffee',
  href: 'https://www.buymeacoffee.com/',
} as const

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

export const HERO_COPY = {
  eyebrow: 'Roguelike narratif solo · l’Aveugle, une IA, mène la partie',
  titleLines: ['ÉCRIS TON', 'HISTOIRE'],
  body: [
    'Tu écris ce que tu fais. Une IA raconte la suite, et un monde qui se souvient.',
    'Chaque partie est une histoire unique. Aucune ne se ressemble.',
  ],
  primaryCta: 'Commencer une partie',
  secondaryCta: 'Voir le gameplay',
  scrollHint: 'Défiler',
} as const

export const GAMEPLAY_CARDS = [
  {
    index: '1',
    title: 'Ton action',
    body: 'Je tends la main vers la porte scellée.',
    tone: 'gold',
  },
  {
    index: '2',
    title: 'Le jet de dé',
    accent: 'Jet de SOUFFLE',
    body: ' (ta finesse, ta perception) — réussite partielle : la porte cède, mais quelque chose t’a entendu.',
    tone: 'soul',
  },
  {
    index: '3',
    title: 'La conséquence, gardée',
    body: 'Plus tard, un PNJ se souviendra que tu es passé par là. Rien ne s’efface.',
    tone: 'ash',
  },
] as const

export const GAMEPLAY_COPY = {
  label: 'Gameplay',
  titleLines: ["Ce n'est pas", 'une cinématique.', "C'est ta partie."],
  body: [
    'Tu écris ce que ton personnage tente — en toutes lettres.',
    'Aux moments décisifs, un dé (d20, comme au jeu de rôle) tranche : réussite, échec, ou entre-deux.',
    'Et le monde retient ce que tu as fait — pour la suite de l’histoire.',
  ],
  cta: 'Tester le seuil',
} as const

export const GAMEPLAY_STATS = [
  { label: 'Sang', value: '3/6', filled: 3, tone: 'blood' },
  { label: 'Souffle', value: '4/6', filled: 4, tone: 'soul' },
  { label: 'Cendre', value: '2/6', filled: 2, tone: 'ash' },
] as const

export const GAMEPLAY_STATS_CAPTION =
  'Tes trois ressources. Elles montent et descendent selon ce que tu oses.'

export const WORLD_COPY = {
  label: 'Le monde',
  titleLines: ['Même monde.', 'Mille histoires.'],
  body: 'Velkhar se souvient de tout. L’Aveugle — l’IA qui te sert de maître du jeu — improvise avec toi, mais rien de ce que tu fais ne s’efface.',
  pillars: [
    {
      label: 'Un monde qui retient',
      body: 'L’Aveugle garde la mémoire de chaque partie : tes serments, tes trahisons, tes morts.',
    },
    {
      label: 'Rejouable à l’infini',
      body: '3 à 15 h par run. À la fin, ta Chronique. Puis tu recommences, autrement.',
    },
  ],
} as const

export const OUTRO_COPY = {
  quote: ['A la fin,', 'il ne reste que ce dont', 'on se souvient.'],
  title: 'L’Aveugle t’attend.',
  body: 'Une partie solo, gratuite le temps de la bêta. Tu donnes un nom, tu choisis une vocation — et l’histoire commence.',
  cta: 'Rentrer dans l’auberge',
} as const
