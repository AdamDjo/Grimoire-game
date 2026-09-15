import { getPeople, getVocation } from '@grimoire/shared'

import { VELKHAR_WORLD } from '../../../_config/velkhar-world'
import {
  CHARACTER_RESULT_STORAGE_KEY,
  parseStoredCharacterResult,
  type CharacterCreateDraft,
} from '../../character-create/_lib/character-create-model'

import type { UiLocale } from '@/i18n/config'

export type AveugleHubStage = 'character-create' | 'ready' | 'active-session' | 'run-return'

export interface AveugleHubCharacter {
  name: string
  people: string
  vocation: string
  vocationId: string
}

export interface AveugleHubSnapshot {
  character: AveugleHubCharacter | null
  primaryHref: string
  primaryLabel: string
  stage: AveugleHubStage
}

interface ResolveAveugleHubSnapshotInput {
  campaignId?: string
  character: CharacterCreateDraft | null
  hasActiveSession: boolean
  isRunReturn: boolean
  locale?: UiLocale
  labels?: Partial<AveugleHubLabels>
}

interface AveugleHubLabels {
  answerBlindOne: string
  freeConcept: string
  prepareDeparture: string
  resumeRoad: string
  startRun: string
  unknownPeople: string
}

const DEFAULT_LABELS: AveugleHubLabels = {
  answerBlindOne: 'Répondre à L’Aveugle',
  freeConcept: 'Concept libre',
  prepareDeparture: 'Préparer un nouveau départ',
  resumeRoad: 'Reprendre la route',
  startRun: 'Partir en run',
  unknownPeople: 'Peuple inconnu',
}

const FALLBACK_CHARACTER: CharacterCreateDraft = {
  version: 2,
  name: 'Le Voyageur',
  peopleId: 'sahelin',
  vocationPath: 'preset',
  vocationId: 'salt-walker',
  freeConcept: '',
  backstory: '',
  historyReviewed: true,
  vocationResolutionStatus: 'idle',
  customVocationName: '',
  narrativeTrait: '',
  shiftedSkills: [],
}

function withCampaign(path: string, campaignId?: string): string {
  if (!campaignId) return path

  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}campaign=${encodeURIComponent(campaignId)}`
}

export function readStoredHubCharacter(
  storage: Pick<Storage, 'getItem'>
): CharacterCreateDraft | null {
  return parseStoredCharacterResult(storage.getItem(CHARACTER_RESULT_STORAGE_KEY))
}

export function getFallbackHubCharacter(name = FALLBACK_CHARACTER.name): CharacterCreateDraft {
  return { ...FALLBACK_CHARACTER, name }
}

export function resolveAveugleHubSnapshot({
  campaignId,
  character,
  hasActiveSession,
  isRunReturn,
  labels: labelOverrides,
  locale = 'fr',
}: ResolveAveugleHubSnapshotInput): AveugleHubSnapshot {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides }

  if (!character) {
    return {
      character: null,
      primaryHref: withCampaign(
        `${VELKHAR_WORLD.routes.aveugle}?flow=character-create`,
        campaignId
      ),
      primaryLabel: labels.answerBlindOne,
      stage: 'character-create',
    }
  }

  const people = getPeople(character.peopleId)
  const vocation = character.vocationPath === 'preset' ? getVocation(character.vocationId) : null
  const hubCharacter: AveugleHubCharacter = {
    name: character.name,
    people: people?.name[locale] ?? labels.unknownPeople,
    vocation: vocation?.name[locale] ?? (character.freeConcept || labels.freeConcept),
    vocationId: vocation?.id ?? 'watcher',
  }

  if (hasActiveSession) {
    return {
      character: hubCharacter,
      primaryHref: `${VELKHAR_WORLD.routes.session}/resume`,
      primaryLabel: labels.resumeRoad,
      stage: 'active-session',
    }
  }

  return {
    character: hubCharacter,
    primaryHref: withCampaign(`${VELKHAR_WORLD.routes.session}/new`, campaignId),
    primaryLabel: isRunReturn ? labels.prepareDeparture : labels.startRun,
    stage: isRunReturn ? 'run-return' : 'ready',
  }
}
