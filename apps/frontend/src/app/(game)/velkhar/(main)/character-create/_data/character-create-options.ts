import { PEOPLES, VOCATIONS } from '@grimoire/shared'

import type { GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'
import type { UiLocale } from '@/i18n/config'

interface LocalizedValue {
  en: string
  fr: string
}

export interface CharacterPeopleOption {
  description: string
  icon: GameIconName
  id: string
  name: string
}

export interface CharacterVocationOption {
  description: string
  eyebrow: string
  guidance: string
  id: string
  imageSrc: string
  name: string
}

export interface CharacterHistoryOption {
  id: string
  label: string
  values: LocalizedValue
}

const PEOPLE_ICONS: Record<string, GameIconName> = {
  sahelin: 'wind',
  rivain: 'coins',
  therien: 'shield',
  cendreur: 'fire',
  changepeau: 'moon',
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
  'salt-walker': '/characters/vocations/marcheur-du-sel.webp',
  'shadow-blade': '/characters/vocations/lame-ombre.webp',
  watcher: '/characters/vocations/veilleur.webp',
  'word-weaver': '/characters/vocations/tisse-verbe.webp',
}

const VOCATION_EYEBROWS: Record<string, LocalizedValue> = {
  'salt-walker': { en: 'Travel · survival · trade', fr: 'Voyage · survie · négoce' },
  'shadow-blade': { en: 'Stealth · contracts · secrets', fr: 'Discrétion · contrats · secrets' },
  watcher: { en: 'Ruins · artifacts · knowledge', fr: 'Ruines · artefacts · savoir' },
  'word-weaver': { en: 'Ash · language · mastery', fr: 'Cendre · langage · maîtrise' },
}

const DEFAULT_VOCATION_EYEBROW: LocalizedValue = {
  en: 'A path of Velkhar',
  fr: 'Voie de Velkhar',
}

/** Canonical fears from raw/05-VOCATIONS, translated without changing their meaning. */
const CHARACTER_HISTORY_VALUES: Record<string, { id: string; values: LocalizedValue }[]> = {
  'salt-walker': [
    {
      id: 'lost-caravan',
      values: {
        en: 'An entire caravan perished because of you.',
        fr: 'Une caravane entière a péri par ta faute.',
      },
    },
    {
      id: 'hospitality-debt',
      values: {
        en: 'A debt of hospitality was never honored.',
        fr: 'Une dette d’hospitalité n’a jamais été honorée.',
      },
    },
    {
      id: 'lost-relative',
      values: {
        en: 'You are still searching for someone lost in the desert.',
        fr: 'Tu cherches encore un proche perdu dans le désert.',
      },
    },
  ],
  'shadow-blade': [
    {
      id: 'surviving-target',
      values: {
        en: 'A target survived and is hunting you.',
        fr: 'Une cible a survécu et te traque.',
      },
    },
    {
      id: 'wrong-target',
      values: { en: 'You killed the wrong person.', fr: 'Tu as tué la mauvaise personne.' },
    },
    {
      id: 'mentor-betrayal',
      values: { en: 'Your former mentor betrayed you.', fr: 'Ton ancien mentor t’a trahi.' },
    },
  ],
  watcher: [
    {
      id: 'artifact-death',
      values: {
        en: 'An artifact killed one of your companions.',
        fr: 'Un artefact a tué l’un de tes compagnons.',
      },
    },
    {
      id: 'buried-partner',
      values: {
        en: 'A partner was left buried in a ruin.',
        fr: 'Un partenaire est resté enseveli dans une ruine.',
      },
    },
    {
      id: 'artifact-search',
      values: {
        en: 'You have searched for one particular artifact for years.',
        fr: 'Tu recherches un artefact précis depuis des années.',
      },
    },
  ],
  'word-weaver': [
    {
      id: 'calamine-progress',
      values: {
        en: 'Calamine is already spreading beneath your skin.',
        fr: 'La Calamine progresse déjà sous ta peau.',
      },
    },
    {
      id: 'inquisitor-witness',
      values: {
        en: 'An Inquisitor saw your gray hands.',
        fr: 'Un Inquisiteur a vu tes mains grises.',
      },
    },
    {
      id: 'artifact-accident',
      values: {
        en: 'An artifact beyond your control injured an innocent.',
        fr: 'Un artefact hors de contrôle a blessé un innocent.',
      },
    },
  ],
}

export function getCharacterPeopleOptions(locale: UiLocale): CharacterPeopleOption[] {
  return PEOPLES.map((people) => ({
    description: people.description[locale],
    icon: PEOPLE_ICONS[people.id] ?? 'stranger',
    id: people.id,
    name: people.name[locale],
  }))
}

export function getCharacterVocationOptions(locale: UiLocale): CharacterVocationOption[] {
  return VOCATIONS.map((vocation) => ({
    description: vocation.description[locale],
    eyebrow: (VOCATION_EYEBROWS[vocation.id] ?? DEFAULT_VOCATION_EYEBROW)[locale],
    guidance: (VOCATION_GUIDANCE[vocation.id] ?? vocation.description)[locale],
    id: vocation.id,
    imageSrc: VOCATION_IMAGES[vocation.id] ?? '/characters/vocations/veilleur.webp',
    name: vocation.name[locale],
  }))
}

export function getCharacterHistoryOptions(
  vocationId: string,
  locale: UiLocale
): CharacterHistoryOption[] {
  return (CHARACTER_HISTORY_VALUES[vocationId] ?? []).map((option) => ({
    ...option,
    label: option.values[locale],
  }))
}

export function getLocalizedHistoryValue(value: string, locale: UiLocale): string {
  for (const options of Object.values(CHARACTER_HISTORY_VALUES)) {
    const match = options.find((option) => option.values.en === value || option.values.fr === value)
    if (match) return match.values[locale]
  }
  return value
}

export function isHistoryOptionSelected(value: string, option: CharacterHistoryOption): boolean {
  return value === option.values.en || value === option.values.fr
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
