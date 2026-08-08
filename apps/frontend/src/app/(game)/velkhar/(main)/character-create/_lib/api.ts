import type { CharacterCreateDraft } from './character-create-model'
import type {
  ApiResponse,
  Character,
  ShiftedSkill,
  VocationResolutionResponse,
} from '@grimoire/shared'

/** Payload accepted by the backend character route. Mirrors the backend Zod schema. */
export interface CreateCharacterInput {
  name: string
  peopleId: string
  vocationId?: string
  freeConcept?: string
  backstory?: string
  customVocationName?: string
  narrativeTrait?: string
  shiftedSkills?: ShiftedSkill[]
}

function toCreateCharacterInput(draft: CharacterCreateDraft): CreateCharacterInput {
  return {
    name: draft.name,
    peopleId: draft.peopleId,
    vocationId: draft.vocationId || undefined,
    freeConcept: draft.freeConcept || undefined,
    backstory: draft.backstory || undefined,
    customVocationName: draft.customVocationName || undefined,
    narrativeTrait: draft.narrativeTrait || undefined,
    shiftedSkills: draft.shiftedSkills.length > 0 ? draft.shiftedSkills : undefined,
  }
}

/**
 * Resolves a free-form character concept to one of the 4 canon host
 * vocations via L'Aveugle, before `createCharacter` is called
 * (`07-CHARACTER-CREATION.md` §2 step 4). Stateless on the backend.
 */
export async function resolveVocation(freeConcept: string): Promise<VocationResolutionResponse> {
  const response = await fetch('/api/character/resolve-vocation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ freeConcept }),
  })

  const body = (await response.json()) as ApiResponse<VocationResolutionResponse>
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `Vocation resolution failed (${response.status})`)
  }

  return body.data
}

/**
 * Persists the Forge draft as the player's `Character` (#146). Idempotent on
 * the backend: replaying returns the player's existing character unchanged.
 */
export async function createCharacter(draft: CharacterCreateDraft): Promise<Character> {
  const response = await fetch('/api/character', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toCreateCharacterInput(draft)),
  })

  const body = (await response.json()) as ApiResponse<Character>
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `Character creation failed (${response.status})`)
  }

  return body.data
}
