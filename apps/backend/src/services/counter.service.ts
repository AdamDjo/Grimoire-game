import { randomUUID } from 'node:crypto'

import { buildPreparationSnapshot, resolvePurchase } from '../game-rules/counter'
import { prisma } from '../lib/prisma'

import { countCarriedSupplies } from './run.service'

import type {
  CounterPurchaseRequest,
  CounterPurchaseResult,
  PersistedInventoryItem,
  PreparationSnapshot,
} from '@grimoire/shared'

/**
 * The Comptoir (#249): persistence for the Inn's supply counter.
 *
 * No rule lives here — arbitration is in `game-rules/counter.ts`. This module
 * only reads the character row, hands the state to the pure rules, and writes
 * the outcome back inside a transaction.
 *
 * @see docs/canon/23-RUN-STRUCTURE.md §1
 */

/** Prisma's unique-constraint violation — the concurrency signal we rely on. */
const UNIQUE_VIOLATION = 'P2002'

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === UNIQUE_VIOLATION
  )
}

export class CharacterNotFoundError extends Error {
  constructor() {
    super('Character not found')
    this.name = 'CharacterNotFoundError'
  }
}

/**
 * Everything the player needs to decide whether they are ready to leave.
 * Fully backend-computed: the client renders it and calculates nothing.
 */
export async function getPreparationSnapshot(userId: string): Promise<PreparationSnapshot> {
  const character = await prisma.character.findFirst({ where: { userId } })
  if (!character) throw new CharacterNotFoundError()

  const inventory = character.inventory as unknown as PersistedInventoryItem[]

  return buildPreparationSnapshot(inventory, character.gold, countCarriedSupplies(inventory))
}

/**
 * Rebuilds the response for an already-processed purchase. The gold figures
 * come from the stored row (what was actually charged, then), while the
 * inventory is read live — the client asked "what happened to my purchase",
 * but it must render the bag as it stands now, not as it stood at the time.
 */
function replayResult(
  stored: { totalGold: number; goldAfter: number },
  inventory: PersistedInventoryItem[]
): CounterPurchaseResult {
  return {
    accepted: true,
    totalGold: stored.totalGold,
    goldAfter: stored.goldAfter,
    inventory,
    replayed: true,
  }
}

/**
 * Buys from the closed catalogue, atomically and idempotently.
 *
 * Concurrency: the read-decide-write cycle runs inside a transaction, and the
 * `CounterPurchase` insert carries the `(characterId, purchaseId)` unique
 * index. Two simultaneous requests bearing the same `purchaseId` therefore
 * race on that index rather than on the gold balance — the loser gets P2002
 * and replays the winner's result instead of debiting twice.
 *
 * A refusal writes nothing at all, so the same `purchaseId` stays usable: the
 * player can drop a line from a bag-full basket and retry with it.
 */
export async function purchaseFromCounter(
  userId: string,
  request: CounterPurchaseRequest
): Promise<CounterPurchaseResult> {
  const { purchaseId, lines } = request

  try {
    return await prisma.$transaction(async (tx) => {
      const character = await tx.character.findFirst({ where: { userId } })
      if (!character) throw new CharacterNotFoundError()

      const inventory = character.inventory as unknown as PersistedInventoryItem[]

      const existing = await tx.counterPurchase.findUnique({
        where: { characterId_purchaseId: { characterId: character.id, purchaseId } },
      })
      if (existing) return replayResult(existing, inventory)

      const resolved = resolvePurchase(inventory, lines, character.gold, randomUUID)

      if (resolved.refusal) {
        return {
          accepted: false,
          refusal: resolved.refusal,
          totalGold: 0,
          goldAfter: character.gold,
          inventory,
          replayed: false,
        }
      }

      const goldAfter = character.gold - resolved.totalGold

      await tx.counterPurchase.create({
        data: {
          characterId: character.id,
          purchaseId,
          lines: lines as unknown as object,
          totalGold: resolved.totalGold,
          goldAfter,
        },
      })

      await tx.character.update({
        where: { id: character.id },
        data: {
          gold: goldAfter,
          inventory: resolved.items as unknown as object,
        },
      })

      return {
        accepted: true,
        totalGold: resolved.totalGold,
        goldAfter,
        inventory: resolved.items,
        replayed: false,
      }
    })
  } catch (error) {
    if (!isUniqueViolation(error)) throw error

    // The concurrent twin committed first. Read back what it wrote.
    const character = await prisma.character.findFirst({ where: { userId } })
    if (!character) throw new CharacterNotFoundError()

    const stored = await prisma.counterPurchase.findUnique({
      where: { characterId_purchaseId: { characterId: character.id, purchaseId } },
    })
    if (!stored) throw error

    return replayResult(stored, character.inventory as unknown as PersistedInventoryItem[])
  }
}
