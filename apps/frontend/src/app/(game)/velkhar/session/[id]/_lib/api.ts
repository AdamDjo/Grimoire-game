import type { ApiResponse, Character, Locale, Scene } from '@grimoire/shared'

/**
 * Scene returned by `POST /api/game/action`, enriched with how it was produced.
 * `source` mirrors the backend field — 'ai' when the real Game Master answered,
 * 'stub' when it fell back to the deterministic scene.
 *
 * Provisional (session demo) — will move to a shared client once the API stabilizes.
 */
export type SceneWithSource = Scene & { source: 'ai' | 'stub' }

/** Payload accepted by the game action route. Mirrors the backend Zod schema. */
export interface GameActionInput {
  character: Character
  locale: Locale
  sessionId?: string
  choiceId?: string
  /** Label of the choice the player just picked. */
  chosenActionText?: string
  /** Free-form action typed by the player. */
  freeAction?: string
}

/**
 * Sends the player's action to the Game Master and returns the next scene.
 * Throws on network failure or a non-ok / unsuccessful API response so the
 * caller can surface the error in the UI.
 */
export async function postGameAction(input: GameActionInput): Promise<SceneWithSource> {
  const response = await fetch('/api/game/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const body = (await response.json()) as ApiResponse<SceneWithSource>

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `Game action failed (${response.status})`)
  }

  return body.data
}
