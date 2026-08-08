import { type Request, type Response, Router } from 'express'

import { prisma } from '../lib/prisma'

import type { ApiResponse, Souvenir, SouvenirType } from '@grimoire/shared'

export const souvenirRouter: Router = Router()

/**
 * GET /api/souvenirs
 * Lists the authenticated user's named Souvenirs (N3 memory, #115), most
 * recent first. Cross-run and permanent — scoped to `req.auth.userId` only,
 * never to a session or character (a Souvenir outlives both). Read-only:
 * Souvenirs are immutable once persisted by `souvenir.service.ts`.
 */
souvenirRouter.get('/', async (req: Request, res: Response<ApiResponse<Souvenir[]>>) => {
  const rows = await prisma.souvenir.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { createdAt: 'desc' },
  })

  const data: Souvenir[] = rows.map((row) => ({
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
  }))

  res.json({ success: true, data })
})
