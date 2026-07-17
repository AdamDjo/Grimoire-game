import type { CharacterCreateDraft } from './character-create-model'
import type { ApiResponse, Character } from '@grimoire/shared'

/** Payload accepted by the backend character route. Mirrors the backend Zod schema. */
export interface CreateCharacterInput {
  name: string
  peopleId: string
  vocationId?: string
  freeConcept?: string
  backstory?: string
}

function toCreateCharacterInput(draft: CharacterCreateDraft): CreateCharacterInput {
  return {
    name: draft.name,
    peopleId: draft.peopleId,
    vocationId: draft.vocationPath === 'preset' ? draft.vocationId : undefined,
    freeConcept: draft.freeConcept || undefined,
    backstory: draft.backstory || undefined,
  }
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
