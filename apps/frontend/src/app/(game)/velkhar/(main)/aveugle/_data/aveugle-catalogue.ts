import type { GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'
import type { UiLocale } from '@/i18n/config'
import type { AveugleExchangeType } from '@grimoire/shared'

export type AveugleTopicId = 'salt-guild' | 'calcines' | 'artifact'

interface LocalizedValue {
  en: string
  fr: string
}

interface LocalizedTopic {
  id: AveugleTopicId
  icon: GameIconName
  label: LocalizedValue
  prompt: LocalizedValue
}

interface LocalizedExchange {
  exchangeType: AveugleExchangeType
  icon: GameIconName
  label: LocalizedValue
}

export interface AveugleTopic {
  id: AveugleTopicId
  icon: GameIconName
  label: string
  prompt: string
}

export interface AveugleExchange {
  exchangeType: AveugleExchangeType
  icon: GameIconName
  label: string
}

/**
 * Local presentation catalogue only. Labels and prompts describe player intent;
 * every answer and every player-owned value still comes from the backend.
 */
const TOPICS: LocalizedTopic[] = [
  {
    id: 'salt-guild',
    icon: 'dialogue',
    label: { en: 'The Salt Guild', fr: 'La Guilde du Sel' },
    prompt: {
      en: 'What should I know about the Salt Guild?',
      fr: 'Que dois-je savoir sur la Guilde du Sel ?',
    },
  },
  {
    id: 'calcines',
    icon: 'memory',
    label: { en: 'The Calcined Ones', fr: 'Les Calcinés' },
    prompt: {
      en: 'What should I know about the Calcined Ones?',
      fr: 'Que dois-je savoir sur les Calcinés ?',
    },
  },
  {
    id: 'artifact',
    icon: 'artifact',
    label: { en: 'My artifact', fr: 'Mon artefact' },
    prompt: {
      en: 'What can you tell me about my artifact?',
      fr: 'Que peux-tu me dire sur mon artefact ?',
    },
  },
]

const EXCHANGES: LocalizedExchange[] = [
  {
    exchangeType: 'lore-fragment',
    icon: 'scroll',
    label: { en: 'A fragment of lore', fr: 'Un fragment de savoir' },
  },
  {
    exchangeType: 'artifact-identification',
    icon: 'artifact',
    label: { en: 'Identify an artifact', fr: 'Identifier un artefact' },
  },
  {
    exchangeType: 'quest-hint',
    icon: 'eye',
    label: { en: 'A clue for the road', fr: 'Un indice pour la route' },
  },
  {
    exchangeType: 'region-map',
    icon: 'wind',
    label: { en: 'A region map', fr: 'Une carte de région' },
  },
  {
    exchangeType: 'moral-advice',
    icon: 'dialogue',
    label: { en: 'The Blind One’s counsel', fr: 'Le conseil de L’Aveugle' },
  },
]

export function getAveugleTopics(locale: UiLocale): AveugleTopic[] {
  return TOPICS.map((topic) => ({
    id: topic.id,
    icon: topic.icon,
    label: topic.label[locale],
    prompt: topic.prompt[locale],
  }))
}

export function getAveugleExchanges(locale: UiLocale): AveugleExchange[] {
  return EXCHANGES.map((exchange) => ({
    exchangeType: exchange.exchangeType,
    icon: exchange.icon,
    label: exchange.label[locale],
  }))
}
