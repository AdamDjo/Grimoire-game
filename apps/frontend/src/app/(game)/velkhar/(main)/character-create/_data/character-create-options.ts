import { PEOPLES, VOCATIONS } from '@velkhar/shared'

import type { UiLocale } from '@/i18n/config'

interface LocalizedValue {
  en: string
  fr: string
}

export interface CharacterPeopleOption {
  description: string
  effect: string
  id: string
  name: string
}

const ATTRIBUTE_LABELS: Record<string, LocalizedValue> = {
  blood: { en: 'Blood', fr: 'Sang' },
  breath: { en: 'Breath', fr: 'Souffle' },
  will: { en: 'Will', fr: 'Volonté' },
}

export interface CharacterVocationOption {
  description: string
  eyebrow: string
  guidance: string
  heroImageSrc: string
  id: string
  imageSrc: string
  name: string
  witness: {
    epithet: string
    meaning: string
    name: string
    story: string
  }
}

const VOCATION_GUIDANCE: Record<string, LocalizedValue> = {
  'salt-walker': {
    en: 'Choose this path to play a traveler who survives through knowledge of the desert, caravans and trade.',
    fr: 'Choisis cette voie si tu veux jouer un voyageur qui survit grâce à son expérience du désert, des caravanes et du commerce.',
  },
  'shadow-blade': {
    en: 'Choose this path for stealth, precision and secrets. A Shadow-Blade is not necessarily heartless.',
    fr: 'Choisis cette voie pour jouer la discrétion, la précision et les secrets. Une Lame-Ombre n’est pas forcément sans cœur.',
  },
  watcher: {
    en: 'Choose this path to explore ruins, study ancient objects and understand danger before acting.',
    fr: 'Choisis cette voie si tu veux explorer des ruines, étudier des objets anciens et comprendre le danger avant d’agir.',
  },
  'word-weaver': {
    en: 'Choose this path to approach Ash through words and knowledge. Its power is useful, but never without risk.',
    fr: 'Choisis cette voie pour approcher la Cendre par les mots et le savoir. Son pouvoir est utile, mais jamais sans risque.',
  },
}

const VOCATION_IMAGES: Record<string, string> = {
  'salt-walker': '/encre-de-sel/icons/vocations/marcheur-du-sel.webp',
  'shadow-blade': '/encre-de-sel/icons/vocations/lame-ombre.webp',
  watcher: '/encre-de-sel/icons/vocations/veilleur.webp',
  'word-weaver': '/encre-de-sel/icons/vocations/tisse-verbe.webp',
}

const VOCATION_HERO_IMAGES: Record<string, string> = {
  'salt-walker': '/encre-de-sel/character-create/amani-tousse-a-laube.webp',
  'shadow-blade': '/encre-de-sel/character-create/lame-ombre.webp',
  watcher: '/encre-de-sel/character-create/kael-le-muet.webp',
  'word-weaver': '/encre-de-sel/character-create/syr.webp',
}

const VOCATION_WITNESSES: Record<
  string,
  { epithet: LocalizedValue; meaning: LocalizedValue; name: string; story: LocalizedValue }
> = {
  'salt-walker': {
    epithet: { en: 'The Thirteen Names', fr: 'Les Treize Noms' },
    meaning: { en: 'She Who Coughs at Dawn', fr: 'Celle qui tousse à l’aube' },
    name: 'Amani Tousse-à-l’Aube',
    story: {
      en: 'Amani knows which wind carries water and which merchant hides Ash beneath their salt. Thirteen names are carved into her route-staff: the travelers she once failed to bring home.',
      fr: 'Amani sait quel vent porte l’eau et quel marchand cache de la Cendre sous son sel. Treize noms sont gravés sur son bâton de route : les voyageurs qu’elle n’a pas réussi à ramener.',
    },
  },
  'shadow-blade': {
    epithet: { en: 'The Silent Debt', fr: 'La Dette silencieuse' },
    meaning: { en: 'Zaynab of the Night', fr: 'Zaynab de la Nuit' },
    name: 'Zaynab al-Layl',
    story: {
      en: 'She returned twenty-seven completed contracts to the Shadow Hand. The twenty-eighth bore her own name. Since then, she travels with the blade meant to erase her.',
      fr: 'Elle a rendu vingt-sept contrats à la Main d’Ombre. Le vingt-huitième portait son propre nom. Depuis, elle voyage avec la lame qui devait l’effacer.',
    },
  },
  watcher: {
    epithet: { en: 'The One Who Listens to Stone', fr: 'Celui qui écoute la pierre' },
    meaning: { en: 'The Silent One of the Fingers', fr: 'Le Muet des Doigts' },
    name: 'Kael le Muet',
    story: {
      en: 'Kael never speaks. He draws his warnings in the dust, studies every mechanism twice and leaves an open handprint on ruins that must never be entered.',
      fr: 'Kael ne parle jamais. Il dessine ses avertissements dans la poussière, étudie deux fois chaque mécanisme et laisse une main ouverte sur les ruines où personne ne doit entrer.',
    },
  },
  'word-weaver': {
    epithet: { en: 'The Ash-Bearer', fr: 'La Porte-Cendre' },
    meaning: { en: 'Syr of the Gray Veins', fr: 'Syr aux Veines grises' },
    name: 'Syr',
    story: {
      en: 'Syr awakened an Archon blade by offering it a sentence instead of an order. Since then, the metal obeys, but every spoken word draws another gray vein beneath the skin.',
      fr: 'Syr a éveillé une lame archonte en lui offrant une phrase plutôt qu’un ordre. Depuis, le métal obéit, mais chaque mot prononcé trace une nouvelle veine grise sous sa peau.',
    },
  },
}

const VOCATION_EYEBROWS: Record<string, LocalizedValue> = {
  'salt-walker': { en: 'Travel, survival, trade', fr: 'Voyage, survie, négoce' },
  'shadow-blade': { en: 'Stealth, contracts, secrets', fr: 'Discrétion, contrats, secrets' },
  watcher: { en: 'Ruins, artifacts, knowledge', fr: 'Ruines, artefacts, savoir' },
  'word-weaver': { en: 'Ash, language, mastery', fr: 'Cendre, langage, maîtrise' },
}

const DEFAULT_VOCATION_EYEBROW: LocalizedValue = {
  en: 'A path of Velkhar',
  fr: 'Voie de Velkhar',
}

export function getCharacterPeopleOptions(locale: UiLocale): CharacterPeopleOption[] {
  return PEOPLES.map((people) => ({
    description: people.description[locale],
    effect: Object.entries(people.attributeBonus)
      .map(([attribute, value]) => {
        const label = ATTRIBUTE_LABELS[attribute]?.[locale] ?? attribute
        return `${label} ${value >= 0 ? '+' : ''}${value}`
      })
      .join(', '),
    id: people.id,
    name: people.name[locale],
  }))
}

export function getCharacterVocationOptions(locale: UiLocale): CharacterVocationOption[] {
  return VOCATIONS.map((vocation) => ({
    description: vocation.description[locale],
    eyebrow: (VOCATION_EYEBROWS[vocation.id] ?? DEFAULT_VOCATION_EYEBROW)[locale],
    guidance: (VOCATION_GUIDANCE[vocation.id] ?? vocation.description)[locale],
    heroImageSrc:
      VOCATION_HERO_IMAGES[vocation.id] ?? '/encre-de-sel/character-create/veilleur.webp',
    id: vocation.id,
    imageSrc: VOCATION_IMAGES[vocation.id] ?? '/encre-de-sel/icons/vocations/veilleur.webp',
    name: vocation.name[locale],
    witness: {
      epithet: VOCATION_WITNESSES[vocation.id]?.epithet[locale] ?? vocation.name[locale],
      meaning: VOCATION_WITNESSES[vocation.id]?.meaning[locale] ?? vocation.name[locale],
      name: VOCATION_WITNESSES[vocation.id]?.name ?? vocation.name[locale],
      story: VOCATION_WITNESSES[vocation.id]?.story[locale] ?? vocation.description[locale],
    },
  }))
}

export function getPeopleOption(id: string, locale: UiLocale): CharacterPeopleOption | undefined {
  return getCharacterPeopleOptions(locale).find((people) => people.id === id)
}

export function getVocationOption(
  id: string,
  locale: UiLocale
): CharacterVocationOption | undefined {
  return getCharacterVocationOptions(locale).find((vocation) => vocation.id === id)
}
