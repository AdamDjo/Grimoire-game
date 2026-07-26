import { z } from 'zod'

/**
 * Character creation request (the Forge). Mirrors the frontend
 * `CharacterCreateDraft` shape (`character-create-model.ts`) but only carries
 * what the backend needs to persist a `Character` — the wizard's step/progress
 * fields (`vocationPath`, `historyReviewed`) stay client-side.
 */
export const createCharacterSchema = z.object({
  name: z.string().trim().min(1).max(30),
  peopleId: z.string().trim().min(1).max(40),
  /** Always resolved before this call — a preset picked directly, or the AI's
   * resolution from `POST /api/character/resolve-vocation` for a free concept
   * (`07-CHARACTER-CREATION.md` §2 step 4). */
  vocationId: z.string().trim().min(1).max(40),
  freeConcept: z.string().trim().max(500).optional(),
  backstory: z.string().trim().max(500).optional(),
  customVocationName: z.string().trim().max(60).optional(),
  narrativeTrait: z.string().trim().max(200).optional(),
  shiftedSkills: z
    .array(z.object({ original: z.string().trim().max(60), shifted: z.string().trim().max(60) }))
    .max(2)
    .optional(),
})

export type CreateCharacterRequest = z.infer<typeof createCharacterSchema>

/**
 * `POST /api/character/resolve-vocation` request — the free concept the
 * player wrote describing who they are, submitted before character creation
 * so L'Aveugle can identify a host vocation among the 4 canon presets.
 */
export const resolveVocationSchema = z.object({
  freeConcept: z.string().trim().min(1).max(500),
})

export type ResolveVocationRequest = z.infer<typeof resolveVocationSchema>
