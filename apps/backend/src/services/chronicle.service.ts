import { getPeople, getVocation, localeDisplayName, resolveLocale } from '@grimoire/shared'

import { type ChronicleOutput, validateChronicleOutput } from '../ai/chronicle-validator'
import { callOpenRouter } from '../ai/openrouter.provider'
import { env } from '../config/env'
import { prisma } from '../lib/prisma'

import type { ChronicleEndReason } from '@grimoire/shared'

const CHRONICLE_TIMEOUT_MS = 8000
/** Below this many turns there isn't enough narrative material for a Chronicle (17-RUN-CHRONICLE.md §7). */
const MIN_TURNS_FOR_CHRONICLE = 5

export interface GenerateChronicleOptions {
  /** AI model override for the Chronicle text. Defaults to the free-tier model. Premium-tier branching is a future ticket. */
  model?: string
}

export interface GenerateChronicleResult {
  /** True when a Chronicle was generated and persisted. */
  generated: boolean
  /** Set when `generated` is false and the run was too short (< 5 turns) to have a Chronicle at all. */
  tooShort?: boolean
}

interface ChronicleContext {
  sessionId: string
  userId: string
  characterId: string
  characterName: string
  peopleLabel: string
  vocationLabel: string
  languageName: string
  endReason: ChronicleEndReason
  turnCount: number
  memorySummaries: string[]
  pinnedFacts: string[]
  souvenirs: { title: string; body: string }[]
}

/** Builds the exact canon Chronicle prompt (docs/canon/17-RUN-CHRONICLE.md §1-3). */
function buildChroniclePrompt(context: ChronicleContext): string {
  const {
    characterName,
    peopleLabel,
    vocationLabel,
    languageName,
    endReason,
    memorySummaries,
    pinnedFacts,
    souvenirs,
  } = context

  const endReasonLabel: Record<ChronicleEndReason, string> = {
    death: 'Mort en cours de run',
    extracted:
      'Retour à la surface avec l’objectif du contrat : le contrat est honoré, la prime est due',
    returned_empty:
      'Retour à la surface vivant mais les mains vides : le contrat n’est pas rempli, rien n’est payé',
    abandon: 'Abandon du personnage (inactivité ou clic explicite)',
    calcined:
      'Calamine à son comble : le personnage est devenu ce qu’il chassait, transformé en Calciné',
  }

  return [
    'Tu écris la Chronique de fin de run — un récit littéraire de 800 à 1200 mots qui transforme la partie vécue en histoire.',
    `Écris le texte final (title, body_markdown, tagline) en ${languageName}. Le français est la langue par défaut.`,
    '',
    '[IDENTITÉ]',
    `Nom : ${characterName}`,
    `Peuple : ${peopleLabel}`,
    `Vocation : ${vocationLabel}`,
    `Cause de fin : ${endReasonLabel[endReason]}`,
    '',
    '[RÉSUMÉS DU RUN (mémoire N2)]',
    memorySummaries.length > 0 ? memorySummaries.join('\n') : '(aucun résumé disponible)',
    '',
    '[FAITS ÉPINGLÉS]',
    pinnedFacts.length > 0 ? pinnedFacts.join('\n') : '(aucun fait épinglé)',
    '',
    '[SOUVENIRS NOMMÉS DU RUN]',
    souvenirs.length > 0
      ? souvenirs.map((s) => `- ${s.title} : ${s.body}`).join('\n')
      : '(aucun Souvenir nommé)',
    '',
    '[STRUCTURE]',
    '3 actes implicites, jamais nommés dans le texte : Ouverture (~200-300 mots, le perso, son origine, sa quête initiale) ; Complications (~400-600 mots, rencontres marquantes, Souvenirs intégrés au récit, choix difficiles) ; Climax & fin (~200-300 mots, le moment de bascule, la cause de fin, l’écho qui reste).',
    '',
    '[VOIX]',
    'Narrateur uniquement, sec, sensoriel, présent, à la 3e personne. Jamais "je", jamais L’Aveugle qui parle.',
    '',
    '[À MENTIONNER OBLIGATOIREMENT]',
    '- Le nom du personnage, plusieurs fois',
    '- La vocation, au moins une fois',
    '- Le peuple, au moins un ancrage culturel',
    '- 2-3 Souvenirs nommés intégrés au récit (jamais listés)',
    '- 1-2 PNJ marquants par leur nom',
    '- La cause de fin, décrite jamais énoncée bêtement',
    '',
    '[INTERDITS]',
    '- Résumé "rapport de partie" ("Le joueur a tué X")',
    '- Stats numériques',
    '- Emojis',
    '- Méta-commentaire ("En 3 actes, le joueur...")',
    '- Adresse au lecteur ("Imaginez...")',
    '',
    '[INSTRUCTION]',
    'Génère STRICTEMENT en JSON :',
    '{',
    '  "title": "string, max 80 caractères, style chapitre de roman, jamais générique",',
    '  "body_markdown": "string, 800-1200 mots, markdown léger (pas de titres ##, italique autorisé)",',
    '  "mood": "tragic | epic | melancholic | serene | absurd",',
    '  "key_moments": [{"label": "5-8 mots", "scene_ref": 0}],',
    '  "tagline": "string, 15-30 caractères, pour partage social"',
    '}',
  ].join('\n')
}

async function tryGenerate(prompt: string, model: string): Promise<ChronicleOutput | null> {
  const result = await callOpenRouter([{ role: 'user', content: prompt }], {
    model,
    timeoutMs: CHRONICLE_TIMEOUT_MS,
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

  const validated = validateChronicleOutput(parsed)
  return validated.success && validated.data ? validated.data : null
}

/**
 * Generates and persists the end-of-run Chronicle (17-RUN-CHRONICLE.md).
 * Below `MIN_TURNS_FOR_CHRONICLE` turns, no AI call is made — the run had too
 * little narrative material (canon §7). On AI failure or invalid output, no
 * Chronicle is persisted and the caller must not purge the session's `SceneLog`.
 * The AI model is an optional parameter (not hardcoded) so a future premium-tier
 * ticket can pass a stronger model without changing this function's shape.
 */
export async function generateChronicle(
  sessionId: string,
  options?: GenerateChronicleOptions
): Promise<GenerateChronicleResult> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { character: true },
  })
  if (!session || !session.endReason) {
    return { generated: false }
  }

  if (session.turnNumber < MIN_TURNS_FOR_CHRONICLE) {
    return { generated: false, tooShort: true }
  }

  const { character } = session
  const locale = resolveLocale(session.locale)
  const nameKey = locale === 'fr' ? 'fr' : 'en'
  const people = getPeople(character.people)
  const vocation = getVocation(character.vocation)

  const [memoryChunks, souvenirs] = await Promise.all([
    prisma.memoryChunk.findMany({ where: { sessionId }, orderBy: { turnRangeEnd: 'asc' } }),
    prisma.souvenir.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } }),
  ])

  const context: ChronicleContext = {
    sessionId,
    userId: character.userId,
    characterId: character.id,
    characterName: character.name,
    peopleLabel: people?.name[nameKey] ?? character.people,
    vocationLabel: vocation?.name[nameKey] ?? character.vocation,
    languageName: localeDisplayName(locale),
    endReason: session.endReason as ChronicleEndReason,
    turnCount: session.turnNumber,
    memorySummaries: memoryChunks.map((chunk) => chunk.summary),
    pinnedFacts: [
      ...new Set(
        memoryChunks.flatMap((chunk) =>
          Array.isArray(chunk.keyFactsPinned) ? (chunk.keyFactsPinned as string[]) : []
        )
      ),
    ],
    souvenirs: souvenirs.map((s) => ({ title: s.title, body: s.body })),
  }

  const prompt = buildChroniclePrompt(context)
  const model = options?.model ?? env.openRouter.model

  const output = await tryGenerate(prompt, model)
  if (!output) {
    console.warn(`[Chronicle] generation failed for session ${sessionId}, no Chronicle persisted`)
    return { generated: false }
  }

  await prisma.chronicle.create({
    data: {
      userId: context.userId,
      characterId: context.characterId,
      sessionId,
      endReason: context.endReason,
      title: output.title,
      bodyMarkdown: output.body_markdown,
      mood: output.mood,
      keyMoments: output.key_moments,
      tagline: output.tagline,
    },
  })

  await prisma.sceneLog.deleteMany({ where: { sessionId } })

  return { generated: true }
}
