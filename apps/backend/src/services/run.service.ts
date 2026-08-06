import {
  type CarriedSupplies,
  computeReturnEstimate,
  createContract,
  descend as descendState,
  detectReturnWarnings,
  engageReturn as engageReturnState,
  ascend as ascendState,
  canDescend as canDescendState,
  estimateRemainingMinutes,
  hasReachedSurface,
  isValidContractDepth,
  type ReturnWarning,
} from '../game-rules/run'

import type { Character as DbCharacter, GameSession } from '../generated/prisma/client'
import type {
  ContractDepth,
  GameMode,
  ReturnEstimate,
  RunContract,
  RunState,
  SessionEndReason,
  PersistedInventoryItem,
} from '@grimoire/shared'

/**
 * Bridges the pure run rules (`game-rules/run.ts`, `game-rules/dungeon.ts`) to
 * the persisted session. No rule lives here: this module only reads a
 * `GameSession` row into a `RunState`, and writes a `RunState` back into the
 * columns. The arbitration stays in `game-rules/`, which knows nothing about
 * Prisma.
 * @see docs/public/raw/23-RUN-STRUCTURE.md
 */

/** Item ids that count as drinkable water when estimating the trip home. */
const WATER_ITEM_PATTERN = /\b(water|gourde|outre|eau|waterskin|flask)\b/i

/** Item ids that count as food rations when estimating the trip home. */
const FOOD_ITEM_PATTERN = /\b(ration|food|vivres|nourriture|dried|viande|pain)\b/i

/**
 * Counts the rations the character actually carries, from the persisted
 * inventory. Matching is by name because items are AI-named at acquisition
 * (#183) and carry no canonical supply category — the backend still decides,
 * it just has to recognise what it is looking at.
 */
export function countCarriedSupplies(inventory: PersistedInventoryItem[]): CarriedSupplies {
  let water = 0
  let food = 0

  for (const item of inventory) {
    if (item.category !== 'bag') continue
    if (WATER_ITEM_PATTERN.test(item.name)) water += item.quantity
    else if (FOOD_ITEM_PATTERN.test(item.name)) food += item.quantity
  }

  return { water, food }
}

/**
 * True when the session carries an accepted contract. Sessions created before
 * #228 — and any session still at the inn — have none, and must keep working:
 * the run structure degrades to "no structure", never to a crash.
 */
export function hasContract(session: GameSession): boolean {
  return (
    session.contractId !== null &&
    session.contractDestination !== null &&
    session.contractTargetDepth !== null &&
    session.contractRewardIron !== null &&
    session.contractObjective !== null
  )
}

/**
 * Reads the persisted contract back into its shared shape. Returns null when
 * the session has no contract, or when the stored depth is not a canon depth —
 * a corrupted row must not be able to fabricate an 11-floor run.
 */
export function readContract(session: GameSession): RunContract | null {
  if (!hasContract(session)) return null

  const depth = session.contractTargetDepth
  if (depth === null || !isValidContractDepth(depth)) return null

  return createContract({
    id: session.contractId!,
    destination: session.contractDestination!,
    targetDepth: depth,
    rewardIron: session.contractRewardIron!,
    objective: session.contractObjective!,
  })
}

/**
 * Projects a session row into the `RunState` the pure rules operate on.
 * Returns null for a session with no contract — the caller then skips the run
 * loop entirely rather than inventing a default contract.
 */
export function readRunState(session: GameSession): RunState | null {
  const contract = readContract(session)
  if (!contract) return null

  return {
    contract,
    mode: session.gameMode as GameMode,
    currentDepth: session.currentDepth,
    maxDepthReached: session.maxDepthReached,
    currentRoomId: session.currentRoomId,
    returnEngaged: session.returnEngaged,
    objectiveSecured: session.objectiveSecured,
  }
}

/** The session columns a `RunState` writes back to. */
export interface RunStatePersistence {
  gameMode: string
  currentDepth: number
  maxDepthReached: number
  currentRoomId: string | null
  returnEngaged: boolean
  objectiveSecured: boolean
}

/** Flattens a `RunState` into the session columns it owns. */
export function toRunStatePersistence(state: RunState): RunStatePersistence {
  return {
    gameMode: state.mode,
    currentDepth: state.currentDepth,
    maxDepthReached: state.maxDepthReached,
    currentRoomId: state.currentRoomId,
    returnEngaged: state.returnEngaged,
    objectiveSecured: state.objectiveSecured,
  }
}

/** The contract columns, for the moment a run is started from the inn. */
export interface ContractPersistence {
  contractId: string
  contractDestination: string
  contractTargetDepth: ContractDepth
  contractRewardIron: number
  contractObjective: string
}

/** Flattens a contract into the session columns it owns. */
export function toContractPersistence(contract: RunContract): ContractPersistence {
  return {
    contractId: contract.id,
    contractDestination: contract.destination,
    contractTargetDepth: contract.targetDepth,
    contractRewardIron: contract.rewardIron,
    contractObjective: contract.objective,
  }
}

/**
 * The run snapshot projected to the client alongside every scene. The client
 * infers nothing: depth, mode, the estimate and whether descending is still
 * allowed are all decided here (continuity of #186).
 */
export interface RunProjection {
  contract: RunContract
  mode: GameMode
  currentDepth: number
  maxDepthReached: number
  returnEngaged: boolean
  objectiveSecured: boolean
  /** Honest cost of getting home from where the player stands. */
  returnEstimate: ReturnEstimate
  /** Minutes left for the whole run, descent included. */
  estimatedRemainingMinutes: number
  /** Whether "descendre encore" is still a legal move. */
  canDescend: boolean
  /** True once the player has climbed back out and the run can be settled. */
  atSurface: boolean
}

/** Builds the client-facing run snapshot from a state and the carried supplies. */
export function projectRun(state: RunState, supplies: CarriedSupplies): RunProjection {
  return {
    contract: state.contract,
    mode: state.mode,
    currentDepth: state.currentDepth,
    maxDepthReached: state.maxDepthReached,
    returnEngaged: state.returnEngaged,
    objectiveSecured: state.objectiveSecured,
    returnEstimate: computeReturnEstimate(state, supplies),
    estimatedRemainingMinutes: estimateRemainingMinutes(state),
    canDescend: canDescendState(state),
    atSurface: hasReachedSurface(state),
  }
}

/**
 * Advances the run by one turn's worth of movement.
 *
 * Progression is deliberately coarse at this stage: one turn moves the party
 * one step of the current leg. Room-by-room resolution arrives with #215, which
 * fills the rooms with actual combat — until then a floor is crossed per turn,
 * which keeps the canon duration table honest.
 * @see 23-RUN-STRUCTURE.md §2, §3
 */
export function advanceRun(state: RunState): RunState {
  if (state.returnEngaged) return ascendState(state)
  return descendState(state)
}

/** Commits to the turn back. Irreversible — see §3. */
export function engageReturn(state: RunState): RunState {
  return engageReturnState(state)
}

/**
 * Resolves the end of a run that reached the surface: `extracted` when the
 * contract objective was secured, `returned_empty` when the player made it out
 * alive but empty-handed. Returns null while the run is still underway.
 *
 * These two endings do not tell the same story and do not pay the same — which
 * is exactly why #226 split them out of the old `inn` reason.
 * @see 23-RUN-STRUCTURE.md §5
 */
export function resolveReturnEnding(state: RunState): SessionEndReason | null {
  if (!hasReachedSurface(state)) return null
  return state.objectiveSecured ? 'extracted' : 'returned_empty'
}

/**
 * Detects the supplies that crossed under the return requirement this turn.
 *
 * Re-exported through this service so callers never reach into `game-rules`
 * directly for it, and so the `previousState` argument — the one that catches a
 * crossing caused by *descending* rather than by spending — is always supplied.
 * @see 23-RUN-STRUCTURE.md §4.2
 */
export function detectThresholdCrossings(
  previousState: RunState,
  nextState: RunState,
  before: CarriedSupplies,
  after: CarriedSupplies
): ReturnWarning[] {
  return detectReturnWarnings(nextState, before, after, previousState)
}

/** Convenience read of the supplies a character carries right now. */
export function readSupplies(character: DbCharacter): CarriedSupplies {
  return countCarriedSupplies(character.inventory as unknown as PersistedInventoryItem[])
}
