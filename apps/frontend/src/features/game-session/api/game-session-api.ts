import type { GameSessionResponse } from '../model/game-session.types'
import type { ApiResponse, Locale } from '@grimoire/shared'

/** Payload accepted by the game action route. Mirrors the backend Zod schema. */
export interface GameActionInput {
  sessionId: string
  locale: Locale
  choiceId?: string
  /** Label of the choice the player just picked. */
  chosenActionText?: string
  /** Free-form action typed by the player. */
  freeAction?: string
}

/**
 * Reads an `ApiResponse<SceneResponse>` and throws the backend `error` verbatim
 * on failure — this preserves the exact 'Anonymous limit reached' string the
 * caller matches on to show the signup wall.
 */
async function readSceneResponse<TResponse extends GameSessionResponse>(
  response: Response
): Promise<TResponse> {
  const body = (await response.json()) as ApiResponse<TResponse>

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `Game request failed (${response.status})`)
  }

  return body.data
}

/**
 * Creates (or resumes) the player's active session and returns its opening
 * scene with the persisted world-state.
 */
export async function createSession<TResponse extends GameSessionResponse = GameSessionResponse>(
  locale: Locale
): Promise<TResponse> {
  const response = await fetch('/api/game/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locale }),
  })

  return readSceneResponse<TResponse>(response)
}

/**
 * Sends the player's action to the Game Master and returns the next scene.
 * The backend owns the rules — the response carries the updated stats and the
 * d20 roll for this turn.
 */
export async function postGameAction<TResponse extends GameSessionResponse = GameSessionResponse>(
  input: GameActionInput
): Promise<TResponse> {
  const response = await fetch('/api/game/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  return readSceneResponse<TResponse>(response)
}

export const gameSessionApi = {
  createSession,
  postGameAction,
} as const
