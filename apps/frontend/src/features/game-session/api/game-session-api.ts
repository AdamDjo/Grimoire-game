import type {
  GameSessionEndResponse,
  GameSessionInventoryActionResponse,
  GameSessionResponse,
} from '../model/game-session.types'
import type { ApiResponse, Locale } from '@grimoire/shared'

/**
 * Payload accepted by the game action route. Mirrors the backend Zod schema.
 * The narration language is resolved once at session creation and persisted
 * server-side, so a turn never carries a locale (#168).
 */
export interface GameActionInput {
  sessionId: string
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

async function readEndResponse(response: Response): Promise<GameSessionEndResponse> {
  const body = (await response.json()) as ApiResponse<GameSessionEndResponse>

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `Game request failed (${response.status})`)
  }

  return body.data
}

async function readInventoryActionResponse(
  response: Response
): Promise<GameSessionInventoryActionResponse> {
  const body = (await response.json()) as ApiResponse<GameSessionInventoryActionResponse>

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `Game request failed (${response.status})`)
  }

  return body.data
}

export interface CreateSessionLocaleInput {
  /** Browser-detected narration language, used as a fallback (#168). */
  locale?: Locale
  /** Deliberate in-game language choice (language switcher); wins over `locale` (#181). */
  explicitLocale?: Locale
}

/**
 * Creates (or resumes) the player's active session and returns its opening
 * scene with the persisted world-state. The backend normalizes both locales,
 * prioritizes `explicitLocale` over the browser-detected `locale` and falls
 * back to English, so an empty input is fine (#168, #181).
 */
export async function createSession<TResponse extends GameSessionResponse = GameSessionResponse>({
  locale,
  explicitLocale,
}: CreateSessionLocaleInput = {}): Promise<TResponse> {
  const response = await fetch('/api/game/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(locale ? { locale } : {}),
      ...(explicitLocale ? { explicitLocale } : {}),
    }),
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

/** Ends the current run only after the session menu confirmation. */
export async function abandonSession(sessionId: string): Promise<GameSessionEndResponse> {
  const response = await fetch('/api/game/session/abandon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })

  return readEndResponse(response)
}

export interface InventoryActionInput {
  sessionId: string
  itemId: string
  action: 'use' | 'equip' | 'unequip'
}

/**
 * Player-initiated inventory action (use/equip/unequip, #183). Never advances
 * the turn — no AI call, no dice, no new scene — only the resulting stats and
 * inventory state.
 */
export async function postInventoryAction(
  input: InventoryActionInput
): Promise<GameSessionInventoryActionResponse> {
  const response = await fetch('/api/game/inventory/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  return readInventoryActionResponse(response)
}

export const gameSessionApi = {
  abandonSession,
  createSession,
  postGameAction,
  postInventoryAction,
} as const
