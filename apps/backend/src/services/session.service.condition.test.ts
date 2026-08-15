import { beforeEach, describe, expect, it, vi } from 'vitest'

const transaction = vi.fn().mockResolvedValue(undefined)
const sceneLogCreate = vi.fn()
const characterUpdate = vi.fn()
const gameSessionUpdate = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: {
    $transaction: transaction,
    sceneLog: { create: sceneLogCreate, findMany: vi.fn().mockResolvedValue([]) },
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

vi.mock('./memory.service', () => ({ compressScene: vi.fn().mockResolvedValue(undefined) }))

const generateChronicle = vi.fn().mockResolvedValue({ generated: true })
vi.mock('./chronicle.service', () => ({ generateChronicle }))

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
  will: 10,
  hp: 20,
  maxHp: 20,
  thirst: 100,
  hunger: 100,
  energy: 100,
  calamine: 0,
  activeConditions: [],
  inventory: [],
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

const choice = {
  id: 'c1',
  text: 'wade into the marsh',
  type: 'action' as const,
  riskLevel: 'medium' as const,
}

/** Reads the `data` payload passed to the mocked `character.update` call. */
function lastCharacterUpdateData(): { activeConditions: unknown; calamine?: number } {
  const call = characterUpdate.mock.calls.at(-1) as
    | [{ data: { activeConditions: unknown; calamine?: number } }]
    | undefined
  if (!call) throw new Error('character.update was not called')
  return call[0].data
}

/** Reads the `data` payload passed to the mocked `gameSession.update` call. */
function lastGameSessionUpdateData(): { status?: string; endReason?: string | null } {
  const call = gameSessionUpdate.mock.calls.at(-1) as
    | [{ data: { status?: string; endReason?: string | null } }]
    | undefined
  if (!call) throw new Error('gameSession.update was not called')
  return call[0].data
}

describe('resolveTurn — AI-proposed condition persistence (#181)', () => {
  beforeEach(() => {
    transaction.mockClear()
    characterUpdate.mockClear()

    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 20, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 0 },
      updatedConditions: [],
      consequences: {},
      gameOver: false,
    })
    assembleScene.mockReturnValue({
      sceneType: 'exploration',
      location: 'The Marsh',
      narrative: 'text',
      choices: [],
    })
  })

  it('merges a valid IA-family condition proposal into the persisted activeConditions', async () => {
    generateScene.mockResolvedValue({
      scene: { apply_condition: { id: 'marsh_disease', reason: 'waded through the marsh' } },
      source: 'ai',
    })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().activeConditions).toEqual([
      { id: 'marsh_disease', source: 'ai', appliedAtTurn: 4, expiresRule: { type: 'until_cured' } },
    ])
  })

  it('rejects a BACKEND-family id proposed by the AI (never a valid AI proposal)', async () => {
    generateScene.mockResolvedValue({
      scene: { apply_condition: { id: 'fever', reason: 'trying to sneak in a backend condition' } },
      source: 'ai',
    })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().activeConditions).toEqual([])
  })

  it('leaves conditions untouched when the AI omits apply_condition', async () => {
    generateScene.mockResolvedValue({ scene: {}, source: 'ai' })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().activeConditions).toEqual([])
  })

  it('does not duplicate a condition the character already has active', async () => {
    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 20, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 0 },
      updatedConditions: [
        { id: 'poison', source: 'ai', appliedAtTurn: 1, expiresRule: { type: 'until_cured' } },
      ],
      consequences: {},
      gameOver: false,
    })
    generateScene.mockResolvedValue({
      scene: { apply_condition: { id: 'poison', reason: 'still in the poisonous marsh' } },
      source: 'ai',
    })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().activeConditions).toEqual([
      { id: 'poison', source: 'ai', appliedAtTurn: 1, expiresRule: { type: 'until_cured' } },
    ])
  })
})

describe('resolveTurn — Calamine sources and transformation (#182)', () => {
  beforeEach(() => {
    transaction.mockClear()
    characterUpdate.mockClear()
    gameSessionUpdate.mockClear()
    generateChronicle.mockClear()

    assembleScene.mockReturnValue({
      sceneType: 'exploration',
      location: 'The Marsh',
      narrative: 'text',
      choices: [],
    })
  })

  it('applies a validated cendre_corrupt delta to the Calamine gauge', async () => {
    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 20, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 10 },
      updatedConditions: [],
      consequences: {},
      gameOver: false,
    })
    generateScene.mockResolvedValue({
      scene: {
        apply_condition: {
          id: 'cendre_corrupt',
          reason: 'exposed to archontic light',
          calamineDelta: 15,
        },
      },
      source: 'ai',
    })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().calamine).toBe(25)
  })

  it('caps the applied delta at +20/turn even if the AI proposes more', async () => {
    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 20, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 0 },
      updatedConditions: [],
      consequences: {},
      gameOver: false,
    })
    generateScene.mockResolvedValue({
      scene: {
        apply_condition: {
          id: 'cendre_corrupt',
          reason: 'watcher presence',
          calamineDelta: 999,
        },
      },
      source: 'ai',
    })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().calamine).toBe(20)
  })

  it('ignores a calamineDelta attached to a non-cendre_corrupt proposal', async () => {
    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 20, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 10 },
      updatedConditions: [],
      consequences: {},
      gameOver: false,
    })
    generateScene.mockResolvedValue({
      scene: {
        apply_condition: { id: 'poison', reason: 'venomous bite', calamineDelta: 50 },
      },
      source: 'ai',
    })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().calamine).toBe(10)
  })

  it('leaves the gauge untouched when the AI omits apply_condition (no passive drain)', async () => {
    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 20, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 40 },
      updatedConditions: [],
      consequences: {},
      gameOver: false,
    })
    generateScene.mockResolvedValue({ scene: {}, source: 'ai' })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().calamine).toBe(40)
  })

  it('transforms into Calciné at 100: ends the session with endReason "calcined"', async () => {
    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 20, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 85 },
      updatedConditions: [],
      consequences: {},
      gameOver: false,
    })
    generateScene.mockResolvedValue({
      scene: {
        apply_condition: {
          id: 'cendre_corrupt',
          reason: 'excessive ritual magic',
          calamineDelta: 20,
        },
      },
      source: 'ai',
    })

    const response = await resolveTurn({ session: session(3), character, choice })

    expect(lastCharacterUpdateData().calamine).toBe(100)
    expect(lastGameSessionUpdateData()).toMatchObject({ status: 'ended', endReason: 'calcined' })
    expect(response.endReason).toBe('calcined')
    expect(response.survival.calamine).toBe(100)
    expect(response.activeConditions).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'cendre_corrupt' })])
    )
    expect(generateChronicle).toHaveBeenCalledWith('s1')
  })

  it('reports "death" over "calcined" when HP-death and Calamine=100 happen the same turn', async () => {
    resolveChoice.mockReturnValue({
      updatedSurvival: { hp: 0, maxHp: 20, thirst: 95, hunger: 95, energy: 95, calamine: 100 },
      updatedConditions: [],
      consequences: { gameOver: true },
      gameOver: true,
    })
    generateScene.mockResolvedValue({ scene: {}, source: 'ai' })

    await resolveTurn({ session: session(3), character, choice })

    expect(lastGameSessionUpdateData()).toMatchObject({ status: 'ended', endReason: 'death' })
  })
})
