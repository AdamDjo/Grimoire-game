import { type Request, type Response, Router } from 'express'

import { prisma } from '../lib/prisma'
import {
  abandonSession,
  buildOpeningScene,
  endSessionAtInn,
  getOrCreateSession,
  INVALID_CHOICE,
  performInventoryAction,
  resolveChosenChoice,
  resolveTurn,
  startRun,
} from '../services/session.service'

import {
  createSessionSchema,
  endSessionSchema,
  gameActionSchema,
  inventoryActionSchema,
  startRunSchema,
} from './game-action.schema'

import type {
  ApiResponse,
  InventoryActionResponse,
  SceneResponse,
  SessionEndReason,
} from '@grimoire/shared'

export const gameRouter: Router = Router()

interface EndSessionResponse {
  status: 'ended'
  endReason: SessionEndReason
}

/**
 * POST /api/game/session
 * Loads (or creates) the player's active session and returns its opening scene.
 * Idempotent: replaying returns the same active session's world-state.
 */
gameRouter.post('/session', async (req: Request, res: Response<ApiResponse<SceneResponse>>) => {
  const parsed = createSessionSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    })
    return
  }

  const context = await getOrCreateSession(req.auth!.userId, {
    explicitLocale: parsed.data.explicitLocale,
    browserLocale: parsed.data.locale,
  })
  const response = await buildOpeningScene(context)

  res.json({ success: true, data: response })
})

/**
 * POST /api/game/action
 * Resolves one turn against the persisted world-state. The backend rolls the
 * d20, applies survival + HP and persists the outcome. Refuses (409) once the
 * session has ended (e.g. death) — a finished run cannot be played on.
 */
gameRouter.post('/action', async (req: Request, res: Response<ApiResponse<SceneResponse>>) => {
  const parsed = gameActionSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    })
    return
  }

  const { sessionId, choiceId, chosenActionText, freeAction, engageReturn } = parsed.data
  const userId = req.auth!.userId

  // Scope the session to the caller — a user can only act on their own session.
  const session = await prisma.gameSession.findFirst({
    where: { id: sessionId, character: { userId } },
    include: { character: true },
  })
  if (!session) {
    res.status(404).json({ success: false, error: 'Session not found' })
    return
  }
  if (session.status === 'ended') {
    res.status(409).json({ success: false, error: 'Session has ended' })
    return
  }

  // Resolve the risk from the persisted scene, never from the client. An unknown
  // choiceId is rejected outright — it must not silently degrade to a safe turn.
  const choice = await resolveChosenChoice(sessionId, choiceId, chosenActionText, freeAction)
  if (choice === INVALID_CHOICE) {
    res.status(400).json({ success: false, error: 'Choice does not belong to the current scene' })
    return
  }

  const response = await resolveTurn({
    session,
    character: session.character,
    choice,
    chosenActionText,
    freeAction,
    engageReturn,
  })

  res.json({ success: true, data: response })
})

/**
 * POST /api/game/inventory/action
 * Player-initiated inventory action (use/equip/unequip, #183). Never advances
 * the turn — no AI call, no dice. Rejects (409) once the session has ended.
 */
gameRouter.post(
  '/inventory/action',
  async (req: Request, res: Response<ApiResponse<InventoryActionResponse>>) => {
    const parsed = inventoryActionSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      })
      return
    }

    const response = await performInventoryAction(parsed.data, req.auth!.userId)
    if (!response) {
      res.status(404).json({ success: false, error: 'Active session not found' })
      return
    }

    res.json({ success: true, data: response })
  }
)

/**
 * POST /api/game/session/start-run
 * The player accepts a contract at the inn and sets out (#228). Rejects (409) a
 * session that already carries a contract — a run underway cannot swap its own
 * objective. Returns the current scene, run panel included.
 */
gameRouter.post(
  '/session/start-run',
  async (req: Request, res: Response<ApiResponse<SceneResponse>>) => {
    const parsed = startRunSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      })
      return
    }

    const { sessionId, ...contract } = parsed.data
    const response = await startRun(sessionId, req.auth!.userId, contract)
    if (!response) {
      res.status(409).json({ success: false, error: 'Session cannot start a run' })
      return
    }

    res.json({ success: true, data: response })
  }
)

/**
 * POST /api/game/session/end-inn
 * Voluntary end-of-run: the player clicks "Ton aventure se termine ici" while
 * facing L'Aveugle at the inn. Ends the session and triggers the Chronicle.
 */
gameRouter.post(
  '/session/end-inn',
  async (req: Request, res: Response<ApiResponse<EndSessionResponse>>) => {
    const parsed = endSessionSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      })
      return
    }

    const session = await endSessionAtInn(parsed.data.sessionId, req.auth!.userId)
    if (!session) {
      res.status(404).json({ success: false, error: 'Active session not found' })
      return
    }

    res.json({ success: true, data: { status: 'ended', endReason: 'abandon' } })
  }
)

/**
 * POST /api/game/session/abandon
 * Explicit "Abandonner ce perso" click. Ends the session and triggers the
 * Chronicle. The 30-day-inactivity path is a separate job, not this route.
 */
gameRouter.post(
  '/session/abandon',
  async (req: Request, res: Response<ApiResponse<EndSessionResponse>>) => {
    const parsed = endSessionSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      })
      return
    }

    const session = await abandonSession(parsed.data.sessionId, req.auth!.userId)
    if (!session) {
      res.status(404).json({ success: false, error: 'Active session not found' })
      return
    }

    res.json({ success: true, data: { status: 'ended', endReason: 'abandon' } })
  }
)
