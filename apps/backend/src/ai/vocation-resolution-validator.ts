import { z } from 'zod'

/**
 * Zod schema for L'Aveugle's free-concept host vocation resolution
 * (`POST /api/character/resolve-vocation`). The AI may only ever point at one
 * of the 4 canon vocations — `vocationId` is a closed enum, so a hallucinated
 * 5th vocation is rejected mechanically regardless of prompt behavior
 * (`07-CHARACTER-CREATION.md` §2 step 4).
 */
export const vocationResolutionOutputSchema = z.discriminatedUnion('understood', [
  z.object({
    understood: z.literal(true),
    vocationId: z.enum(['salt-walker', 'shadow-blade', 'watcher', 'word-weaver']),
    customVocationName: z.string().trim().min(1).max(60),
    narrativeTrait: z.string().trim().min(1).max(200),
    shiftedSkills: z
      .array(
        z.object({
          original: z.string().trim().min(1).max(60),
          shifted: z.string().trim().min(1).max(60),
        })
      )
      .length(2),
    announcement: z.string().trim().min(1).max(600),
  }),
  z.object({
    understood: z.literal(false),
  }),
])

export type VocationResolutionOutput = z.infer<typeof vocationResolutionOutputSchema>

export interface VocationResolutionValidationResult<T> {
  success: boolean
  data?: T
  error?: string
}

/** Parses and validates raw AI vocation-resolution output; malformed output is rejected, never passed through. */
export function validateVocationResolutionOutput(
  raw: unknown
): VocationResolutionValidationResult<VocationResolutionOutput> {
  const parsed = vocationResolutionOutputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  return { success: true, data: parsed.data }
}
