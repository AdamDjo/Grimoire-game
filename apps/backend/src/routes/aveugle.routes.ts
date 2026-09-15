import { type Request, type Response, Router } from 'express'
import rateLimit from 'express-rate-limit'

import { prisma } from '../lib/prisma'
import { userOrIpKey } from '../middleware/rate-limit-key'
import {
  generateAveugleTalkResponse,
  getAveugleHubState,
  markTopicSeen,
  SouvenirNotFoundError,
  SouvenirNotSpendableError,
  spendSouvenirForLore,
} from '../services/aveugle.service'

import {
  souvenirIdParamSchema,
  spendSouvenirSchema,
  talkToAveugleSchema,
  topicIdParamSchema,
} from './aveugle.schema'

import type {
  ApiResponse,
  AveugleHubState,
  AveugleTalkResponse,
  Souvenir,
  SouvenirType,
  SpendSouvenirResponse,
} from '@grimoire/shared'

export const aveugleRouter: Router = Router()

// Read-only / low-cost endpoints — no AI call involved.
const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKey,
})

// AI-backed endpoints — protect the OpenRouter budget.
const gameLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKey,
})

/**
 * GET /api/aveugle/hub
 * Read-only state for the Aveugle hub screen (gold, spendable Souvenir count,
 * named Souvenirs, topics already seen). No AI call.
 */
aveugleRouter.get(
  '/hub',
  apiLimiter,
  async (req: Request, res: Response<ApiResponse<AveugleHubState>>) => {
    const data = await getAveugleHubState(req.auth!.userId)
    res.json({ success: true, data })
  }
)

/**
 * POST /api/aveugle/topics/:topicId/seen
 * Idempotently marks a hub topic (static frontend catalogue) as seen.
 */
aveugleRouter.post(
  '/topics/:topicId/seen',
  apiLimiter,
  async (req: Request<{ topicId: string }>, res: Response<ApiResponse<null>>) => {
    const parsed = topicIdParamSchema.safeParse(req.params)
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      })
      return
    }

    await markTopicSeen(req.auth!.userId, parsed.data.topicId)
    res.json({ success: true, data: null })
  }
)

/**
 * POST /api/aveugle/talk
 * Free-form dialogue with L'Aveugle. Stateless per turn, always answers in
 * canon voice — falls back to a static reply if the AI call fails.
 */
aveugleRouter.post(
  '/talk',
  gameLimiter,
  async (req: Request, res: Response<ApiResponse<AveugleTalkResponse>>) => {
    const parsed = talkToAveugleSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      })
      return
    }

    const data = await generateAveugleTalkResponse(req.auth!.userId, parsed.data.message)
    res.json({ success: true, data })
  }
)

/**
 * POST /api/aveugle/souvenirs/:souvenirId/spend
 * Spends an anonymous (spendable) Souvenir for AI-generated lore. Refuses
 * named Souvenirs (narrative medals) and Souvenirs the caller doesn't own.
 */
aveugleRouter.post(
  '/souvenirs/:souvenirId/spend',
  gameLimiter,
  async (
    req: Request<{ souvenirId: string }>,
    res: Response<ApiResponse<SpendSouvenirResponse>>
  ) => {
    const params = souvenirIdParamSchema.safeParse(req.params)
    const body = spendSouvenirSchema.safeParse(req.body)
    if (!params.success || !body.success) {
      res.status(400).json({
        success: false,
        error: [
          ...(params.success ? [] : params.error.issues),
          ...(body.success ? [] : body.error.issues),
        ]
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; '),
      })
      return
    }

    try {
      const result = await spendSouvenirForLore(
        req.auth!.userId,
        params.data.souvenirId,
        body.data.exchangeType
      )

      const row = await prisma.souvenir.findFirstOrThrow({ where: { id: result.souvenirId } })

      const souvenir: Souvenir = {
        id: row.id,
        userId: row.userId,
        characterId: row.characterId,
        sessionId: row.sessionId,
        title: row.title,
        body: row.body,
        type: row.type as SouvenirType,
        anonymous: row.anonymous,
        sharedWithAveugle: row.sharedWithAveugle,
        aveugleLoreResult: row.aveugleLoreResult ?? undefined,
        createdAt: row.createdAt.toISOString(),
      }

      res.json({ success: true, data: { loreResult: result.loreResult, souvenir } })
    } catch (err) {
      if (err instanceof SouvenirNotFoundError) {
        res.status(404).json({ success: false, error: err.message })
        return
      }
      if (err instanceof SouvenirNotSpendableError) {
        res.status(409).json({ success: false, error: err.message })
        return
      }
      if (err instanceof Error && err.message === 'ai_generation_failed') {
        res
          .status(502)
          .json({ success: false, error: 'Lore generation failed, Souvenir not spent' })
        return
      }
      throw err
    }
  }
)
