import { type Request, type Response, Router } from 'express'

import { prisma } from '../lib/prisma'

import type {
  ApiResponse,
  Chronicle,
  ChronicleEndReason,
  ChronicleKeyMoment,
  ChronicleMood,
} from '@grimoire/shared'

export const chronicleRouter: Router = Router()

/**
 * GET /api/chronicles/session/:sessionId
 * Fetches the Chronicle generated for a given session (end-of-run screen).
 * Scoped to `req.auth.userId` — a user can only read their own Chronicles.
 * 404 if the session hasn't ended yet, was too short for a Chronicle, or
 * generation failed (no Chronicle persisted in that case).
 */
chronicleRouter.get(
  '/session/:sessionId',
  async (req: Request<{ sessionId: string }>, res: Response<ApiResponse<Chronicle>>) => {
    const { sessionId } = req.params

    const row = await prisma.chronicle.findFirst({
      where: { sessionId, userId: req.auth!.userId },
    })
    if (!row) {
      res.status(404).json({ success: false, error: 'Chronicle not found' })
      return
    }

    const data: Chronicle = {
      id: row.id,
      userId: row.userId,
      characterId: row.characterId,
      sessionId: row.sessionId,
      endReason: row.endReason as ChronicleEndReason,
      title: row.title,
      bodyMarkdown: row.bodyMarkdown,
      mood: row.mood as ChronicleMood,
      keyMoments: row.keyMoments as unknown as ChronicleKeyMoment[],
      tagline: row.tagline,
      createdAt: row.createdAt.toISOString(),
    }

    res.json({ success: true, data })
  }
)
