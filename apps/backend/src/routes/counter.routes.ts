import { type Request, type Response, Router } from 'express'

import {
  CharacterNotFoundError,
  getPreparationSnapshot,
  purchaseFromCounter,
} from '../services/counter.service'

import { counterPurchaseSchema } from './counter.schema'

import type { ApiResponse, CounterPurchaseResult, PreparationSnapshot } from '@grimoire/shared'

export const counterRouter: Router = Router()

/**
 * The Comptoir (#249) — the Inn's supply counter. Thin controller: validation
 * and HTTP status only, every rule lives in `game-rules/counter.ts`.
 * @see docs/public/raw/23-RUN-STRUCTURE.md §1
 */

/**
 * GET /api/inn/preparation
 * The complete pre-departure snapshot: gold, bag occupancy, supplies carried,
 * and the closed catalogue with affordability already resolved per entry.
 */
counterRouter.get(
  '/preparation',
  async (req: Request, res: Response<ApiResponse<PreparationSnapshot>>) => {
    try {
      const data = await getPreparationSnapshot(req.auth!.userId)
      res.json({ success: true, data })
    } catch (error) {
      if (error instanceof CharacterNotFoundError) {
        res.status(404).json({ success: false, error: 'Character not found' })
        return
      }
      throw error
    }
  }
)

/**
 * POST /api/inn/counter/purchase
 * Buys from the closed catalogue. Atomic (all lines or none) and idempotent on
 * `purchaseId`.
 *
 * A refusal is 200, not 4xx: "you cannot afford this" / "your bag is full" is
 * a legitimate game answer the client renders as such, not a malformed
 * request. 400 stays reserved for payloads that fail the contract.
 */
counterRouter.post(
  '/counter/purchase',
  async (req: Request, res: Response<ApiResponse<CounterPurchaseResult>>) => {
    const parsed = counterPurchaseSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      })
      return
    }

    try {
      const data = await purchaseFromCounter(req.auth!.userId, parsed.data)
      res.json({ success: true, data })
    } catch (error) {
      if (error instanceof CharacterNotFoundError) {
        res.status(404).json({ success: false, error: 'Character not found' })
        return
      }
      throw error
    }
  }
)
