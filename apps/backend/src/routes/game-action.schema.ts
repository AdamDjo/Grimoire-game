import { z } from 'zod'

/**
 * Player action request. The DB is the source of truth for the world-state,
 * so the client sends no character or stats — only which session and which
 * choice (or free action). The backend loads everything else from the session.
 */
export const gameActionSchema = z.object({
  sessionId: z.string().min(1),
  choiceId: z.string().min(1).optional(),
  /** Chosen choice label, passed through so the GM knows what the player picked. */
  chosenActionText: z.string().min(1).max(280).optional(),
  freeAction: z.string().min(1).max(500).optional(),
  locale: z.enum(['en', 'fr']).default('en'),
})

export type GameActionRequest = z.infer<typeof gameActionSchema>

/** Session creation request — only the narration locale is needed. */
export const createSessionSchema = z.object({
  locale: z.enum(['en', 'fr']).default('en'),
})

export type CreateSessionRequest = z.infer<typeof createSessionSchema>

/** Request to voluntarily end a session (inn choice or explicit abandon). */
export const endSessionSchema = z.object({
  sessionId: z.string().min(1),
})

export type EndSessionRequest = z.infer<typeof endSessionSchema>
