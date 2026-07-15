import { getPeople, getVocation } from '@grimoire/shared'

import {
  CHARACTER_RESULT_STORAGE_KEY,
  parseStoredCharacterResult,
  type CharacterCreateDraft,
} from '@/components/character-create/character-create-model'
import { ACTIVE_GAME_SESSION_HREF } from '@/lib/active-game-session'

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
}

const FALLBACK_CHARACTER: CharacterCreateDraft = {
  version: 1,
  name: 'Le Voyageur',
  peopleId: 'sahelin',
  vocationPath: 'preset',
  vocationId: 'salt-walker',
  freeConcept: '',
  backstory: '',
  historyReviewed: true,
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

export function getFallbackHubCharacter(): CharacterCreateDraft {
  return FALLBACK_CHARACTER
}

export function resolveAveugleHubSnapshot({
  campaignId,
  character,
  hasActiveSession,
  isRunReturn,
}: ResolveAveugleHubSnapshotInput): AveugleHubSnapshot {
  if (!character) {
    return {
      character: null,
      primaryHref: withCampaign('/velkhar/aveugle?flow=character-create', campaignId),
      primaryLabel: 'Répondre à L’Aveugle',
      stage: 'character-create',
    }
  }

  const people = getPeople(character.peopleId)
  const vocation = character.vocationPath === 'preset' ? getVocation(character.vocationId) : null
  const hubCharacter: AveugleHubCharacter = {
    name: character.name,
    people: people?.name.fr ?? 'Peuple inconnu',
    vocation: vocation?.name.fr ?? (character.freeConcept || 'Concept libre'),
    vocationId: vocation?.id ?? 'watcher',
  }

  if (hasActiveSession) {
    return {
      character: hubCharacter,
      primaryHref: ACTIVE_GAME_SESSION_HREF,
      primaryLabel: 'Reprendre la route',
      stage: 'active-session',
    }
  }

  return {
    character: hubCharacter,
    primaryHref: '/velkhar/session/new',
    primaryLabel: isRunReturn ? 'Préparer un nouveau départ' : 'Partir en run',
    stage: isRunReturn ? 'run-return' : 'ready',
  }
}
