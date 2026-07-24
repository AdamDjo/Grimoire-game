import { normalizeLocale } from '@grimoire/shared'
import { z } from 'zod'

/**
 * Accepts an untrusted locale string and normalizes it to a safe BCP-47 tag,
 * or `undefined` when it is missing/invalid. Never throws — an unusable locale
 * simply drops out of resolution and the caller falls back to English (#168).
 * This is the only gate through which a client-supplied locale reaches a prompt.
 */
const localeField = z
  .string()
  .optional()
  .transform((value) => normalizeLocale(value))

/**
 * Player action request. The DB is the source of truth for the world-state
 * AND the narration locale, so the client sends no character, stats, or locale —
 * only which session and which choice (or free action). The backend loads
 * everything else, including the persisted session locale, from the DB.
 */
export const gameActionSchema = z.object({
  sessionId: z.string().min(1),
  choiceId: z.string().min(1).optional(),
  /** Chosen choice label, passed through so the GM knows what the player picked. */
  chosenActionText: z.string().min(1).max(280).optional(),
  freeAction: z.string().min(1).max(500).optional(),
})

export type GameActionRequest = z.infer<typeof gameActionSchema>

/**
 * Session creation request. `locale` is the browser-detected narration language
 * (normalized BCP-47); `explicitLocale` is a deliberate player choice that both
 * overrides detection and is persisted on the account. Both are optional and
 * unusable values fall back to English server-side.
 */
export const createSessionSchema = z.object({
  locale: localeField,
  explicitLocale: localeField,
})

export type CreateSessionRequest = z.infer<typeof createSessionSchema>

/** Request to voluntarily end a session (inn choice or explicit abandon). */
export const endSessionSchema = z.object({
  sessionId: z.string().min(1),
})

export type EndSessionRequest = z.infer<typeof endSessionSchema>

/**
 * Player-initiated inventory action (use/equip/unequip, #183). Never advances
 * the turn — the backend applies `game-rules/inventory.ts` against the
 * persisted state and returns immediately, no AI call, no dice.
 */
export const inventoryActionSchema = z.object({
  sessionId: z.string().min(1),
  itemId: z.string().min(1),
  action: z.enum(['use', 'equip', 'unequip']),
})

export type InventoryActionRequest = z.infer<typeof inventoryActionSchema>
