import { CONDITIONS, getConditionDefinition, localeDisplayName } from '@grimoire/shared'

import type { MemoryChunkModel, SouvenirModel } from '../generated/prisma/models'
import type { Character, Locale } from '@grimoire/shared'

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
 * Builds the N3 memory section: the caller passes at most the 3 most recent
 * named Souvenirs (cross-run, per #115 — narrower than the canon's 5-max
 * since these are a passive mention, not the Aveugle's relevance-ranked pick).
 * Souvenirs are immutable once created; this prompt never asks the AI to
 * alter or contradict them, only to be aware of them.
 */
function buildSouvenirsSection(souvenirs: SouvenirModel[]): string[] {
  if (souvenirs.length === 0) return []

  const lines = souvenirs.map((souvenir) => `- "${souvenir.title}" — ${souvenir.body}`)

  return [
    '',
    "The player's named Souvenirs from past runs (permanent, never contradict them):",
    ...lines,
  ]
}

/**
 * Builds the [IA-PROPOSÉE] conditions section: the character's currently
 * active conditions (so the AI never re-proposes a duplicate) and the full
 * whitelist of condition ids the AI is allowed to propose via
 * `apply_condition`. `[BACKEND]` conditions (fever, wound) are applied
 * automatically server-side and are deliberately excluded from the whitelist
 * shown here — the AI cannot propose them.
 * @see docs/public/raw/06-SURVIVAL.md §2 "Les deux familles de conditions"
 */
function buildConditionsSection(character: Character, locale: Locale): string[] {
  const nameKey = locale === 'fr' ? 'fr' : 'en'

  const active = character.stats.conditions
  const activeLines = active.map((condition) => {
    const name = getConditionDefinition(condition.id)?.name[nameKey] ?? condition.id
    return `- ${name} (id: "${condition.id}")`
  })

  const proposable = CONDITIONS.filter((condition) => condition.family === 'ia')
  const whitelistLines = proposable.map(
    (condition) => `- "${condition.id}": ${condition.name[nameKey]}`
  )

  return [
    '',
    active.length > 0
      ? `Currently active conditions on the player: ${activeLines.join('; ')}.`
      : 'The player currently has no active conditions.',
    '',
    'You may optionally propose ONE new condition via apply_condition when the',
    'narrative and biome clearly justify it (e.g. wading through a poisonous',
    'marsh, a freezing blizzard, a stunning blow). Never propose a condition',
    'already active on the player. Only propose ids from this exact whitelist —',
    'any other id is rejected:',
    ...whitelistLines,
    '',
    'Special case — "cendre_corrupt" (Calamine): only propose this id, with a',
    'calamineDelta, when the scene you just wrote depicts ONE of these canon',
    'sources (any other cause is ignored by the backend, gauge does not move):',
    '- Exposure to archontic light: delta 5 to 15',
    '- Contact with a corrupted creature or place: delta 5 to 10',
    '- The gaze or presence of an archontic Watcher: delta 10 to 20',
    '- Excessive ritual or magic use outside an artifact: delta 5 to 15',
    'The backend caps the applied delta at +20/turn regardless of what you send.',
    'Never invent a delta for any other condition id, and never let the gauge',
    'rise without one of these sources actually happening in the narrative —',
    'Calamine never rises on its own.',
  ]
}

/**
 * Builds the item_gained section: the character's currently carried items (so
 * the AI never re-grants a duplicate) and the rules for proposing a new item.
 * The backend re-validates category/slot/capacity in `game-rules/inventory.ts`
 * before ever persisting a proposal — this is guidance only.
 * @see docs/public/raw/11-INVENTORY-ECONOMY.md §1
 */
function buildInventorySection(character: Character): string[] {
  const items = character.stats.inventory ?? []
  const lines = items.map((item) => `- ${item.name} (category: "${item.category}")`)

  return [
    '',
    items.length > 0
      ? `The player currently carries: ${lines.join('; ')}.`
      : 'The player currently carries no items.',
    '',
    'You may optionally signal ONE found item via item_gained when the',
    'narrative clearly justifies it (looted from a container, taken off a',
    'defeated foe, handed over by an NPC). Never propose an item the player',
    'already carries. category must be one of: "equipment" (worn gear —',
    'requires a slot among main-hand, off-hand, armor, cloak, head, accessory,',
    'belt, feet), "bag" (consumable or carried goods, backend caps the bag at',
    '12 items), "artifact" (a single dedicated slot), "key" (quest-critical,',
    'unlimited). Never propose category "heirloom" — it is never AI-granted.',
  ]
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
  recentTurns: RecentTurnSummary[] = [],
  souvenirs: SouvenirModel[] = []
): string {
  const languageName = localeDisplayName(locale)

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
    ...buildSouvenirsSection(souvenirs),
    ...buildConditionsSection(character, locale),
    ...buildInventorySection(character),
    '',
    'Respond with a single JSON object and nothing else, matching exactly:',
    '{',
    '  "narrative": string,',
    '  "sceneType": "exploration" | "combat" | "dialog" | "event" | "shop" | "rest",',
    '  "location": string,',
    '  "choices": [{ "text": string, "type": "action"|"dialog"|"combat"|"flee"|"use_item"|"skill", "riskLevel"?: "safe"|"low"|"medium"|"high"|"deadly" }],',
    '  "turnSummary": string,',
    '  "souvenir_candidate"?: { "title_suggestion": string, "body": string, "type": "npc-death"|"moral-choice"|"secret-discovery"|"boss-victory"|"strong-promise" }',
    '  "apply_condition"?: { "id": string, "reason": string, "calamineDelta"?: number }',
    '  "item_gained"?: { "name": string, "category": "equipment"|"bag"|"artifact"|"key", "slot"?: string, "effect"?: { "healAmount"?: number, "calamineReduction"?: number, "removesCondition"?: string, "damage"?: string }, "description"?: string }',
    '}',
    '',
    'turnSummary: a short factual sentence (max 200 characters) condensing what just',
    'happened THIS turn — not styled narration, a compact fact usable for continuity',
    '(e.g. "The player fled the oasis after discovering the merchant NPC was lying").',
    '',
    'souvenir_candidate: OPTIONAL, omit on most turns. Only include it when something',
    'truly Souvenir-worthy just happened THIS turn: a named NPC died, a major moral',
    'choice was made, a secret was discovered, a boss was defeated, or a strong promise',
    'was sworn. title_suggestion: 4-15 words, evocative. body: 30-70 tokens, third person,',
    'describing the moment concretely (not restating narrative style).',
    '',
    'apply_condition: OPTIONAL, omit on most turns. Only include it when the',
    'narrative event you just wrote clearly and directly causes one of the',
    'whitelisted conditions above. reason: one short sentence explaining why',
    '(e.g. "crossed the poisonous marsh without protection"). calamineDelta is',
    'only meaningful when id is "cendre_corrupt" — see the Calamine sources',
    'above; omit it for every other condition id.',
    '',
    'item_gained: OPTIONAL, omit on most turns. Only include it when the',
    'narrative you just wrote clearly has the player finding or receiving an',
    'item THIS turn. Never invent an item that was not part of the narrative.',
  ].join('\n')
}
