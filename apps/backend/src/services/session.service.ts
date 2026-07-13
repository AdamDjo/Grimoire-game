import {
  type Attributes,
  type Choice,
  type Locale,
  type SceneResponse,
  type SessionEndReason,
  type SurvivalStats,
  getPeople,
  getVocation,
  maxHpFromBlood,
} from '@grimoire/shared'

import { generateScene } from '../ai/game-master.service'
import { persistedChoicesSchema } from '../ai/scene-validator'
import { resolveChoice } from '../game-rules/consequences'
import { prisma } from '../lib/prisma'

import { compressScene } from './memory.service'
import { assembleScene } from './scene-assembler'

import type { Character as DbCharacter, GameSession } from '../generated/prisma/client'

/**
 * Provisional seed character (Yarel of the Salt Roads) — the same canon build
 * the demo used, now owned by the backend. Replaced by character creation
 * (the Forge) later; the `Character` contract stays stable, only the source moves.
 */
const SEED = { vocationId: 'salt-walker', peopleId: 'sahelin' } as const

/** Derives the seed character's attributes from the canon vocation + people. */
function buildSeedCharacter(): {
  name: string
  people: string
  vocation: string
  attributes: Attributes
  maxHp: number
} {
  const vocation = getVocation(SEED.vocationId)
  const people = getPeople(SEED.peopleId)
  if (!vocation || !people) {
    throw new Error('session.service: missing canon vocation or people for seed')
  }

  const attributes: Attributes = {
    blood: vocation.baseAttributes.blood + (people.attributeBonus.blood ?? 0),
    breath: vocation.baseAttributes.breath + (people.attributeBonus.breath ?? 0),
    ash: vocation.baseAttributes.ash + (people.attributeBonus.ash ?? 0),
  }

  return {
    name: 'Yarel of the Salt Roads',
    people: people.id,
    vocation: vocation.id,
    attributes,
    maxHp: maxHpFromBlood(attributes.blood),
  }
}

/** Reads a DB character row into the shared attribute/survival shapes. */
function readCharacter(character: DbCharacter): {
  attributes: Attributes
  survival: SurvivalStats
} {
  return {
    attributes: { blood: character.blood, breath: character.breath, ash: character.ash },
    survival: {
      hp: character.hp,
      maxHp: character.maxHp,
      thirst: character.thirst,
      hunger: character.hunger,
      energy: character.energy,
      calamine: character.calamine,
    },
  }
}

/** Flattens survival stats into the display record the client HUD reads. */
function toStatsRecord(survival: SurvivalStats): Record<string, number> {
  return {
    hp: survival.hp,
    maxHp: survival.maxHp,
    thirst: survival.thirst,
    hunger: survival.hunger,
    energy: survival.energy,
    calamine: survival.calamine,
  }
}

export interface SessionContext {
  session: GameSession
  character: DbCharacter
}

/**
 * Returns the user's active session, creating the seed character and an active
 * session on first play. Idempotent: one character and one active session per
 * user. The world-state lives in the DB — this is the single source of truth.
 */
export async function getOrCreateSession(userId: string): Promise<SessionContext> {
  const existing = await prisma.gameSession.findFirst({
    where: { status: 'active', character: { userId } },
    include: { character: true },
    orderBy: { createdAt: 'desc' },
  })
  if (existing) {
    return { session: existing, character: existing.character }
  }

  const seed = buildSeedCharacter()
  const character =
    (await prisma.character.findFirst({ where: { userId } })) ??
    (await prisma.character.create({
      data: {
        userId,
        name: seed.name,
        people: seed.people,
        vocation: seed.vocation,
        blood: seed.attributes.blood,
        breath: seed.attributes.breath,
        ash: seed.attributes.ash,
        hp: seed.maxHp,
        maxHp: seed.maxHp,
        thirst: 100,
        hunger: 100,
        energy: 100,
        calamine: 0,
        conditions: [],
      },
    }))

  const session = await prisma.gameSession.create({
    data: { characterId: character.id },
  })

  return { session, character }
}

/**
 * Rebuilds a `SceneResponse` from the session's latest persisted scene, so a
 * resume replays the *exact* stored choices (same ids the action route validates
 * against) instead of regenerating them. Returns null for a session with no turn
 * logged yet. The persisted scene is the source of truth — never regenerated.
 */
async function resumeLatestScene({
  session,
  character,
}: SessionContext): Promise<SceneResponse | null> {
  const last = await prisma.sceneLog.findFirst({
    where: { sessionId: session.id },
    orderBy: { turnNumber: 'desc' },
  })
  if (!last) {
    return null
  }

  const choices = persistedChoicesSchema.safeParse(last.choices)
  const { survival } = readCharacter(character)
  const source = last.source === 'ai' ? 'ai' : 'stub'

  const scene: SceneResponse['scene'] = {
    id: last.id,
    sessionId: session.id,
    turnNumber: last.turnNumber,
    narrative: last.narrative,
    choices: choices.success ? choices.data : [],
    sceneType: last.sceneType as SceneResponse['scene']['sceneType'],
    location: last.location,
    createdAt: last.createdAt.toISOString(),
  }

  return {
    scene,
    updatedStats: toStatsRecord(survival),
    updatedInventory: [],
    notifications: [],
    source,
  }
}

/**
 * Builds the opening `SceneResponse` for a session. On a brand-new session
 * (no turn yet) it generates the establishing scene from the Game Master and
 * persists it. On a resumed session it replays the latest persisted scene so
 * the returned choice ids match what the action route will validate — no
 * regeneration, no duplicate turn-1 SceneLog. No choice was taken either way,
 * so no roll and no drain.
 */
export async function buildOpeningScene(
  context: SessionContext,
  locale: Locale
): Promise<SceneResponse> {
  const resumed = await resumeLatestScene(context)
  if (resumed) {
    return resumed
  }

  const { session, character } = context
  const { attributes, survival } = readCharacter(character)

  const gm = await generateScene({
    character: toGmCharacter(character, attributes, survival),
    locale,
    sessionId: session.id,
  })
  const scene = assembleScene({
    payload: gm.scene,
    sessionId: session.id,
    turnNumber: session.turnNumber,
  })

  await prisma.sceneLog.create({
    data: {
      sessionId: session.id,
      turnNumber: session.turnNumber,
      sceneType: scene.sceneType,
      location: scene.location,
      narrative: scene.narrative,
      turnSummary: gm.scene.turnSummary,
      choices: scene.choices as unknown as object,
      source: gm.source,
    },
  })

  return {
    scene,
    updatedStats: toStatsRecord(survival),
    updatedInventory: [],
    notifications: [],
    source: gm.source,
  }
}

/**
 * Sentinel returned by `resolveChosenChoice` when a `choiceId` was supplied but
 * does not belong to the session's current (latest) scene — the caller must
 * reject the turn rather than silently downgrade it to a safe action.
 */
export const INVALID_CHOICE = Symbol('invalid-choice')

/**
 * Resolves the `Choice` that drives a turn's mechanics from the persisted
 * world-state — never from client-supplied risk. When a `choiceId` is given it
 * is looked up in the latest scene's stored `choices`; its real `type`/`riskLevel`
 * decide the d20 and stakes. An unknown `choiceId` yields `INVALID_CHOICE`.
 * A free-form action (no `choiceId`) is a deliberate safe, no-roll turn.
 */
export async function resolveChosenChoice(
  sessionId: string,
  choiceId: string | undefined,
  chosenActionText: string | undefined,
  freeAction: string | undefined
): Promise<Choice | typeof INVALID_CHOICE> {
  if (!choiceId) {
    return { id: 'free-action', text: freeAction ?? '', type: 'action', riskLevel: 'safe' }
  }

  const lastScene = await prisma.sceneLog.findFirst({
    where: { sessionId },
    orderBy: { turnNumber: 'desc' },
  })
  const choices = persistedChoicesSchema.safeParse(lastScene?.choices)
  const chosen = choices.success ? choices.data.find((c) => c.id === choiceId) : undefined
  if (!chosen) {
    return INVALID_CHOICE
  }

  return {
    id: chosen.id,
    text: chosenActionText ?? chosen.text,
    type: chosen.type,
    riskLevel: chosen.riskLevel,
  }
}

export interface ResolveTurnInput {
  session: GameSession
  character: DbCharacter
  /** The choice that drives this turn, already resolved from the persisted scene. */
  choice: Choice
  chosenActionText?: string
  freeAction?: string
  locale: Locale
}

/**
 * Resolves one turn against the persisted world-state. The backend owns every
 * mechanic: it rolls the d20 (via `resolveChoice`), applies survival + HP,
 * persists the outcome, and — on death (`hp<=0`) — ends the session with
 * `endReason='death'`. The AI only narrates. Returns the enriched `SceneResponse`.
 */
export async function resolveTurn(input: ResolveTurnInput): Promise<SceneResponse> {
  const { session, character, choice, chosenActionText, freeAction, locale } = input
  const { attributes, survival } = readCharacter(character)

  const resolution = resolveChoice({ attributes, survival, choice })

  const gm = await generateScene({
    character: toGmCharacter(character, attributes, resolution.updatedSurvival),
    locale,
    sessionId: session.id,
    chosenActionText,
    freeAction,
  })

  const nextTurn = session.turnNumber + 1
  const scene = assembleScene({
    payload: gm.scene,
    sessionId: session.id,
    turnNumber: nextTurn,
    consequences: resolution.consequences,
  })

  const endReason: SessionEndReason | null = resolution.gameOver ? 'death' : null

  await prisma.$transaction([
    prisma.sceneLog.create({
      data: {
        sessionId: session.id,
        turnNumber: nextTurn,
        sceneType: scene.sceneType,
        location: scene.location,
        narrative: scene.narrative,
        turnSummary: gm.scene.turnSummary,
        choices: scene.choices as unknown as object,
        chosenChoice: choice.text ? (choice as unknown as object) : undefined,
        consequences: resolution.consequences as unknown as object,
        diceRoll: (resolution.diceRoll as unknown as object) ?? undefined,
        source: gm.source,
      },
    }),
    prisma.character.update({
      where: { id: character.id },
      data: {
        hp: resolution.updatedSurvival.hp,
        thirst: resolution.updatedSurvival.thirst,
        hunger: resolution.updatedSurvival.hunger,
        energy: resolution.updatedSurvival.energy,
        calamine: resolution.updatedSurvival.calamine,
      },
    }),
    prisma.gameSession.update({
      where: { id: session.id },
      data: {
        turnNumber: nextTurn,
        location: scene.location,
        ...(resolution.gameOver ? { status: 'ended', endReason } : {}),
      },
    }),
  ])

  if (nextTurn % 8 === 0) {
    void (async () => {
      try {
        const recentTurns = await prisma.sceneLog.findMany({
          where: { sessionId: session.id },
          orderBy: { turnNumber: 'desc' },
          take: 8,
        })
        await compressScene(
          session.id,
          recentTurns,
          toGmCharacter(character, attributes, resolution.updatedSurvival),
          scene.location
        )
      } catch (err) {
        console.warn(`[Memory] failed to load turns for session ${session.id}:`, err)
      }
    })()
  }

  return {
    scene,
    updatedStats: toStatsRecord(resolution.updatedSurvival),
    updatedInventory: [],
    notifications: [],
    diceRoll: resolution.diceRoll,
    source: gm.source,
  }
}

/** Assembles the shared `Character` shape the Game Master prompt expects. */
function toGmCharacter(character: DbCharacter, attributes: Attributes, survival: SurvivalStats) {
  return {
    id: character.id,
    userId: character.userId,
    name: character.name,
    people: character.people,
    vocation: character.vocation,
    stats: { attributes, survival, conditions: [] as never[] },
    createdAt: character.createdAt.toISOString(),
  }
}
