import { hasOpenRouterKey } from '../config/env'
import { prisma } from '../lib/prisma'

import { callOpenRouter } from './openrouter.provider'
import { buildStubScene } from './scene-stub'
import { type AiScenePayload, validateAiScene } from './scene-validator'
import { buildSystemPrompt, type RecentTurnSummary } from './system-prompt'

import type { MemoryChunkModel, SouvenirModel } from '../generated/prisma/models'
import type { Character, Locale } from '@grimoire/shared'

export interface GameMasterInput {
  character: Character
  locale: Locale
  /** Session this scene belongs to — used to load N2 memory context. */
  sessionId: string
  /** Label of the choice the player just took, if any. */
  chosenActionText?: string
  /** Free-form action typed by the player, if any. */
  freeAction?: string
}

/**
 * Loads the N2 memory context for the prompt: the 8 most recent chunks (for
 * the "story so far" summaries) plus every chunk's pinned facts, deduplicated
 * downstream by `buildSystemPrompt`. 8 chunks (64 turns) covers nearly the
 * full history of a vertical-slice run (45-70 min, ~40-60 turns) — see #120,
 * which replaced semantic recall (#114, deferred) with this wider window.
 */
async function loadMemoryChunks(sessionId: string): Promise<MemoryChunkModel[]> {
  return prisma.memoryChunk.findMany({
    where: { sessionId },
    orderBy: { turnRangeEnd: 'desc' },
    take: 8,
  })
}

/**
 * Loads the N1 short-term window: the 5 most recent scene logs' `turnSummary`.
 * Unlike N2 this must be awaited synchronously — it covers the gap between
 * compressions (or before the first one) and feeds the *current* turn's prompt.
 */
async function loadRecentTurns(sessionId: string): Promise<RecentTurnSummary[]> {
  return prisma.sceneLog.findMany({
    where: { sessionId },
    orderBy: { turnNumber: 'desc' },
    take: 5,
    select: { turnNumber: true, turnSummary: true },
  })
}

/**
 * Loads the N3 inter-run memory context: the 3 most recent named Souvenirs
 * for this user (across all their sessions/characters, per #115 — Souvenirs
 * are cross-run and permanent, never scoped to the current session).
 */
async function loadRecentSouvenirs(userId: string): Promise<SouvenirModel[]> {
  return prisma.souvenir.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })
}

export interface GameMasterResult {
  scene: AiScenePayload
  /** How the scene was produced — useful for debugging and the front badge. */
  source: 'ai' | 'stub'
}

/** Turns the player's action into a validated narrative payload. */
function buildUserPrompt(input: GameMasterInput): string {
  if (input.freeAction) {
    return `The player attempts: "${input.freeAction}". Narrate what happens and offer new choices.`
  }
  if (input.chosenActionText) {
    return `The player chose: "${input.chosenActionText}". Narrate the outcome and offer new choices.`
  }
  return 'Begin the session. Establish the opening scene and offer the first choices.'
}

/**
 * Produces a validated scene payload.
 * Falls back to the deterministic stub whenever the AI is unavailable,
 * errors, or returns malformed JSON — the front never receives raw AI output.
 */
export async function generateScene(input: GameMasterInput): Promise<GameMasterResult> {
  if (!hasOpenRouterKey()) {
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  const [memoryChunks, recentTurns, souvenirs] = await Promise.all([
    loadMemoryChunks(input.sessionId),
    loadRecentTurns(input.sessionId),
    loadRecentSouvenirs(input.character.userId),
  ])

  const result = await callOpenRouter([
    {
      role: 'system',
      content: buildSystemPrompt(
        input.character,
        input.locale,
        memoryChunks,
        recentTurns,
        souvenirs
      ),
    },
    { role: 'user', content: buildUserPrompt(input) },
  ])

  if (!result.success || !result.content) {
    console.warn('[GM] AI call failed, falling back to stub:', result.error)
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(result.content)
  } catch {
    console.warn('[GM] AI returned non-JSON, falling back to stub')
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  const validated = validateAiScene(parsed)
  if (!validated.success || !validated.data) {
    console.warn('[GM] AI JSON failed validation, falling back to stub:', validated.error)
    return { scene: buildStubScene(input.character, input.locale), source: 'stub' }
  }

  return { scene: validated.data, source: 'ai' }
}
