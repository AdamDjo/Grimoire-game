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
  /** Empty when the player wrote a free concept whose host vocation the AI
   * hasn't resolved yet (`07-CHARACTER-CREATION.md` §2 step 4) — the service
   * falls back to the canon default host, mirroring the frontend hub display. */
  vocationId: z.string().trim().max(40).optional(),
  freeConcept: z.string().trim().max(500).optional(),
  backstory: z.string().trim().max(500).optional(),
})

export type CreateCharacterRequest = z.infer<typeof createCharacterSchema>
