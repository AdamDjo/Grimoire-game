import { z } from 'zod'

/**
 * Zod schema for the raw end-of-run Chronicle payload the AI produces
 * (17-RUN-CHRONICLE.md §1). `illustration_prompt` is intentionally omitted:
 * illustration generation is out of scope for #116 (deferred ticket).
 */
export const chronicleOutputSchema = z.object({
  title: z.string().min(1).max(80),
  body_markdown: z.string().min(1),
  mood: z.enum(['tragic', 'epic', 'melancholic', 'serene', 'absurd']),
  key_moments: z.array(
    z.object({
      label: z.string().min(1),
      scene_ref: z.number().int(),
    })
  ),
  tagline: z.string().min(15).max(30),
})

export type ChronicleOutput = z.infer<typeof chronicleOutputSchema>

export interface ChronicleValidationResult {
  success: boolean
  data?: ChronicleOutput
  error?: string
}

/** Parses and validates raw AI Chronicle output; malformed output is rejected, never passed through. */
export function validateChronicleOutput(raw: unknown): ChronicleValidationResult {
  const parsed = chronicleOutputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  return { success: true, data: parsed.data }
}
