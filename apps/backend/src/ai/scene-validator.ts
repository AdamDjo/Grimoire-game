import { z } from 'zod'

/**
 * Zod schema for the raw narrative payload the AI is allowed to produce.
 * The AI writes prose and choice labels only — never rules, stats, or ids.
 * The backend owns everything mechanical and assembles the final `Scene`.
 */
export const aiChoiceSchema = z.object({
  text: z.string().min(1).max(280),
  type: z.enum(['action', 'dialog', 'combat', 'flee', 'use_item', 'skill']),
  riskLevel: z.enum(['safe', 'low', 'medium', 'high', 'deadly']).optional(),
})

/**
 * Zod schema for a fully-assembled `Choice` as persisted in `SceneLog.choices`
 * (the AI shape plus the backend-assigned `id`). Used to safely re-read a
 * stored scene's choices — Prisma `Json` columns are `unknown` at runtime.
 */
export const persistedChoiceSchema = aiChoiceSchema.extend({
  id: z.string().min(1),
})

export const persistedChoicesSchema = z.array(persistedChoiceSchema)

/**
 * Zod schema for the optional per-turn Souvenir candidate (N3 memory, #115).
 * The AI proposes this only when a Souvenir-worthy moment just happened —
 * most turns omit it entirely. `type` is an explicit hint from the AI since
 * it can't be reliably inferred server-side from prose alone; the backend
 * still re-validates it against the enum and applies every other rule (cap,
 * pinned-fact match, dedup, length bounds) in `souvenir.service.ts` before
 * ever persisting anything.
 */
export const aiSouvenirCandidateSchema = z.object({
  title_suggestion: z.string().min(1).max(200),
  body: z.string().min(1).max(1000),
  type: z.enum(['npc-death', 'moral-choice', 'secret-discovery', 'boss-victory', 'strong-promise']),
})

export type AiSouvenirCandidate = z.infer<typeof aiSouvenirCandidateSchema>

export const aiSceneSchema = z.object({
  narrative: z.string().min(1).max(4000),
  sceneType: z.enum(['exploration', 'combat', 'dialog', 'event', 'shop', 'rest']),
  location: z.string().min(1).max(120),
  choices: z.array(aiChoiceSchema).min(1).max(6),
  /**
   * Short factual condensate of this turn (N1 short-term memory) — generated
   * by the AI itself, never truncated from `narrative` by the backend. Fuels
   * the recent-turns prompt section injected between N2 chunks.
   */
  turnSummary: z.string().min(1).max(200),
  /** Optional named-Souvenir candidate for this turn (N3 memory, #115). Some models emit `null` instead of omitting the field. */
  souvenir_candidate: aiSouvenirCandidateSchema.nullish().transform((v) => v ?? undefined),
})

export type AiScenePayload = z.infer<typeof aiSceneSchema>

export interface SceneValidationResult {
  success: boolean
  data?: AiScenePayload
  error?: string
}

/** Parses and validates raw AI output; malformed output is rejected, never passed through. */
export function validateAiScene(raw: unknown): SceneValidationResult {
  const parsed = aiSceneSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  return { success: true, data: parsed.data }
}
