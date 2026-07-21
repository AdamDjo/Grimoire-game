import { z } from 'zod'

/**
 * Zod schema for L'Aveugle's free-talk AI output (`/api/aveugle/talk`).
 * Single short reply in canon voice — no choices, no mood, no side effects
 * (15-GAME-MASTER.md §1.1: warm, ironic, tutoie, short desert proverbs).
 */
export const aveugleTalkOutputSchema = z.object({
  reply: z.string().min(1).max(600),
})

export type AveugleTalkOutput = z.infer<typeof aveugleTalkOutputSchema>

/**
 * Zod schema for L'Aveugle's Souvenir-for-lore exchange AI output
 * (`/api/aveugle/souvenirs/:id/spend`). The AI only produces the lore text —
 * the exchange price and eligibility are resolved by the backend beforehand.
 */
export const aveugleLoreOutputSchema = z.object({
  loreResult: z.string().min(1).max(1200),
})

export type AveugleLoreOutput = z.infer<typeof aveugleLoreOutputSchema>

export interface AveugleValidationResult<T> {
  success: boolean
  data?: T
  error?: string
}

/** Parses and validates raw AI free-talk output; malformed output is rejected, never passed through. */
export function validateAveugleTalkOutput(
  raw: unknown
): AveugleValidationResult<AveugleTalkOutput> {
  const parsed = aveugleTalkOutputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  return { success: true, data: parsed.data }
}

/** Parses and validates raw AI Souvenir-exchange output; malformed output is rejected, never passed through. */
export function validateAveugleLoreOutput(
  raw: unknown
): AveugleValidationResult<AveugleLoreOutput> {
  const parsed = aveugleLoreOutputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  return { success: true, data: parsed.data }
}
