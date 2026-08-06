import { randomUUID } from 'node:crypto'

import {
  type ActiveCondition,
  type Attributes,
  type Choice,
  type InventoryActionResponse,
  type InventoryItemRef,
  type Locale,
  type PersistedInventoryItem,
  resolveLocale,
  type SceneResponse,
  type SessionEndReason,
  type SurvivalStats,
} from '@grimoire/shared'

import { generateScene } from '../ai/game-master.service'
import { persistedChoicesSchema } from '../ai/scene-validator'
import {
  applyAiCondition,
  applyCalamineDelta,
  calamineTier,
  isValidAiConditionId,
} from '../game-rules/conditions'
import { resolveChoice } from '../game-rules/consequences'
import { acquireItem, equipItem, unequipItem, useItem } from '../game-rules/inventory'
import { applyRest } from '../game-rules/rest'
import { clearDyingOnHeal } from '../game-rules/survival'
import { prisma } from '../lib/prisma'

import { deriveAttributes } from './character.service'
import { generateChronicle } from './chronicle.service'
import { compressScene } from './memory.service'
import { assembleScene } from './scene-assembler'
import { validateAndPersistSouvenirCandidate } from './souvenir.service'

import type { Character as DbCharacter, GameSession } from '../generated/prisma/client'
import type { InventoryActionRequest } from '../routes/game-action.schema'

/**
 * Fallback seed character (Yarel of the Salt Roads), the same canon build the
 * demo used. Character creation (the Forge, #146) is now the primary path —
 * `POST /api/character` persists the real `Character` before a session ever
 * starts. This seed only covers a session request that somehow reaches the
 * backend with no character on file (e.g. dev/test shortcuts, or a client
 * bypassing the Forge) so `POST /api/game/session` never hard-fails; it logs
 * a warning so that path is visible rather than silent.
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
  const { attributes, maxHp } = deriveAttributes(SEED.peopleId, SEED.vocationId)

  return {
    name: 'Yarel of the Salt Roads',
    people: SEED.peopleId,
    vocation: SEED.vocationId,
    attributes,
    maxHp,
  }
}

/** Reads a DB character row into the shared attribute/survival/conditions/inventory shapes. */
function readCharacter(character: DbCharacter): {
  attributes: Attributes
  survival: SurvivalStats
  activeConditions: ActiveCondition[]
  inventory: PersistedInventoryItem[]
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
      isDying: character.isDying,
      neglectStreak: character.neglectStreak,
    },
    activeConditions: character.activeConditions as unknown as ActiveCondition[],
    inventory: character.inventory as unknown as PersistedInventoryItem[],
  }
}

/**
 * Projects the backend-persisted inventory into the display-facing shape the
 * client HUD reads. `allowedActions` is derived purely from category/state —
 * the backend is still the sole authority when the action route is hit.
 */
function toInventoryRefs(items: PersistedInventoryItem[]): InventoryItemRef[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    equippedSlot: item.equippedSlot,
    description: item.description,
    state: 'ready',
    allowedActions:
      item.category === 'equipment'
        ? [item.equippedSlot ? 'unequip' : 'equip', 'inspect']
        : ['use', 'inspect'],
  }))
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
 * Locale inputs carried by a session request: the deliberate player choice
 * (persisted to the account) and the browser-detected fallback. Both are already
 * normalized BCP-47 tags or undefined (see `createSessionSchema`).
 */
export interface SessionLocaleInput {
  explicitLocale?: Locale
  browserLocale?: Locale
}

/**
 * Returns the user's active session, creating an active session on first
 * play. Idempotent: one character and one active session per user. The
 * world-state lives in the DB — this is the single source of truth.
 *
 * Narration locale is resolved and persisted here (#168), in precedence order
 * explicit choice → account preference → browser → English:
 * - an explicit choice is also written to `User.preferredLocale` so it survives
 *   future sessions, anonymous→account conversion, and resume;
 * - an existing active session keeps its already-persisted locale (a resume must
 *   not silently switch languages mid-run).
 *
 * The `Character` itself is expected to already exist, created via the Forge
 * (`POST /api/character`, #146) before the player ever reaches the session
 * screen. If none exists — a caller bypassed the Forge — this falls back to
 * the seed build (see `SEED` above) rather than failing the request.
 */
export async function getOrCreateSession(
  userId: string,
  localeInput: SessionLocaleInput = {}
): Promise<SessionContext> {
  const { explicitLocale, browserLocale } = localeInput

  // Persist a deliberate choice on the account before anything else, so it wins
  // for this session and every later one.
  if (explicitLocale) {
    await prisma.user.update({
      where: { id: userId },
      data: { preferredLocale: explicitLocale },
    })
  }

  const existing = await prisma.gameSession.findFirst({
    where: { status: 'active', character: { userId } },
    include: { character: true },
    orderBy: { createdAt: 'desc' },
  })
  if (existing) {
    return { session: existing, character: existing.character }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const locale = resolveLocale(explicitLocale, user?.preferredLocale, browserLocale)

  let character = await prisma.character.findFirst({ where: { userId } })
  if (!character) {
    console.warn(`[Session] no character on file for user ${userId}, falling back to seed`)
    const seed = buildSeedCharacter()
    character = await prisma.character.create({
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
        activeConditions: [],
      },
    })
  }

  const session = await prisma.gameSession.create({
    data: { characterId: character.id, locale },
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
  const { survival, activeConditions, inventory } = readCharacter(character)
  const source = last.source === 'ai' ? 'ai' : 'stub'

  const scene: SceneResponse['scene'] = {
    id: last.id,
    sessionId: session.id,
    turnNumber: last.turnNumber,
    narrative: last.narrative,
    choices: choices.success ? choices.data : [],
    ...(session.currentImageUrl ? { imageUrl: session.currentImageUrl } : {}),
    sceneType: last.sceneType as SceneResponse['scene']['sceneType'],
    location: last.location,
    createdAt: last.createdAt.toISOString(),
  }

  return {
    activeConditions,
    iron: character.iron,
    scene,
    survival,
    updatedStats: toStatsRecord(survival),
    updatedInventory: toInventoryRefs(inventory),
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
export async function buildOpeningScene(context: SessionContext): Promise<SceneResponse> {
  const resumed = await resumeLatestScene(context)
  if (resumed) {
    return resumed
  }

  const { session, character } = context
  const { attributes, survival, activeConditions, inventory } = readCharacter(character)

  const gm = await generateScene({
    character: toGmCharacter(character, attributes, survival, activeConditions, inventory),
    // Locale is resolved and persisted at session creation — the DB is the
    // source of truth, never the per-request client value (#168).
    locale: session.locale,
    sessionId: session.id,
  })
  const scene = assembleScene({
    payload: gm.scene,
    sessionId: session.id,
    turnNumber: session.turnNumber,
    imageUrl: session.currentImageUrl,
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
    activeConditions,
    iron: character.iron,
    scene,
    survival,
    updatedStats: toStatsRecord(survival),
    updatedInventory: toInventoryRefs(inventory),
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
}

/**
 * Resolves one turn against the persisted world-state. The backend owns every
 * mechanic: it rolls the d20 (via `resolveChoice`), applies survival + HP,
 * persists the outcome, and — on death (`hp<=0`) — ends the session with
 * `endReason='death'`. The AI only narrates. Returns the enriched `SceneResponse`.
 */
export async function resolveTurn(input: ResolveTurnInput): Promise<SceneResponse> {
  const { session, character, choice, chosenActionText, freeAction } = input
  const { attributes, survival, activeConditions, inventory } = readCharacter(character)

  const resolution = resolveChoice({
    attributes,
    survival,
    choice,
    activeConditions,
    turnNumber: session.turnNumber,
    locale: session.locale,
  })

  const gm = await generateScene({
    character: toGmCharacter(
      character,
      attributes,
      resolution.updatedSurvival,
      resolution.updatedConditions,
      inventory
    ),
    // Persisted session locale is the source of truth (#168).
    locale: session.locale,
    sessionId: session.id,
    chosenActionText,
    freeAction,
  })

  const nextTurn = session.turnNumber + 1

  // The AI may propose ONE [IA-PROPOSÉE] condition caused by what it just
  // narrated (#181). The schema already restricts the id to family "ia", but
  // isValidAiConditionId is re-checked here as the backend's own authority —
  // the AI decides nothing, it only proposes.
  const proposedCondition = gm.scene.apply_condition
  const isValidProposal = proposedCondition && isValidAiConditionId(proposedCondition.id)
  const finalConditions = isValidProposal
    ? applyAiCondition(resolution.updatedConditions, proposedCondition.id, nextTurn)
    : resolution.updatedConditions

  // #182: only "cendre_corrupt" carries a Calamine effect — a validated source,
  // bounded to +20/turn, no passive drain (06-SURVIVAL §4). 100 is a hard,
  // non-reversible transformation into Calciné, checked after HP-death so a
  // simultaneous lethal HP hit still reports as 'death'.
  const calamineDelta =
    isValidProposal && proposedCondition.id === 'cendre_corrupt'
      ? (proposedCondition.calamineDelta ?? 0)
      : 0
  const finalSurvival = applyCalamineDelta(resolution.updatedSurvival, calamineDelta)
  const calcined = !resolution.gameOver && calamineTier(finalSurvival.calamine) === 'dead'
  const gameOver = resolution.gameOver || calcined

  // The AI may signal ONE found item caused by what it just narrated (#183).
  // Structural validity is already Zod-checked; acquireItem re-validates the
  // state-dependent rules (bag capacity, slot) the schema cannot — the AI only
  // proposes, the backend decides.
  const itemProposal = gm.scene.item_gained
  const finalInventory = itemProposal
    ? acquireItem(inventory, itemProposal, randomUUID()).items
    : inventory

  // The AI may propose a rest via restRequested (#184) — it only signals the
  // player's intent, never the recovered values. "inn" is a distinct,
  // session-ending flow (endSessionAtInn) and is silently ignored here; the
  // backend computes and applies the canon short/fire rates itself
  // (game-rules/rest.ts) and clears "mourant" if the rest healed HP back
  // above 0. Rest risk (ambush) stays out of scope — always safe.
  const restProposal = gm.scene.rest_requested
  const restedSurvival =
    !gameOver && restProposal && (restProposal.type === 'short' || restProposal.type === 'fire')
      ? clearDyingOnHeal(
          applyRest(restProposal.type, finalSurvival, finalInventory, attributes.blood, {
            hasProvisions: true,
          }).survival
        )
      : finalSurvival

  const scene = assembleScene({
    payload: gm.scene,
    sessionId: session.id,
    turnNumber: nextTurn,
    consequences: resolution.consequences,
    imageUrl: session.currentImageUrl,
  })

  const endReason: SessionEndReason | null = resolution.gameOver
    ? 'death'
    : calcined
      ? 'calcined'
      : null

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
        hp: restedSurvival.hp,
        thirst: restedSurvival.thirst,
        hunger: restedSurvival.hunger,
        energy: restedSurvival.energy,
        calamine: restedSurvival.calamine,
        isDying: restedSurvival.isDying,
        neglectStreak: restedSurvival.neglectStreak,
        activeConditions: finalConditions as unknown as object,
        inventory: finalInventory as unknown as object,
      },
    }),
    prisma.gameSession.update({
      where: { id: session.id },
      data: {
        turnNumber: nextTurn,
        location: scene.location,
        ...(gameOver ? { status: 'ended', endReason } : {}),
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
          toGmCharacter(character, attributes, restedSurvival, finalConditions, finalInventory),
          scene.location
        )
      } catch (err) {
        console.warn(`[Memory] failed to load turns for session ${session.id}:`, err)
      }
    })()
  }

  if (gm.scene.souvenir_candidate) {
    void (async () => {
      try {
        await validateAndPersistSouvenirCandidate(
          session.id,
          character.userId,
          character.id,
          gm.scene.souvenir_candidate!
        )
      } catch (err) {
        console.warn(`[Souvenir] failed to persist candidate for session ${session.id}:`, err)
      }
    })()
  }

  if (gameOver) {
    void (async () => {
      try {
        await generateChronicle(session.id)
      } catch (err) {
        console.warn(`[Chronicle] failed to generate for session ${session.id}:`, err)
      }
    })()
  }

  return {
    activeConditions: finalConditions,
    ...(endReason ? { endReason } : {}),
    iron: character.iron,
    scene,
    survival: restedSurvival,
    updatedStats: toStatsRecord(restedSurvival),
    updatedInventory: toInventoryRefs(finalInventory),
    notifications: [],
    diceRoll: resolution.diceRoll,
    source: gm.source,
  }
}

/**
 * Applies a player-initiated inventory action (use/equip/unequip, #183)
 * against the persisted world-state. Never advances the turn — no AI call,
 * no dice, no SceneLog entry. Scoped to the caller's own active session, the
 * same guard as `resolveTurn`. Returns null when the session doesn't belong
 * to the caller or isn't active.
 */
export async function performInventoryAction(
  request: InventoryActionRequest,
  userId: string
): Promise<InventoryActionResponse | null> {
  const session = await prisma.gameSession.findFirst({
    where: { id: request.sessionId, status: 'active', character: { userId } },
    include: { character: true },
  })
  if (!session) {
    return null
  }

  const { character } = session
  const { survival, activeConditions, inventory } = readCharacter(character)

  const result =
    request.action === 'use'
      ? useItem(inventory, request.itemId, survival, activeConditions)
      : request.action === 'equip'
        ? { ...equipItem(inventory, request.itemId), survival, conditions: activeConditions }
        : { ...unequipItem(inventory, request.itemId), survival, conditions: activeConditions }

  if (!result.applied) {
    return {
      activeConditions,
      iron: character.iron,
      survival,
      updatedStats: toStatsRecord(survival),
      updatedInventory: toInventoryRefs(inventory),
      applied: false,
    }
  }

  // A used item may heal HP back above 0 (#201) — clear the "mourant" flag
  // when that happens, same rule as a turn resolving with healing.
  const finalSurvival = clearDyingOnHeal(result.survival)

  await prisma.character.update({
    where: { id: character.id },
    data: {
      hp: finalSurvival.hp,
      thirst: finalSurvival.thirst,
      hunger: finalSurvival.hunger,
      energy: finalSurvival.energy,
      calamine: finalSurvival.calamine,
      isDying: finalSurvival.isDying,
      neglectStreak: finalSurvival.neglectStreak,
      activeConditions: result.conditions as unknown as object,
      inventory: result.items as unknown as object,
    },
  })

  return {
    activeConditions: result.conditions,
    iron: character.iron,
    survival: finalSurvival,
    updatedStats: toStatsRecord(finalSurvival),
    updatedInventory: toInventoryRefs(result.items),
    applied: true,
  }
}

/**
 * Ends an active session with the given reason and fires the Chronicle
 * generation, mirroring the `death` path in `resolveTurn`.
 * Returns null if the session doesn't exist, isn't the caller's, or has
 * already ended — the route decides how to surface that.
 */
async function endSession(
  sessionId: string,
  userId: string,
  endReason: Exclude<SessionEndReason, 'death'>
): Promise<GameSession | null> {
  const session = await prisma.gameSession.findFirst({
    where: { id: sessionId, status: 'active', character: { userId } },
  })
  if (!session) {
    return null
  }

  const updated = await prisma.gameSession.update({
    where: { id: session.id },
    data: { status: 'ended', endReason },
  })

  void (async () => {
    try {
      await generateChronicle(session.id)
    } catch (err) {
      console.warn(`[Chronicle] failed to generate for session ${session.id}:`, err)
    }
  })()

  return updated
}

/**
 * Ends a session via the player's voluntary choice at the inn, facing
 * L'Aveugle ("Ton aventure se termine ici").
 *
 * Recorded as `abandon`, not as a return: this flow predates run contracts and
 * ends the campaign on the player's initiative, without an objective to fulfil.
 * The contract-aware endings (`extracted` / `returned_empty`) are produced by
 * the return trip, wired in #228.
 * @see docs/public/raw/23-RUN-STRUCTURE.md §5
 */
export async function endSessionAtInn(
  sessionId: string,
  userId: string
): Promise<GameSession | null> {
  return endSession(sessionId, userId, 'abandon')
}

/**
 * Ends a session via an explicit "Abandonner ce perso" click. The 30-day
 * inactivity path is a separate job, not wired here (mirrors the Souvenir
 * purge job's approach: a plain exported function, no cron infra yet).
 */
export async function abandonSession(
  sessionId: string,
  userId: string
): Promise<GameSession | null> {
  return endSession(sessionId, userId, 'abandon')
}

/** Assembles the shared `Character` shape the Game Master prompt expects. */
function toGmCharacter(
  character: DbCharacter,
  attributes: Attributes,
  survival: SurvivalStats,
  activeConditions: ActiveCondition[] = [],
  inventory: PersistedInventoryItem[] = []
) {
  return {
    id: character.id,
    userId: character.userId,
    name: character.name,
    people: character.people,
    vocation: character.vocation,
    stats: { attributes, survival, conditions: activeConditions, inventory },
    createdAt: character.createdAt.toISOString(),
  }
}
