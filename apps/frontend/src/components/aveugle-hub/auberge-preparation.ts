import type { AveugleMemoryId, AveugleOmenId, AveugleTopicId } from './_data/aveugle-hub-fixtures'

export const AUBERGE_PREPARATION_STORAGE_KEY = 'grimoire:auberge-preparation:v1'

const OMEN_IDS: AveugleOmenId[] = ['follow-smoke', 'avoid-bells']
const TOPIC_IDS: AveugleTopicId[] = ['salt-guild', 'calcines', 'artifact']
const MEMORY_IDS: AveugleMemoryId[] = ['vane-night', 'salt-oath', 'archon-dream']

export interface AubergePreparationState {
  version: 1
  selectedOmenId: AveugleOmenId | null
  seenTopicIds: AveugleTopicId[]
  seenMemoryIds: AveugleMemoryId[]
}

export const EMPTY_AUBERGE_PREPARATION: AubergePreparationState = {
  version: 1,
  selectedOmenId: null,
  seenTopicIds: [],
  seenMemoryIds: [],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function filterKnownIds<T extends string>(value: unknown, knownIds: T[]): T[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is T => typeof item === 'string' && knownIds.includes(item as T))
}

export function parseAubergePreparation(raw: string | null): AubergePreparationState {
  if (!raw) return EMPTY_AUBERGE_PREPARATION

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== 1) return EMPTY_AUBERGE_PREPARATION

    const selectedOmenId =
      typeof parsed.selectedOmenId === 'string' &&
      OMEN_IDS.includes(parsed.selectedOmenId as AveugleOmenId)
        ? (parsed.selectedOmenId as AveugleOmenId)
        : null

    return {
      version: 1,
      selectedOmenId,
      seenTopicIds: filterKnownIds(parsed.seenTopicIds, TOPIC_IDS),
      seenMemoryIds: filterKnownIds(parsed.seenMemoryIds, MEMORY_IDS),
    }
  } catch {
    return EMPTY_AUBERGE_PREPARATION
  }
}

export function addSeenId<T extends string>(ids: T[], id: T): T[] {
  return ids.includes(id) ? ids : [...ids, id]
}

export function withOmenQuery(path: string, omenId: AveugleOmenId): string {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}omen=${encodeURIComponent(omenId)}`
}
