import { randomUUID } from 'node:crypto'

import { type Request, type Response, Router } from 'express'

import { generateScene } from '../ai/game-master.service'
import { assembleScene } from '../services/scene-assembler'

import { gameActionSchema } from './game-action.schema'

import type { ApiResponse, Scene } from '@grimoire/shared'

export const gameRouter: Router = Router()

/**
 * POST /api/game/action
 * Receives the player's action, asks the Game Master for a narrative payload
 * (AI or deterministic stub), then assembles and returns a validated `Scene`.
 */
gameRouter.post('/action', async (req: Request, res: Response<ApiResponse<Scene>>) => {
  const parsed = gameActionSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    })
    return
  }

  const { character, locale, sessionId, choiceId, chosenActionText, freeAction } = parsed.data

  const result = await generateScene({ character, locale, chosenActionText, freeAction })

  const scene = assembleScene({
    payload: result.scene,
    sessionId: sessionId ?? randomUUID(),
    // First turn until sessions are persisted (out of scope for this ticket).
    turnNumber: 1,
  })

  // choiceId is accepted now but only consumed once sessions are persisted.
  void choiceId

  res.json({ success: true, data: scene })
})
