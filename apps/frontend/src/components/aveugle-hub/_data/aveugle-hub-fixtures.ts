import type { GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'

export type AveugleTopicId = 'salt-guild' | 'calcines' | 'artifact'
export type AveugleOmenId = 'follow-smoke' | 'avoid-bells'
export type AveugleMemoryId = 'vane-night' | 'salt-oath' | 'archon-dream'

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

export interface AveugleResource {
  icon: GameIconName
  label: string
  value: number
}

/** Scripted display fixtures until the read-only Auberge contract is available. */
export const AVEUGLE_TOPICS: AveugleTopic[] = [
  {
    id: 'salt-guild',
    icon: 'dialogue',
    label: 'La Guilde du Sel',
    response: 'La Guilde ne possède pas les routes. Elle possède les dettes.',
    followUp: 'Chaque faveur devient une chaîne. Choisis bien celle que tu acceptes de porter.',
  },
  {
    id: 'calcines',
    icon: 'memory',
    label: 'Les Calcinés',
    response: 'Les Calcinés n’écoutent plus la Cendre. Ils lui répondent.',
    followUp: 'Quand la Cendre prononce ton nom, ne réponds jamais deux fois.',
    isNew: true,
  },
  {
    id: 'artifact',
    icon: 'artifact',
    label: 'Mon artefact',
    response: 'Cette chaleur ne vient pas du feu. Cache-le aux gardes de Tissan.',
    followUp: 'Il se souvient de la main qui l’a forgé. Cette main te cherche peut-être encore.',
  },
]

/** Non-authoritative placeholders, isolated so an API response can replace them later. */
export const AVEUGLE_MEMORIES: AveugleMemory[] = [
  {
    id: 'vane-night',
    icon: 'moon',
    title: 'La nuit de Vane',
    response: 'Tu l’as épargné cette nuit-là. Son silence voyage encore avec toi.',
    isNew: true,
  },
  {
    id: 'salt-oath',
    icon: 'scroll',
    title: 'Le serment du Sel',
    response: 'Le Sel n’oublie aucun serment. Même ceux que leur auteur préfère taire.',
  },
  {
    id: 'archon-dream',
    icon: 'eye',
    title: 'Le rêve archonique',
    response: 'Ce rêve ne venait pas de toi. Quelque chose cherchait ton regard.',
  },
]

/** Mocked preparation modifiers until Game Session accepts an omen contract. */
export const AVEUGLE_OMENS: AveugleOmen[] = [
  {
    id: 'follow-smoke',
    icon: 'wind',
    label: 'Suivre la fumée',
    effect: 'Une rencontre cachée pourra apparaître pendant le prochain run.',
    response: 'La fumée révèle parfois ce que la route voulait garder secret.',
  },
  {
    id: 'avoid-bells',
    icon: 'warning',
    label: 'Éviter les cloches',
    effect: 'La première menace du prochain run sera annoncée plus clairement.',
    response: 'Les cloches préviennent les vivants. Elles appellent aussi le reste.',
  },
]

export const AVEUGLE_RESOURCES: AveugleResource[] = [
  { icon: 'coin', label: 'Sels', value: 125 },
  { icon: 'memory', label: 'Souvenirs', value: 0 },
  { icon: 'artifact', label: 'Artefacts', value: 0 },
]
