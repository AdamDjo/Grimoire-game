import { type CompressionOutput, validateCompressionOutput } from '../ai/compression-validator'
import { callOpenRouter } from '../ai/openrouter.provider'
import { sceneTypeSchema } from '../ai/scene-validator'
import { COMPRESSION_FALLBACK_MODEL, env } from '../config/env'
import { prisma } from '../lib/prisma'

import { classifyBiome, classifyLieuType, resolveSceneImage } from './scene-image.service'

import type { SceneLog } from '../generated/prisma/client'
import type { Character } from '@grimoire/shared'

const COMPRESSION_TIMEOUT_MS = 8000

/**
 * Builds the canon compression prompt (docs/public/raw/16-MEMORY.md §5).
 *
 * Internal memory is stored in a fixed English pivot, independent of the
 * player's narration locale (#168): summaries and facts must stay stable and
 * language-agnostic so that a mid-run language change can never translate or
 * corrupt the canon. Only the player-facing narration is localized; this
 * compression output never reaches the player verbatim.
 */
function buildCompressionPrompt(character: Character, location: string, turns: SceneLog[]): string {
  const rawTurns = turns
    .slice()
    .sort((a, b) => a.turnNumber - b.turnNumber)
    .map((turn) => `[Turn ${turn.turnNumber}] ${turn.narrative}`)
    .join('\n')

  return [
    'You compress 8 game turns into a structured summary.',
    'Always write the summary and facts in English — this is an internal memory',
    'record, never shown to the player, and must stay language-independent.',
    '',
    '[CONTEXT]',
    `${character.name}, ${character.vocation}, ${character.people}, in Velkhar.`,
    `Current location: ${location}.`,
    '',
    '[RAW TURNS]',
    rawTurns,
    '',
    '[INSTRUCTION]',
    'Output STRICTLY as JSON:',
    '{',
    '  "summary": "150 tokens max, third-person narrative",',
    '  "key_facts": ["fact 1", "fact 2", "fact 3"],',
    '  "key_facts_pinned": [/* critical facts per rules */],',
    '  "mood": "calm | tense | festive | sacred | dangerous",',
    '  "npcs_evolution": [{"name": "...", "status": "...", "last_seen": "..."}]',
    '}',
    '',
    'Automatic pinning rules:',
    '- NPC death → key_facts_pinned',
    '- Artifact gained/lost → key_facts_pinned',
    '- Quest activated → key_facts_pinned',
    '- Major moral choice → key_facts_pinned',
  ].join('\n')
}

/** Calls OpenRouter with the given model and returns validated compression output, or null. */
async function tryCompress(prompt: string, model: string): Promise<CompressionOutput | null> {
  const result = await callOpenRouter([{ role: 'user', content: prompt }], {
    model,
    timeoutMs: COMPRESSION_TIMEOUT_MS,
  })

  if (!result.success || !result.content) {
    return null
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(result.content)
  } catch {
    return null
  }

  const validated = validateCompressionOutput(parsed)
  return validated.success && validated.data ? validated.data : null
}

/**
 * Compresses a batch of turns into a `MemoryChunk` (N2 memory). Fire-and-forget:
 * called without `await` from `resolveTurn`. Never throws — on double failure
 * (primary + fallback model, invalid JSON, or failed Zod validation) it logs a
 * warning and returns without persisting anything; the turns simply stay
 * uncompressed rather than crashing the game loop.
 */
export async function compressScene(
  sessionId: string,
  turns: SceneLog[],
  character: Character,
  location: string
): Promise<void> {
  if (turns.length === 0) {
    return
  }

  const prompt = buildCompressionPrompt(character, location, turns)

  const output =
    (await tryCompress(prompt, env.openRouter.compressionModel)) ??
    (await tryCompress(prompt, COMPRESSION_FALLBACK_MODEL))

  if (!output) {
    console.warn(`[Memory] compression failed for session ${sessionId}, turns stay uncompressed`)
    return
  }

  const sortedTurns = turns.slice().sort((a, b) => a.turnNumber - b.turnNumber)
  const turnRangeStart = sortedTurns[0].turnNumber
  const turnRangeEnd = sortedTurns[sortedTurns.length - 1].turnNumber

  await prisma.memoryChunk.create({
    data: {
      sessionId,
      summary: output.summary,
      keyFacts: output.key_facts,
      keyFactsPinned: output.key_facts_pinned,
      mood: output.mood,
      npcsEvolution: output.npcs_evolution,
      turnRangeStart,
      turnRangeEnd,
    },
  })

  await resolveAndPersistSceneImage(
    sessionId,
    location,
    sortedTurns[sortedTurns.length - 1].sceneType
  )
}

/**
 * Resolves the shared scene-image cache entry for this chunk (#207) and
 * persists it on the session so the next scene response can surface it.
 * Never throws — a resolution failure just leaves `currentImageUrl`
 * untouched, and the frontend falls back to its static theme image.
 */
async function resolveAndPersistSceneImage(
  sessionId: string,
  location: string,
  sceneType: string
): Promise<void> {
  try {
    const parsedSceneType = sceneTypeSchema.safeParse(sceneType)
    if (!parsedSceneType.success) {
      return
    }

    const biome = classifyBiome(location)
    const lieuType = classifyLieuType(location)
    const url = await resolveSceneImage(parsedSceneType.data, biome, lieuType)

    if (url) {
      await prisma.gameSession.update({
        where: { id: sessionId },
        data: { currentImageUrl: url },
      })
    }
  } catch (err) {
    console.warn(`[SceneImage] resolution failed for session ${sessionId}:`, err)
  }
}
