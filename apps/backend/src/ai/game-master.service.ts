import { hasOpenRouterKey } from '../config/env'

import { callOpenRouter } from './openrouter.provider'
import { buildStubScene } from './scene-stub'
import { type AiScenePayload, validateAiScene } from './scene-validator'
import { buildSystemPrompt } from './system-prompt'

import type { Character, Locale } from '@grimoire/shared'

export interface GameMasterInput {
  character: Character
  locale: Locale
  /** Label of the choice the player just took, if any. */
  chosenActionText?: string
  /** Free-form action typed by the player, if any. */
  freeAction?: string
}

export interface GameMasterResult {
  scene: AiScenePayload
  /** How the scene was produced — useful for debugging and the front badge. */
  source: 'ai' | 'stub'
}

/** Turns the player's action into a validated narrative payload. */
function buildUserPrompt(input: GameMasterInput): string {
  if (input.freeAction) {
    return `The player attempts: "${input.freeAction}". Narrate what happens and offer new choices.`
  }
  if (input.chosenActionText) {
    return `The player chose: "${input.chosenActionText}". Narrate the outcome and offer new choices.`
  }
  return 'Begin the session. Establish the opening scene and offer the first choices.'
}

/**
 * Produces a validated scene payload.
 * Falls back to the deterministic stub whenever the AI is unavailable,
 * errors, or returns malformed JSON — the front never receives raw AI output.
 */
export async function generateScene(input: GameMasterInput): Promise<GameMasterResult> {
  if (!hasOpenRouterKey()) {
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  const result = await callOpenRouter([
    { role: 'system', content: buildSystemPrompt(input.character, input.locale) },
    { role: 'user', content: buildUserPrompt(input) },
  ])

  if (!result.success || !result.content) {
    console.warn('[GM] AI call failed, falling back to stub:', result.error)
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(result.content)
  } catch {
    console.warn('[GM] AI returned non-JSON, falling back to stub')
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  const validated = validateAiScene(parsed)
  if (!validated.success || !validated.data) {
    console.warn('[GM] AI JSON failed validation, falling back to stub:', validated.error)
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  return { scene: validated.data, source: 'ai' }
}
