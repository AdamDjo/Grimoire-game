import type { MemoryChunkModel } from '../generated/prisma/models'
import type { Character, Locale } from '@grimoire/shared'

/** Human-readable language name for the locale, injected into the prompt. */
const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  fr: 'French',
}

/** Narrow projection of a `SceneLog` used for the N1 recent-turns window. */
export interface RecentTurnSummary {
  turnNumber: number
  turnSummary: string | null
}

/**
 * Builds the N2 memory section: the caller passes at most the 5 most recent
 * chunks (bounded to keep the prompt cheap on long runs — see
 * feedback_challenge_canon_scalability), plus a deduplicated list of every
 * pinned fact across those chunks so critical events are never forgotten.
 */
function buildMemorySection(memoryChunks: MemoryChunkModel[]): string[] {
  if (memoryChunks.length === 0) return []

  const summaries = memoryChunks.map(
    (chunk) => `- (turns ${chunk.turnRangeStart}-${chunk.turnRangeEnd}) ${chunk.summary}`
  )

  const pinnedFacts = Array.from(
    new Set(
      memoryChunks.flatMap((chunk) =>
        Array.isArray(chunk.keyFactsPinned) ? (chunk.keyFactsPinned as string[]) : []
      )
    )
  )

  const section = ['Story so far (past scenes, most recent first):', ...summaries]

  if (pinnedFacts.length > 0) {
    section.push('', 'Critical facts to always remember:', ...pinnedFacts.map((f) => `- ${f}`))
  }

  return ['', ...section]
}

/**
 * Builds the N1 recent-turns section: the caller passes at most the 5 most
 * recent scene logs (see `RecentTurnSummary`), already filtered of entries
 * with no `turnSummary` (older, pre-migration rows). Formats them in
 * chronological order (oldest first) so the AI reads them like a timeline
 * leading up to the current turn — distinct from the N2 long-term summaries.
 */
function buildRecentTurnsSection(recentTurns: RecentTurnSummary[]): string[] {
  const withSummary = recentTurns.filter(
    (turn): turn is RecentTurnSummary & { turnSummary: string } => Boolean(turn.turnSummary)
  )
  if (withSummary.length === 0) return []

  const chronological = withSummary.slice().sort((a, b) => a.turnNumber - b.turnNumber)
  const lines = chronological.map((turn) => `- (turn ${turn.turnNumber}) ${turn.turnSummary}`)

  return ['', 'Recent turns (most recent scenes, in order):', ...lines]
}

/**
 * Builds the Game Master system prompt.
 * The AI writes narration and choice labels only; the backend owns all rules,
 * dice, stats, and canon consistency. Canon brand terms are NOT re-translated —
 * the app supplies a curated dictionary for those.
 */
export function buildSystemPrompt(
  character: Character,
  locale: Locale,
  memoryChunks: MemoryChunkModel[] = [],
  recentTurns: RecentTurnSummary[] = []
): string {
  const languageName = LOCALE_NAME[locale]

  return [
    'You are the Game Master of Velkhar, a harsh desert survival RPG (world: "Of Ash and Salt").',
    `Write all narration and choices in ${languageName}. English is the default.`,
    'Keep canon proper nouns unchanged (Velkhar, Makhzen, Calamine, the Shadow Hand). Do not translate them.',
    '',
    'Tone: grounded, sensory, dangerous. Second person. 2 to 4 short paragraphs of narration.',
    '',
    'Rules you must respect:',
    '- You never decide dice outcomes, damage, or stat changes. The backend resolves all mechanics.',
    '- You only describe the situation and offer choices. Each choice is a short actionable label.',
    '- Offer 2 to 4 choices. Mark each with a plausible riskLevel (safe/low/medium/high/deadly).',
    '',
    `Player character: ${character.name} — people "${character.people}", vocation "${character.vocation}".`,
    ...buildMemorySection(memoryChunks),
    ...buildRecentTurnsSection(recentTurns),
    '',
    'Respond with a single JSON object and nothing else, matching exactly:',
    '{',
    '  "narrative": string,',
    '  "sceneType": "exploration" | "combat" | "dialog" | "event" | "shop" | "rest",',
    '  "location": string,',
    '  "choices": [{ "text": string, "type": "action"|"dialog"|"combat"|"flee"|"use_item"|"skill", "riskLevel"?: "safe"|"low"|"medium"|"high"|"deadly" }],',
    '  "turnSummary": string',
    '}',
    '',
    'turnSummary: a short factual sentence (max 200 characters) condensing what just',
    'happened THIS turn — not styled narration, a compact fact usable for continuity',
    '(e.g. "The player fled the oasis after discovering the merchant NPC was lying").',
  ].join('\n')
}
