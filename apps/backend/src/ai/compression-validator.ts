import { z } from 'zod'

/**
 * Zod schema for the raw N2 compression payload the AI produces from a batch
 * of turns. The AI decides `keyFactsPinned` directly via the auto-pinning
 * rules given in its prompt (NPC death, artifact gained/lost, quest started,
 * major moral choice) — the backend only validates the shape, never re-derives it.
 */
export const compressionOutputSchema = z.object({
  summary: z.string().min(1).max(800),
  key_facts: z.array(z.string().min(1)).min(3).max(5),
  key_facts_pinned: z.array(z.string().min(1)).max(10),
  mood: z.enum(['calm', 'tense', 'festive', 'sacred', 'dangerous']),
  npcs_evolution: z.array(
    z.object({
      name: z.string().min(1),
      status: z.string().min(1),
      last_seen: z.string().min(1),
    })
  ),
})

export type CompressionOutput = z.infer<typeof compressionOutputSchema>

export interface CompressionValidationResult {
  success: boolean
  data?: CompressionOutput
  error?: string
}

/** Parses and validates raw AI compression output; malformed output is rejected, never passed through. */
export function validateCompressionOutput(raw: unknown): CompressionValidationResult {
  const parsed = compressionOutputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  return { success: true, data: parsed.data }
}
