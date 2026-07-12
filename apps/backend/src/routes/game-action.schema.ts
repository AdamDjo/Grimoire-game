import { z } from 'zod'

/** Mirrors the shared `Condition` union. */
const conditionSchema = z.enum([
  'fever',
  'poisoned',
  'wounded',
  'frozen',
  'stunned',
  'blinded',
  'marsh_sickness',
  'ash_corrupted',
  'shaken_mind',
  'slow_petrification',
])

/** Zod mirror of the shared `Character` contract, for request validation. */
const attributesSchema = z.object({
  blood: z.number().int(),
  breath: z.number().int(),
  ash: z.number().int(),
})

const survivalSchema = z.object({
  hp: z.number(),
  maxHp: z.number(),
  thirst: z.number(),
  hunger: z.number(),
  energy: z.number(),
  calamine: z.number(),
})

const characterSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  people: z.string().min(1),
  vocation: z.string().min(1),
  freeConcept: z.string().optional(),
  stats: z.object({
    attributes: attributesSchema,
    survival: survivalSchema,
    conditions: z.array(conditionSchema),
  }),
  backstory: z.string().optional(),
  avatarUrl: z.string().optional(),
  createdAt: z.string(),
})

export const gameActionSchema = z.object({
  sessionId: z.string().optional(),
  character: characterSchema,
  choiceId: z.string().optional(),
  /** Chosen choice label, passed through so the GM knows what the player picked. */
  chosenActionText: z.string().max(280).optional(),
  freeAction: z.string().max(500).optional(),
  locale: z.enum(['en', 'fr']).default('en'),
})

export type GameActionRequest = z.infer<typeof gameActionSchema>
