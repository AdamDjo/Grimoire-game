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

export const aiSceneSchema = z.object({
  narrative: z.string().min(1).max(4000),
  sceneType: z.enum(['exploration', 'combat', 'dialog', 'event', 'shop', 'rest']),
  location: z.string().min(1).max(120),
  choices: z.array(aiChoiceSchema).min(1).max(6),
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
