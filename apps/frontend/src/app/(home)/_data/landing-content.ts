export const LANDING_NAV_LINKS = [
  { label: 'Découvrir', href: '#velkhar' },
  { label: 'Chroniques', href: '/dashboard' },
  { label: 'L’Auberge', href: '/velkhar/aveugle?transition=home' },
] as const

export const LANDING_AUTH_LINK = { label: 'Se connecter', href: '/login' } as const

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
  eyebrow: 'Roguelike narratif solo · guidé par L’Aveugle, une IA maîtresse du jeu',
  titleLines: ['ÉCRIS TON', 'HISTOIRE'],
  body: [
    'Tu décris chaque action. L’Aveugle improvise la suite, les règles tranchent et Velkhar se souvient.',
    'Chaque partie devient une histoire unique dont les conséquences persistent.',
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
    title: 'L’Aveugle répond',
    accent: 'Jet de SOUFFLE · d20',
    body: 'Résultat 12 : réussite partielle. La porte cède, mais quelque chose t’a entendu.',
    tone: 'soul',
  },
  {
    index: '3',
    title: 'Le monde se souvient',
    body: 'Plus tard, un témoin te reconnaît. La porte ouverte est devenue un fait de ton histoire.',
    tone: 'ash',
  },
] as const

export const GAMEPLAY_COPY = {
  label: 'La partie',
  titleLines: ["Ce n'est pas", 'une cinématique.', "C'est ta partie."],
  body: [
    'Tu écris librement ce que ton personnage tente.',
    'L’Aveugle raconte la réaction du monde. Aux moments décisifs, un d20 décide de la réussite, de l’échec ou d’un entre-deux.',
    'Chaque résultat devient un fait que Velkhar peut rappeler plus tard.',
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
  body: 'Velkhar se souvient de tout. L’Aveugle improvise chaque scène à partir de tes choix ; les règles tranchent et les conséquences restent.',
  pillars: [
    {
      label: 'Un monde qui retient',
      body: 'L’Aveugle garde la mémoire de chaque partie : tes serments, tes trahisons, tes morts.',
    },
    {
      label: 'Rejouable à l’infini',
      body: 'Une traversée dure 45 à 70 min pendant la bêta. À la fin, ta Chronique. Puis tu recommences, autrement.',
    },
  ],
} as const

export const OUTRO_COPY = {
  quote: ['À la fin,', 'il ne reste que ce dont', 'on se souvient.'],
  title: 'L’Aveugle t’attend.',
  body: 'Une partie solo, gratuite le temps de la bêta. Tu donnes un nom et choisis ta vocation, comme Marcheur-du-Sel ou Tisse-Verbe. Puis l’histoire commence.',
  cta: 'Rentrer dans l’auberge',
} as const
