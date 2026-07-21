import type { GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'
import type { UiLocale } from '@/i18n/config'

export type AveugleTopicId = 'salt-guild' | 'calcines' | 'artifact'
export type AveugleOmenId = 'follow-smoke' | 'avoid-bells'
export type AveugleMemoryId = 'vane-night' | 'salt-oath' | 'archon-dream'

interface LocalizedValue {
  en: string
  fr: string
}

interface LocalizedTopic {
  id: AveugleTopicId
  icon: GameIconName
  label: LocalizedValue
  response: LocalizedValue
  followUp: LocalizedValue
  isNew?: boolean
}

interface LocalizedMemory {
  id: AveugleMemoryId
  icon: GameIconName
  title: LocalizedValue
  response: LocalizedValue
  isNew?: boolean
}

interface LocalizedOmen {
  id: AveugleOmenId
  icon: GameIconName
  label: LocalizedValue
  effect: LocalizedValue
  response: LocalizedValue
}

export interface AveugleTopic {
  id: AveugleTopicId
  icon: GameIconName
  label: string
  response: string
  followUp: string
  isNew?: boolean
}

export interface AveugleMemory {
  id: AveugleMemoryId
  icon: GameIconName
  title: string
  response: string
  isNew?: boolean
}

export interface AveugleOmen {
  id: AveugleOmenId
  icon: GameIconName
  label: string
  effect: string
  response: string
}

const TOPICS: LocalizedTopic[] = [
  {
    id: 'salt-guild',
    icon: 'dialogue',
    label: { en: 'The Salt Guild', fr: 'La Guilde du Sel' },
    response: {
      en: 'The Guild does not own the roads. It owns the debts.',
      fr: 'La Guilde ne possède pas les routes. Elle possède les dettes.',
    },
    followUp: {
      en: 'Every favor becomes a chain. Choose carefully which one you agree to carry.',
      fr: 'Chaque faveur devient une chaîne. Choisis bien celle que tu acceptes de porter.',
    },
  },
  {
    id: 'calcines',
    icon: 'memory',
    label: { en: 'The Calcined Ones', fr: 'Les Calcinés' },
    response: {
      en: 'The Calcined Ones no longer listen to Ash. They answer it.',
      fr: 'Les Calcinés n’écoutent plus la Cendre. Ils lui répondent.',
    },
    followUp: {
      en: 'When Ash speaks your name, never answer twice.',
      fr: 'Quand la Cendre prononce ton nom, ne réponds jamais deux fois.',
    },
    isNew: true,
  },
  {
    id: 'artifact',
    icon: 'artifact',
    label: { en: 'My artifact', fr: 'Mon artefact' },
    response: {
      en: 'That warmth does not come from the fire. Hide it from Tissan’s guards.',
      fr: 'Cette chaleur ne vient pas du feu. Cache-le aux gardes de Tissan.',
    },
    followUp: {
      en: 'It remembers the hand that forged it. That hand may still be looking for you.',
      fr: 'Il se souvient de la main qui l’a forgé. Cette main te cherche peut-être encore.',
    },
  },
]

const MEMORIES: LocalizedMemory[] = [
  {
    id: 'vane-night',
    icon: 'moon',
    title: { en: 'The night of Vane', fr: 'La nuit de Vane' },
    response: {
      en: 'You spared him that night. His silence still travels with you.',
      fr: 'Tu l’as épargné cette nuit-là. Son silence voyage encore avec toi.',
    },
    isNew: true,
  },
  {
    id: 'salt-oath',
    icon: 'scroll',
    title: { en: 'The Salt oath', fr: 'Le serment du Sel' },
    response: {
      en: 'Salt forgets no oath. Not even those their maker would rather silence.',
      fr: 'Le Sel n’oublie aucun serment. Même ceux que leur auteur préfère taire.',
    },
  },
  {
    id: 'archon-dream',
    icon: 'eye',
    title: { en: 'The Archonic dream', fr: 'Le rêve archonique' },
    response: {
      en: 'That dream did not come from you. Something was seeking your gaze.',
      fr: 'Ce rêve ne venait pas de toi. Quelque chose cherchait ton regard.',
    },
  },
]

const OMENS: LocalizedOmen[] = [
  {
    id: 'follow-smoke',
    icon: 'wind',
    label: { en: 'Follow the smoke', fr: 'Suivre la fumée' },
    effect: {
      en: 'A hidden encounter may appear during the next run.',
      fr: 'Une rencontre cachée pourra apparaître pendant le prochain run.',
    },
    response: {
      en: 'Smoke sometimes reveals what the road wished to keep secret.',
      fr: 'La fumée révèle parfois ce que la route voulait garder secret.',
    },
  },
  {
    id: 'avoid-bells',
    icon: 'warning',
    label: { en: 'Avoid the bells', fr: 'Éviter les cloches' },
    effect: {
      en: 'The first threat of the next run will be announced more clearly.',
      fr: 'La première menace du prochain run sera annoncée plus clairement.',
    },
    response: {
      en: 'Bells warn the living. They call the rest as well.',
      fr: 'Les cloches préviennent les vivants. Elles appellent aussi le reste.',
    },
  },
]

export function getAveugleTopics(locale: UiLocale): AveugleTopic[] {
  return TOPICS.map((topic) => ({
    ...topic,
    followUp: topic.followUp[locale],
    label: topic.label[locale],
    response: topic.response[locale],
  }))
}

export function getAveugleMemories(locale: UiLocale): AveugleMemory[] {
  return MEMORIES.map((memory) => ({
    ...memory,
    response: memory.response[locale],
    title: memory.title[locale],
  }))
}

export function getAveugleOmens(locale: UiLocale): AveugleOmen[] {
  return OMENS.map((omen) => ({
    ...omen,
    effect: omen.effect[locale],
    label: omen.label[locale],
    response: omen.response[locale],
  }))
}
