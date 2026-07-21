import { z } from 'zod'

export const talkToAveugleSchema = z.object({
  message: z.string().min(1).max(500),
})

export const spendSouvenirSchema = z.object({
  exchangeType: z.enum([
    'lore-fragment',
    'artifact-identification',
    'quest-hint',
    'region-map',
    'moral-advice',
  ]),
})

export const topicIdParamSchema = z.object({
  topicId: z.string().min(1).max(50),
})

export const souvenirIdParamSchema = z.object({
  souvenirId: z.string().min(1).max(100),
})
