import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PersistedInventoryItem } from '@grimoire/shared'

const characterFindFirst = vi.fn()
const characterUpdate = vi.fn()
const purchaseFindUnique = vi.fn()
const purchaseCreate = vi.fn()

/**
 * The transaction client. Declared on its own so `$transaction` below can hand
 * it back without `prismaMock` referencing itself in its own initializer.
 */
const txMock = {
  character: { findFirst: characterFindFirst, update: characterUpdate },
  counterPurchase: { findUnique: purchaseFindUnique, create: purchaseCreate },
}

const prismaMock = {
  ...txMock,
  // The service runs its read-decide-write cycle in an interactive transaction;
  // the mock just hands the same client back.
  $transaction: vi.fn(<T>(fn: (tx: typeof txMock) => Promise<T>): Promise<T> => fn(txMock)),
}

vi.mock('../lib/prisma', () => ({ prisma: prismaMock }))

const { CharacterNotFoundError, getPreparationSnapshot, purchaseFromCounter } =
  await import('./counter.service')

const USER_ID = 'user-1'
const PURCHASE_ID = '11111111-1111-4111-8111-111111111111'

function character(overrides: Record<string, unknown> = {}) {
  return {
    id: 'character-1',
    userId: USER_ID,
    gold: 50,
    inventory: [] as PersistedInventoryItem[],
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  purchaseFindUnique.mockResolvedValue(null)
  purchaseCreate.mockResolvedValue({})
  characterUpdate.mockResolvedValue({})
})

describe('getPreparationSnapshot', () => {
  it('projects gold, bag and catalogue from the persisted character', async () => {
    characterFindFirst.mockResolvedValue(character({ gold: 6 }))

    const snapshot = await getPreparationSnapshot(USER_ID)

    expect(snapshot.gold).toBe(6)
    expect(snapshot.bagUsed).toBe(0)
    expect(snapshot.catalogue.length).toBeGreaterThan(0)
  })

  it('counts supplies structurally, not by name', async () => {
    // A deliberately unhelpful display name: only `supply` says what it is.
    characterFindFirst.mockResolvedValue(
      character({
        inventory: [
          { id: 'x', name: 'Flacon trouble', category: 'bag', quantity: 3, supply: 'water' },
        ] as PersistedInventoryItem[],
      })
    )

    const snapshot = await getPreparationSnapshot(USER_ID)
    expect(snapshot.supplies).toEqual({ water: 3, food: 0 })
  })

  it('throws when the user has no character', async () => {
    characterFindFirst.mockResolvedValue(null)
    await expect(getPreparationSnapshot(USER_ID)).rejects.toThrow(CharacterNotFoundError)
  })
})

describe('purchaseFromCounter', () => {
  it('debits gold and persists both the inventory and the transaction', async () => {
    characterFindFirst.mockResolvedValue(character({ gold: 10 }))

    const result = await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'waterskin', quantity: 2 }],
    })

    expect(result.accepted).toBe(true)
    expect(result.totalGold).toBe(4)
    expect(result.goldAfter).toBe(6)
    expect(result.replayed).toBe(false)

    const updateArgs = characterUpdate.mock.calls[0][0] as { data: { gold: number } }
    expect(updateArgs.data.gold).toBe(6)

    const createArgs = purchaseCreate.mock.calls[0][0] as {
      data: { purchaseId: string; totalGold: number; goldAfter: number }
    }
    expect(createArgs.data).toMatchObject({
      purchaseId: PURCHASE_ID,
      totalGold: 4,
      goldAfter: 6,
    })
  })

  it('refuses an unaffordable basket without writing anything', async () => {
    characterFindFirst.mockResolvedValue(character({ gold: 1 }))

    const result = await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'bandages', quantity: 1 }],
    })

    expect(result.accepted).toBe(false)
    expect(result.refusal).toBe('insufficient_gold')
    expect(result.goldAfter).toBe(1)
    expect(characterUpdate).not.toHaveBeenCalled()
    expect(purchaseCreate).not.toHaveBeenCalled()
  })

  it('refuses a full bag without writing anything', async () => {
    characterFindFirst.mockResolvedValue(
      character({
        gold: 999,
        inventory: [
          { id: 'x', name: 'Butin', category: 'bag', quantity: 12 },
        ] as PersistedInventoryItem[],
      })
    )

    const result = await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'rations', quantity: 1 }],
    })

    expect(result.refusal).toBe('bag_full')
    expect(characterUpdate).not.toHaveBeenCalled()
  })

  it('leaves the purchaseId reusable after a refusal', async () => {
    characterFindFirst.mockResolvedValue(character({ gold: 1 }))
    await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'bandages', quantity: 1 }],
    })

    // Player drops the expensive line and retries with the same id.
    characterFindFirst.mockResolvedValue(character({ gold: 1 }))
    const retry = await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'rations', quantity: 1 }],
    })

    expect(retry.accepted).toBe(true)
    expect(retry.replayed).toBe(false)
  })

  it('replays a known purchaseId without charging twice', async () => {
    characterFindFirst.mockResolvedValue(character({ gold: 6 }))
    purchaseFindUnique.mockResolvedValue({ totalGold: 4, goldAfter: 6 })

    const result = await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'waterskin', quantity: 2 }],
    })

    expect(result.accepted).toBe(true)
    expect(result.replayed).toBe(true)
    expect(result.totalGold).toBe(4)
    expect(result.goldAfter).toBe(6)
    expect(characterUpdate).not.toHaveBeenCalled()
    expect(purchaseCreate).not.toHaveBeenCalled()
  })

  it('replays the winner result when a concurrent twin commits first (P2002)', async () => {
    characterFindFirst.mockResolvedValue(character({ gold: 10 }))
    // The insert loses the race on the (characterId, purchaseId) unique index.
    purchaseCreate.mockRejectedValue(Object.assign(new Error('unique'), { code: 'P2002' }))
    // The post-catch read finds what the winner wrote.
    purchaseFindUnique.mockResolvedValueOnce(null).mockResolvedValue({ totalGold: 4, goldAfter: 6 })

    const result = await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'waterskin', quantity: 2 }],
    })

    expect(result.accepted).toBe(true)
    expect(result.replayed).toBe(true)
    expect(result.goldAfter).toBe(6)
  })

  it('propagates a non-unique database failure instead of swallowing it', async () => {
    characterFindFirst.mockResolvedValue(character())
    purchaseCreate.mockRejectedValue(Object.assign(new Error('connection lost'), { code: 'P1001' }))

    await expect(
      purchaseFromCounter(USER_ID, {
        purchaseId: PURCHASE_ID,
        lines: [{ itemId: 'rations', quantity: 1 }],
      })
    ).rejects.toThrow('connection lost')
  })

  it('purchased supplies are counted by the return estimate on resume', async () => {
    characterFindFirst.mockResolvedValue(character({ gold: 10 }))

    const result = await purchaseFromCounter(USER_ID, {
      purchaseId: PURCHASE_ID,
      lines: [{ itemId: 'waterskin', quantity: 2 }],
    })

    // Simulate reloading the session from what was persisted.
    characterFindFirst.mockResolvedValue(
      character({ gold: result.goldAfter, inventory: result.inventory })
    )
    const snapshot = await getPreparationSnapshot(USER_ID)

    expect(snapshot.supplies).toEqual({ water: 2, food: 0 })
    expect(snapshot.bagUsed).toBe(2)
    expect(snapshot.gold).toBe(6)
  })
})
