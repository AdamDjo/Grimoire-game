import { z } from 'zod'

import { isValidAiConditionId } from '../game-rules/conditions'
import { isValidEquipmentSlot } from '../game-rules/inventory'

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

/**
 * Zod schema for the optional per-turn [IA-PROPOSÉE] condition proposal (#181).
 * The AI may only propose conditions from the `family: 'ia'` whitelist
 * (poison, freeze, stun, blindness, marsh_disease, cendre_corrupt,
 * shaken_reason, petrification) — `[BACKEND]` conditions (fever, wound) are
 * applied automatically server-side and can never be proposed here. The
 * backend still re-validates the id against `isValidAiConditionId` before
 * ever applying it (this schema rejects unknown ids up front, but a stale
 * whitelist copy or renamed id must never silently pass through).
 * `calamineDelta` is only meaningful when `id === "cendre_corrupt"` (#182) —
 * capped at +20/turn by `clampCalamineDelta`, ignored for every other id.
 * @see docs/public/raw/06-SURVIVAL.md §2 "Les deux familles de conditions", §4 "La Cendre et la Calamine"
 */
export const aiApplyConditionSchema = z.object({
  id: z.string().min(1).refine(isValidAiConditionId, {
    message: 'Unknown or non-AI-proposable condition id',
  }),
  reason: z.string().min(1).max(280),
  calamineDelta: z.number().finite().optional(),
})

export type AiApplyCondition = z.infer<typeof aiApplyConditionSchema>

/**
 * Zod schema for the optional per-turn `item_gained` proposal (#183). The AI
 * signals a found item; the backend re-validates category/slot/capacity in
 * `game-rules/inventory.ts` before ever persisting it — this schema only
 * checks structure (known category, a known slot when the item is
 * equipment). "heirloom" is never AI-proposable (death/inheritance only).
 * @see docs/public/raw/11-INVENTORY-ECONOMY.md §1, docs/public/raw/15-GAME-MASTER.md §4.5
 */
export const aiItemGainedEffectSchema = z.object({
  healAmount: z.number().finite().optional(),
  calamineReduction: z.number().finite().optional(),
  removesCondition: z.string().min(1).optional(),
  damage: z.string().min(1).max(20).optional(),
})

export const aiItemGainedSchema = z
  .object({
    name: z.string().min(1).max(120),
    category: z.enum(['equipment', 'bag', 'artifact', 'key']),
    slot: z.string().min(1).optional(),
    effect: aiItemGainedEffectSchema.optional(),
    description: z.string().min(1).max(400).optional(),
  })
  .refine((v) => v.category !== 'equipment' || (v.slot && isValidEquipmentSlot(v.slot)), {
    message: 'Equipment items require a valid canon slot',
    path: ['slot'],
  })

export type AiItemGained = z.infer<typeof aiItemGainedSchema>

/**
 * Zod schema for the optional per-turn `rest_requested` proposal (#184). The
 * AI only signals the player's intent to rest — it never chooses recovery
 * values, those are computed by `game-rules/rest.ts` from the canon table.
 * "inn" is a distinct, session-ending flow (`endSessionAtInn`) and is out of
 * scope here — the backend silently ignores it if proposed.
 * @see docs/public/raw/06-SURVIVAL.md §3, docs/public/raw/15-GAME-MASTER.md §4.5
 */
export const aiRestRequestedSchema = z.object({
  type: z.enum(['short', 'fire', 'inn']),
})

export type AiRestRequested = z.infer<typeof aiRestRequestedSchema>

export const sceneTypeSchema = z.enum(['exploration', 'combat', 'dialog', 'event', 'shop', 'rest'])

export const aiSceneSchema = z.object({
  narrative: z.string().min(1).max(4000),
  sceneType: sceneTypeSchema,
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
  /** Optional [IA-PROPOSÉE] condition proposal for this turn (#181). Some models emit `null` instead of omitting the field. */
  apply_condition: aiApplyConditionSchema.nullish().transform((v) => v ?? undefined),
  /** Optional item-found proposal for this turn (#183). Some models emit `null` instead of omitting the field. */
  item_gained: aiItemGainedSchema.nullish().transform((v) => v ?? undefined),
  /** Optional rest proposal for this turn (#184). Some models emit `null` instead of omitting the field. */
  rest_requested: aiRestRequestedSchema.nullish().transform((v) => v ?? undefined),
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
