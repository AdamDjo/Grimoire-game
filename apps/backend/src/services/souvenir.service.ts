import { prisma } from '../lib/prisma'

import type { AiSouvenirCandidate } from '../ai/scene-validator'

const MAX_SOUVENIRS_PER_SESSION = 3
const TITLE_MIN_WORDS = 4
const TITLE_MAX_WORDS = 15
// Approximated via word count (no tokenizer dependency) — 1.3 words/token per
// the canon budget, so 30-70 tokens ≈ 23-90 words. Kept simple per spec.
const BODY_MIN_WORDS = 23
const BODY_MAX_WORDS = 90
const DEDUP_LEVENSHTEIN_THRESHOLD = 5
/** Purge threshold for free-tier accounts (6 months of inactivity, canon 16-MEMORY.md §8). */
const PURGE_INACTIVITY_MS = 1000 * 60 * 60 * 24 * 30 * 6
/** Souvenirs retained per free-tier user after a purge (canon 14-META-WORLD.md §8). */
const PURGE_RETENTION_COUNT = 20

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Classic edit-distance (insert/delete/substitute) between two strings,
 * case-insensitive — used for cross-run Souvenir title dedup. No dependency:
 * small enough to keep local (canon threshold is < 5, titles are short).
 */
export function levenshteinDistance(a: string, b: string): number {
  const s = a.toLowerCase()
  const t = b.toLowerCase()
  const rows = s.length + 1
  const cols = t.length + 1
  const matrix: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0))

  for (let i = 0; i < rows; i++) matrix[i][0] = i
  for (let j = 0; j < cols; j++) matrix[0][j] = j

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }

  return matrix[rows - 1][cols - 1]
}

/** Lowercased keyword tokens (3+ chars) used for the pinned-fact overlap heuristic. */
function keywordsOf(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-zà-ÿ0-9']+/i)
      .filter((word) => word.length >= 3)
  )
}

/**
 * Heuristic match between the candidate's content and the session's pinned
 * facts (`MemoryChunk.keyFactsPinned`): true if any pinned fact shares at
 * least one keyword with the candidate's title or body. Deliberately simple
 * substring/keyword overlap, not semantic matching (see #115 spec — pgvector
 * explicitly rejected for Souvenirs).
 */
function matchesPinnedFacts(candidate: AiSouvenirCandidate, pinnedFacts: string[]): boolean {
  if (pinnedFacts.length === 0) return false

  const candidateWords = new Set([
    ...keywordsOf(candidate.title_suggestion),
    ...keywordsOf(candidate.body),
  ])

  return pinnedFacts.some((fact) => {
    const factWords = keywordsOf(fact)
    for (const word of factWords) {
      if (candidateWords.has(word)) return true
    }
    return false
  })
}

/**
 * Validates a per-turn Souvenir candidate against every canon rule (16-MEMORY
 * §6, 14-META-WORLD §2) and persists it as an immutable `Souvenir` row on
 * success. Fire-and-forget-safe: never throws, silently discards on any
 * validation failure, and logs a warning only on unexpected errors (DB down,
 * etc). Must never block or crash `resolveTurn`.
 */
export async function validateAndPersistSouvenirCandidate(
  sessionId: string,
  userId: string,
  characterId: string,
  candidate: AiSouvenirCandidate
): Promise<void> {
  try {
    const titleWords = countWords(candidate.title_suggestion)
    if (titleWords < TITLE_MIN_WORDS || titleWords > TITLE_MAX_WORDS) {
      return
    }

    const bodyWords = countWords(candidate.body)
    if (bodyWords < BODY_MIN_WORDS || bodyWords > BODY_MAX_WORDS) {
      return
    }

    const sessionSouvenirCount = await prisma.souvenir.count({ where: { sessionId } })
    if (sessionSouvenirCount >= MAX_SOUVENIRS_PER_SESSION) {
      return
    }

    const memoryChunks = await prisma.memoryChunk.findMany({
      where: { sessionId },
      select: { keyFactsPinned: true },
    })
    const pinnedFacts = memoryChunks.flatMap((chunk) =>
      Array.isArray(chunk.keyFactsPinned) ? (chunk.keyFactsPinned as string[]) : []
    )
    if (!matchesPinnedFacts(candidate, pinnedFacts)) {
      return
    }

    const existingSouvenirs = await prisma.souvenir.findMany({
      where: { userId },
      select: { title: true },
    })
    const isDuplicate = existingSouvenirs.some(
      (existing) =>
        levenshteinDistance(existing.title, candidate.title_suggestion) <
        DEDUP_LEVENSHTEIN_THRESHOLD
    )
    if (isDuplicate) {
      return
    }

    await prisma.souvenir.create({
      data: {
        userId,
        characterId,
        sessionId,
        title: candidate.title_suggestion,
        body: candidate.body,
        type: candidate.type,
      },
    })
  } catch (err) {
    console.warn(`[Souvenir] validation/persist failed for session ${sessionId}:`, err)
  }
}

/**
 * Best-effort purge for free-tier users: caps each user's retained Souvenirs
 * to 20 after 6 months of inactivity (canon 14-META-WORLD.md §8, 16-MEMORY.md
 * §8). Anonymous tier is cookie-based (no DB rows to purge) and Premium is
 * never purged — both are out of scope for this function's callers to filter.
 * Not yet wired to a scheduler: this codebase has no cron/job infrastructure
 * today, so this stays a plain exported function until one exists.
 */
export async function purgeInactiveSouvenirs(freeTierUserIds: string[]): Promise<void> {
  const cutoff = new Date(Date.now() - PURGE_INACTIVITY_MS)

  for (const userId of freeTierUserIds) {
    try {
      const souvenirs = await prisma.souvenir.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      if (souvenirs.length <= PURGE_RETENTION_COUNT) {
        continue
      }

      const mostRecentActivity = souvenirs[0].createdAt
      if (mostRecentActivity > cutoff) {
        continue
      }

      const toDelete = souvenirs.slice(PURGE_RETENTION_COUNT).map((s) => s.id)
      await prisma.souvenir.deleteMany({ where: { id: { in: toDelete } } })
    } catch (err) {
      console.warn(`[Souvenir] purge failed for user ${userId}:`, err)
    }
  }
}
