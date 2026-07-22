import { beforeEach, describe, expect, it, vi } from 'vitest'

const transaction = vi.fn().mockResolvedValue(undefined)
const sceneLogCreate = vi.fn()
const sceneLogFindMany = vi.fn().mockResolvedValue([])
const characterUpdate = vi.fn()
const gameSessionUpdate = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: {
    $transaction: transaction,
    sceneLog: { create: sceneLogCreate, findMany: sceneLogFindMany },
    character: { update: characterUpdate },
    gameSession: { update: gameSessionUpdate },
  },
}))

const resolveChoice = vi.fn()
vi.mock('../game-rules/consequences', () => ({ resolveChoice }))

const generateScene = vi.fn()
vi.mock('../ai/game-master.service', () => ({ generateScene }))

const assembleScene = vi.fn()
vi.mock('./scene-assembler', () => ({ assembleScene }))

const compressScene = vi.fn().mockResolvedValue(undefined)
vi.mock('./memory.service', () => ({ compressScene }))

const { resolveTurn } = await import('./session.service')

import type { Character as DbCharacter, GameSession } from '../generated/prisma/client'

const character = {
  id: 'char1',
  userId: 'user1',
  name: 'Yarel of the Salt Roads',
  people: 'sahelin',
  vocation: 'salt-walker',
  blood: 10,
  breath: 10,
  ash: 10,
  hp: 20,
  maxHp: 20,
  thirst: 100,
  hunger: 100,
  energy: 100,
  calamine: 0,
  conditions: [],
  createdAt: new Date(),
} as unknown as DbCharacter

function session(turnNumber: number): GameSession {
  return {
    id: 's1',
    characterId: 'char1',
    turnNumber,
    location: 'Calamine',
    locale: 'en',
    status: 'active',
    endReason: null,
    createdAt: new Date(),
  } as unknown as GameSession
}

const choice = { id: 'c1', text: 'move on', type: 'action' as const, riskLevel: 'safe' as const }

describe('resolveTurn — N2 compression trigger', () => {
  beforeEach(() => {
    transaction.mockClear()
    sceneLogFindMany.mockClear()
    compressScene.mockClear()

    resolveChoice.mockReturnValue({
      updatedSurvival: {
        hp: 20,
        maxHp: 20,
        thirst: 95,
        hunger: 95,
        energy: 95,
        calamine: 0,
      },
      consequences: {},
      gameOver: false,
    })
    generateScene.mockResolvedValue({ scene: {}, source: 'ai' })
    assembleScene.mockReturnValue({
      sceneType: 'exploration',
      location: 'Calamine',
      narrative: 'text',
      choices: [],
    })
  })

  it('does not trigger compression on a turn that is not a multiple of 8', async () => {
    await resolveTurn({ session: session(6), character, choice })
    // Flush any fire-and-forget microtasks.
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(sceneLogFindMany).not.toHaveBeenCalled()
    expect(compressScene).not.toHaveBeenCalled()
  })

  it('triggers compression fire-and-forget when the next turn is a multiple of 8', async () => {
    const result = await resolveTurn({ session: session(7), character, choice })
    expect(result).toBeDefined()

    // compressScene is fire-and-forget: resolveTurn must not await it.
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(sceneLogFindMany).toHaveBeenCalledWith({
      where: { sessionId: 's1' },
      orderBy: { turnNumber: 'desc' },
      take: 8,
    })
    expect(compressScene).toHaveBeenCalledTimes(1)
    expect(compressScene.mock.calls[0][0]).toBe('s1')
  })
})
