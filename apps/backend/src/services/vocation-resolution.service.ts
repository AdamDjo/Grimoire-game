import { localeDisplayName, resolveLocale, VOCATIONS } from '@grimoire/shared'

import { callOpenRouter } from '../ai/openrouter.provider'
import {
  validateVocationResolutionOutput,
  type VocationResolutionOutput,
} from '../ai/vocation-resolution-validator'
import { env } from '../config/env'
import { prisma } from '../lib/prisma'

import type { Locale, VocationResolutionResponse } from '@grimoire/shared'

const VOCATION_RESOLUTION_TIMEOUT_MS = 8000

/**
 * Resolves the narration locale for the character-creation flow (#152). No
 * `GameSession`/`Character` exists yet at this stage, unlike Aveugle's
 * `resolvePlayerLocale` — only the account preference is available, falling
 * back to English (#168 default).
 */
async function resolveCreationLocale(userId: string): Promise<Locale> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferredLocale: true },
  })
  return resolveLocale(user?.preferredLocale)
}

/** Builds the free-concept host vocation resolution prompt (07-CHARACTER-CREATION.md §2 étape 4). */
function buildVocationResolutionPrompt(params: {
  freeConcept: string
  languageName: string
}): string {
  const { freeConcept, languageName } = params

  return [
    "Tu es L'Aveugle, aubergiste-prophète du Doigt-Cassé, à Velkhar. Un voyageur t'a décrit qui il est avec ses propres mots, pas un archétype officiel.",
    // Language instruction comes early (#168/#181 fix, see aveugle.service.ts): a
    // model that only sees it after a long French voice block may ignore it.
    `Write your reply in ${languageName}. Keep this instruction even though the rest of this prompt is in French. English is the default.`,
    '',
    '[TON RÔLE]',
    "Identifier, parmi les 4 vocations canoniques de Velkhar, celle qui correspond le mieux au concept du voyageur. Tu ne peux JAMAIS inventer une 5e vocation : choisis obligatoirement l'id le plus proche parmi les 4, puis personnalise son nom, son trait narratif et ses compétences pour coller au concept.",
    '',
    '[LES 4 VOCATIONS CANONIQUES]',
    ...VOCATIONS.map(
      (v) =>
        `- id="${v.id}" — ${v.name.fr} : ${v.description.fr} Compétences de base : ${v.startingSkills
          .map((s) => s.fr)
          .join(', ')}.`
    ),
    '',
    '[LE CONCEPT LIBRE DU VOYAGEUR]',
    freeConcept,
    '',
    '[INSTRUCTION]',
    'Si le concept est compréhensible, réponds STRICTEMENT en JSON :',
    '{ "understood": true, "vocationId": "<un des 4 ids ci-dessus>", "customVocationName": "...", "narrativeTrait": "...", "shiftedSkills": [{"original": "...", "shifted": "..."}, {"original": "...", "shifted": "..."}], "announcement": "..." }',
    '- customVocationName : nom de vocation personnalisé (court, évocateur, en accord avec le concept).',
    '- narrativeTrait : un trait narratif court propre à ce voyageur.',
    '- shiftedSkills : exactement les 2 compétences de base de la vocation choisie, renommées pour coller au concept (le champ original reprend le libellé canon, shifted la version personnalisée).',
    "- announcement : 2-4 phrases dans la voix de L'Aveugle annonçant la vocation résolue au voyageur.",
    '',
    'Si le concept est incompréhensible ou trop vague pour être rattaché à une vocation, réponds STRICTEMENT :',
    '{ "understood": false }',
    `Reminder: write all narrative text (customVocationName, narrativeTrait, shiftedSkills, announcement) in ${languageName}.`,
  ].join('\n')
}

async function tryResolveVocation(prompt: string): Promise<VocationResolutionOutput | null> {
  const result = await callOpenRouter([{ role: 'user', content: prompt }], {
    model: env.openRouter.model,
    timeoutMs: VOCATION_RESOLUTION_TIMEOUT_MS,
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

  const validated = validateVocationResolutionOutput(parsed)
  return validated.success && validated.data ? validated.data : null
}

/**
 * Resolves a player's free-form character concept to one of the 4 canon host
 * vocations (#152, 07-CHARACTER-CREATION.md §2 étape 4). Stateless: nothing is
 * persisted here — the frontend re-submits the resolved fields to
 * `POST /api/character` once the player confirms. Any AI failure (timeout,
 * malformed output, hallucinated vocation) surfaces as a `fallback` response
 * so the caller can offer the 4 presets explicitly, never a raw error.
 */
export async function resolveVocation(
  userId: string,
  freeConcept: string
): Promise<VocationResolutionResponse> {
  const locale = await resolveCreationLocale(userId)

  const prompt = buildVocationResolutionPrompt({
    freeConcept,
    languageName: localeDisplayName(locale),
  })

  const output = await tryResolveVocation(prompt)
  if (!output) {
    console.warn(
      `[VocationResolution] resolution failed for user ${userId}, falling back to presets`
    )
    return { status: 'fallback', reason: 'ai_unavailable' }
  }

  if (!output.understood) {
    return { status: 'fallback', reason: 'unintelligible_concept' }
  }

  return {
    status: 'resolved',
    vocationId: output.vocationId,
    customVocationName: output.customVocationName,
    narrativeTrait: output.narrativeTrait,
    shiftedSkills: output.shiftedSkills,
    announcement: output.announcement,
  }
}
