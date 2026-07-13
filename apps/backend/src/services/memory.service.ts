import { type CompressionOutput, validateCompressionOutput } from '../ai/compression-validator'
import { callOpenRouter } from '../ai/openrouter.provider'
import { COMPRESSION_FALLBACK_MODEL, env } from '../config/env'
import { prisma } from '../lib/prisma'

import type { SceneLog } from '../generated/prisma/client'
import type { Character } from '@grimoire/shared'

const COMPRESSION_TIMEOUT_MS = 8000

/** Builds the exact canon compression prompt (docs/private/raw/16-MEMORY.md §5). */
function buildCompressionPrompt(character: Character, location: string, turns: SceneLog[]): string {
  const rawTurns = turns
    .slice()
    .sort((a, b) => a.turnNumber - b.turnNumber)
    .map((turn) => `[Turn ${turn.turnNumber}] ${turn.narrative}`)
    .join('\n')

  return [
    'Tu compresses 8 tours de jeu en un résumé structuré.',
    '',
    '[CONTEXTE]',
    `${character.name}, ${character.vocation}, ${character.people}, à Velkhar.`,
    `Lieu actuel : ${location}.`,
    '',
    '[TOURS BRUTS]',
    rawTurns,
    '',
    '[INSTRUCTION]',
    'Génère STRICTEMENT en JSON :',
    '{',
    '  "summary": "150 tokens max, narratif 3e personne",',
    '  "key_facts": ["fait 1", "fait 2", "fait 3"],',
    '  "key_facts_pinned": [/* faits critiques selon règles */],',
    '  "mood": "calm | tense | festive | sacred | dangerous",',
    '  "npcs_evolution": [{"name": "...", "status": "...", "last_seen": "..."}]',
    '}',
    '',
    'Règles de pinning automatique :',
    '- PNJ mort → key_facts_pinned',
    '- Artefact obtenu/perdu → key_facts_pinned',
    '- Quête activée → key_facts_pinned',
    '- Choix moral majeur → key_facts_pinned',
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
}
