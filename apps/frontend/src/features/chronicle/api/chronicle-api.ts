import type { ChronicleView, PublicChroniclePayload } from '../model/chronicle.types'
import type { ApiResponse, Chronicle } from '@grimoire/shared'

const CHRONICLE_MOODS = new Set(['tragic', 'epic', 'melancholic', 'serene', 'absurd'])
const END_REASONS = new Set(['death', 'extracted', 'returned_empty', 'abandon', 'calcined'])

function textOrFallback(value: string | undefined, fallback: string): string {
  const normalized = value?.trim()
  return normalized && normalized.length > 0 ? normalized : fallback
}

export class ChronicleApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'ChronicleApiError'
  }
}

function normalizeChronicle(chronicle: Partial<ChronicleView>): ChronicleView {
  if (!chronicle.bodyMarkdown?.trim()) {
    throw new ChronicleApiError('Chronicle content incomplete', 422)
  }

  return {
    bodyMarkdown: chronicle.bodyMarkdown,
    createdAt: chronicle.createdAt ?? new Date(0).toISOString(),
    endReason: END_REASONS.has(chronicle.endReason ?? '') ? chronicle.endReason! : 'death',
    illustrationUrl: chronicle.illustrationUrl,
    keyMoments: Array.isArray(chronicle.keyMoments) ? chronicle.keyMoments : [],
    mood: CHRONICLE_MOODS.has(chronicle.mood ?? '') ? chronicle.mood! : 'melancholic',
    slug: chronicle.slug,
    tagline: textOrFallback(chronicle.tagline, 'Une trace demeure dans le sel.'),
    title: textOrFallback(chronicle.title, 'Une Chronique de Velkhar'),
  }
}

function toChronicleView(chronicle: Chronicle): ChronicleView {
  return normalizeChronicle(chronicle)
}

async function readApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null
  if (!response.ok || !body?.success || !body.data) {
    throw new ChronicleApiError(body?.error ?? 'Chronicle unavailable', response.status)
  }
  return body.data
}

/** Existing authenticated #116 contract, used only during the end-of-run flow. */
export async function getSessionChronicle(sessionId: string): Promise<ChronicleView> {
  const response = await fetch(`/api/chronicles/session/${encodeURIComponent(sessionId)}`, {
    cache: 'no-store',
  })
  return toChronicleView(await readApiResponse<Chronicle>(response))
}

/**
 * Isolated future public contract for #132. The backend can implement this route
 * without changing the reader or exposing Chronicle ownership fields.
 */
export async function getPublicChronicle(slug: string): Promise<ChronicleView> {
  if (process.env.NODE_ENV === 'development' && slug === 'apercu') {
    const { CHRONICLE_PREVIEW } = await import('../model/chronicle-preview')
    return CHRONICLE_PREVIEW
  }

  const response = await fetch(`/api/chronicles/public/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  })
  const chronicle = await readApiResponse<PublicChroniclePayload>(response)
  if (!chronicle.published) throw new ChronicleApiError('Chronicle unpublished', 404)
  return normalizeChronicle({
    bodyMarkdown: chronicle.bodyMarkdown,
    createdAt: chronicle.createdAt,
    endReason: chronicle.endReason,
    illustrationUrl: chronicle.illustrationUrl,
    keyMoments: chronicle.keyMoments,
    mood: chronicle.mood,
    slug: chronicle.slug,
    tagline: chronicle.tagline,
    title: chronicle.title,
  })
}
