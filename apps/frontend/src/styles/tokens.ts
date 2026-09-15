/**
 * Encre de Sel — tokens, TypeScript mirror.
 *
 * The values live in CSS (`src/styles/tokens.css`); this file exposes their
 * *names* so TypeScript can autocomplete them and catch typos. Each entry is
 * the `var(--…)` expression, ready to drop into a style object or a GSAP tween.
 *
 *   import { color, motion } from '@/styles/tokens'
 *   gsap.to(el, { backgroundColor: color.gold, duration: seconds.ui })
 *
 * Never duplicate a raw value here: a hex written twice is a hex that will
 * eventually disagree with itself. If you need the computed value at runtime,
 * read it from the cascade with `getComputedStyle`.
 */

/** Palette brute — nommée par la matière, pas par l'usage. */
export const material = {
  inkBlack: 'var(--ink-black)',
  inkRaised: 'var(--ink-raised)',
  inkOnPaper: 'var(--ink-on-paper)',
  saltWhite: 'var(--salt-white)',
  saltMuted: 'var(--salt-muted)',
  gold: 'var(--material-gold)',
  goldBright: 'var(--material-gold-bright)',
  goldDim: 'var(--material-gold-dim)',
  freshBlood: 'var(--fresh-blood)',
  driedBlood: 'var(--dried-blood)',
  breathAqua: 'var(--breath-aqua)',
  hungerOchre: 'var(--hunger-ochre)',
  thirstSalt: 'var(--thirst-salt)',
  calamine: 'var(--calamine)',
} as const

/** Rôles sémantiques — ce qu'un composant doit consommer. */
export const color = {
  void: 'var(--void)',
  parchment: 'var(--parchment)',
  gold: 'var(--gold)',
  goldLight: 'var(--gold-light)',
  goldHover: 'var(--gold-hover)',
  goldDark: 'var(--gold-dark)',
  blood: 'var(--blood)',
  soul: 'var(--soul)',
  cendre: 'var(--cendre)',
  ink: 'var(--ink)',
  inkSoft: 'var(--ink-2)',
  inkManuscript: 'var(--ink-manuscript)',
} as const

/** Filets et bordures. */
export const line = {
  gold: 'var(--line-gold)',
  border: 'var(--border-gold)',
  readerBorder: 'var(--frame-reader-border)',
} as const

/** Piles de polices. */
export const font = {
  display: 'var(--font-display)',
  serif: 'var(--font-serif)',
  accent: 'var(--font-accent)',
  ui: 'var(--font-ui)',
  manuscript: 'var(--font-manuscript)',
  gameDisplay: 'var(--font-game-display)',
  gameHeading: 'var(--font-game-heading)',
  gameBody: 'var(--font-game-body)',
  gameUi: 'var(--font-game-ui)',
} as const

/** Échelle in-game (scènes, HUD, dialogues). */
export const textGame = {
  title: 'var(--text-game-title)',
  modalTitle: 'var(--text-game-modal-title)',
  heading: 'var(--text-game-heading)',
  section: 'var(--text-game-section)',
  lead: 'var(--text-game-lead)',
  quote: 'var(--text-game-quote)',
  body: 'var(--text-game-body)',
  bodySm: 'var(--text-game-body-sm)',
  label: 'var(--text-game-label)',
  caption: 'var(--text-game-caption)',
  micro: 'var(--text-game-micro)',
  kicker: 'var(--text-game-kicker)',
  statLabel: 'var(--text-game-stat-label)',
  statValue: 'var(--text-game-stat-value)',
  button: 'var(--text-game-button)',
  buttonSm: 'var(--text-game-button-sm)',
} as const

/** Échelle éditoriale (landing, pages marketing). */
export const text = {
  h1: 'var(--text-h1)',
  h2: 'var(--text-h2)',
  accroche: 'var(--text-accroche)',
  bodyEditorial: 'var(--text-body-editorial)',
  ui: 'var(--text-ui)',
  cardNum: 'var(--text-card-num)',
  cardTitle: 'var(--text-card-title)',
  cardManuscript: 'var(--text-card-manuscript)',
  statLabel: 'var(--text-stat-label)',
  statValue: 'var(--text-stat-value)',
  btnPrimary: 'var(--text-btn-primary)',
  btnSecondary: 'var(--text-btn-secondary)',
} as const

/**
 * Durées et courbes.
 *
 * `motion.*` sert en CSS (`transition: opacity var(--motion-ui)`).
 * `seconds.*` sert à GSAP, qui compte en secondes et n'accepte pas `var()`
 * pour une durée — c'est la seule duplication tolérée, gardée adjacente
 * pour qu'une divergence saute aux yeux.
 */
export const motion = {
  fast: 'var(--motion-fast)',
  ui: 'var(--motion-ui)',
  step: 'var(--motion-step)',
  page: 'var(--motion-page)',
} as const

export const seconds = {
  fast: 0.16,
  ui: 0.22,
  step: 0.28,
  page: 0.65,
} as const

export const ease = {
  /** Sortie franche puis repos long — la courbe par défaut du projet. */
  out: 'var(--ease-grimoire-out)',
  /** Entrée/sortie neutre, pour un déplacement qui ne doit pas se remarquer. */
  standard: 'var(--ease-grimoire-standard)',
} as const

/** Équivalents GSAP des courbes CSS ci-dessus (GSAP n'accepte pas `var()`). */
export const easeGsap = {
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
} as const

export const state = {
  focusRing: 'var(--focus-ring)',
} as const

/** États interactifs partagés. */
export const interaction = {
  linkHoverColor: 'var(--link-hover-color)',
  linkHoverShadow: 'var(--link-hover-shadow)',
  linkHoverTranslateX: 'var(--link-hover-translate-x)',
} as const

export type MaterialToken = keyof typeof material
export type ColorToken = keyof typeof color
export type FontToken = keyof typeof font
export type TextGameToken = keyof typeof textGame
export type TextToken = keyof typeof text
export type MotionToken = keyof typeof motion
export type EaseToken = keyof typeof ease
export type InteractionToken = keyof typeof interaction
