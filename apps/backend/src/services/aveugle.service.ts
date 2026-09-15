import { getPeople, getVocation, localeDisplayName, resolveLocale } from '@grimoire/shared'

import {
  type AveugleLoreOutput,
  type AveugleTalkOutput,
  validateAveugleLoreOutput,
  validateAveugleTalkOutput,
} from '../ai/aveugle-validator'
import { callOpenRouter } from '../ai/openrouter.provider'
import { env } from '../config/env'
import { prisma } from '../lib/prisma'

import type { AveugleExchangeType, AveugleHubState, Locale, SouvenirType } from '@grimoire/shared'

const AVEUGLE_TIMEOUT_MS = 8000

/**
 * Canon phrases in L'Aveugle's voice (15-GAME-MASTER.md §1.1) — warm, ironic,
 * tutoie, short desert proverbs. Injected as few-shot examples in every
 * prompt so the model never drifts into "mystical old sage" or lyricism.
 */
const AVEUGLE_CANON_PHRASES = [
  "Ah, tu reviens. Le sable t'a recraché, à ce que je vois. Assieds-toi, étranger. Le thé est tiède mais l'histoire sera chaude.",
  'Le vent a parlé de toi cette nuit. Pas en bien. Pas en mal. Juste en long.',
  'Trois pièces pour le lit. Une pour le thé. Et ton nom, gratuit — je le garderai.',
  "Tu portes l'artefact d'un mort. Il pèse plus lourd que tu crois.",
  "Un autre a tenté avant toi. Il n'est pas revenu. Toi non plus, peut-être.",
]

/**
 * Static fallback replies in L'Aveugle's canon voice, returned when the AI
 * call fails on `/api/aveugle/talk`. The player must never see a raw error —
 * this bank guarantees a reply in voice regardless of AI availability.
 */
const AVEUGLE_TALK_FALLBACK_REPLIES = [
  'Le vent me souffle mal ce soir, étranger. Redemande-moi ça, plus tard, au coin du feu.',
  'Ma langue est aussi sèche que le sable, là, maintenant. Reviens quand le thé aura infusé.',
  'Les mots se cachent, comme les os sous la dune. Laisse-moi le temps de les retrouver.',
  'Pas maintenant. Même la lampe à huile a besoin de repos avant de brûler à nouveau.',
]

/**
 * English fallback replies, same canon voice as {@link AVEUGLE_TALK_FALLBACK_REPLIES}.
 * Served for every non-French locale so the player never sees a French line on a
 * failed AI call. Other locales pivot to English rather than shipping a per-locale
 * bank (English is always the safe default — #168).
 */
const AVEUGLE_TALK_FALLBACK_REPLIES_EN = [
  'The wind carries poorly tonight, traveler. Ask me again later, by the fire.',
  'My tongue is as dry as the sand right now. Come back when the tea has steeped.',
  'The words are hiding, like bones under the dune. Give me time to find them again.',
  'Not now. Even the oil lamp needs rest before it burns anew.',
]

/**
 * Picks a static fallback reply in the player's language. French keeps its native
 * bank; every other locale falls back to English (the global default per #168).
 */
function pickFallbackReply(locale: Locale): string {
  const bank =
    locale.toLowerCase().split('-')[0] === 'fr'
      ? AVEUGLE_TALK_FALLBACK_REPLIES
      : AVEUGLE_TALK_FALLBACK_REPLIES_EN
  return pickRandom(bank)
}

/** Canon price table for Souvenir-for-lore exchanges (11-INVENTORY-ECONOMY.md §3). */
const EXCHANGE_PRICES: Record<AveugleExchangeType, number> = {
  'lore-fragment': 1,
  'artifact-identification': 1,
  'quest-hint': 2,
  'region-map': 3,
  'moral-advice': 1,
}

const EXCHANGE_LABELS: Record<AveugleExchangeType, string> = {
  'lore-fragment': 'Un fragment de lore générique, cohérent avec ton histoire',
  'artifact-identification':
    "L'identification d'un artefact (nom, histoire, faiblesse, effet d'éveil)",
  'quest-hint': 'Un indice concret sur une quête en cours',
  'region-map': "Une carte mentale d'une région (lieux d'intérêt)",
  'moral-advice': 'Un conseil moral sur un dilemme (rare, casse sa neutralité habituelle)',
}

export class SouvenirNotSpendableError extends Error {}
export class SouvenirNotFoundError extends Error {}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Resolves the narration locale for an Aveugle interaction (#168). The player's
 * active game session is the source of truth for the language (`GameSession.locale`,
 * persisted at session creation); we fall back to the account preference, then to
 * English. The Aveugle hub has no session of its own — it reuses the run's locale so
 * the innkeeper always speaks the same language as the Game Master.
 */
async function resolvePlayerLocale(userId: string): Promise<Locale> {
  const [session, user] = await Promise.all([
    prisma.gameSession.findFirst({
      where: { character: { userId }, status: 'active' },
      orderBy: { createdAt: 'desc' },
      select: { locale: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { preferredLocale: true } }),
  ])

  return resolveLocale(session?.locale, user?.preferredLocale)
}

/**
 * Pure-Prisma read of the Aveugle hub screen state (topics seen, gold, named
 * Souvenirs, spendable Souvenir count). No AI call involved.
 */
export async function getAveugleHubState(userId: string): Promise<AveugleHubState> {
  const [character, souvenirs] = await Promise.all([
    prisma.character.findFirst({ where: { userId } }),
    prisma.souvenir.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  ])

  const namedSouvenirRows = souvenirs.filter((s) => !s.anonymous)
  const spendableSouvenirCount = souvenirs.filter((s) => s.anonymous && !s.sharedWithAveugle).length

  return {
    gold: character?.gold ?? 0,
    spendableSouvenirCount,
    namedSouvenirs: namedSouvenirRows.map((s) => ({
      id: s.id,
      userId: s.userId,
      characterId: s.characterId,
      sessionId: s.sessionId,
      title: s.title,
      body: s.body,
      type: s.type as SouvenirType,
      anonymous: s.anonymous,
      sharedWithAveugle: s.sharedWithAveugle,
      aveugleLoreResult: s.aveugleLoreResult ?? undefined,
      createdAt: s.createdAt.toISOString(),
    })),
    seenTopicIds: character?.aveugleSeenTopics ?? [],
  }
}

/**
 * Marks a hub topic as seen for this player (idempotent — no-op if already
 * seen). The topic catalogue itself is a static frontend concept; only the
 * "seen" state is persisted here. Pure Prisma, no AI call.
 */
export async function markTopicSeen(userId: string, topicId: string): Promise<void> {
  const character = await prisma.character.findFirst({ where: { userId } })
  if (!character) {
    return
  }
  if (character.aveugleSeenTopics.includes(topicId)) {
    return
  }

  await prisma.character.update({
    where: { id: character.id },
    data: { aveugleSeenTopics: { push: topicId } },
  })
}

/**
 * Builds the free-talk prompt in L'Aveugle's canon voice (15-GAME-MASTER.md §1.1).
 *
 * This voice belongs to L'Aveugle alone. The Comptoir (#249) is a *different*
 * Inn destination with a different NPC, the keeper — he sells, he does not
 * prophesy. Should the Comptoir ever gain dialogue, it must get its own prompt
 * builder rather than reuse this one: the two must never blur into one
 * innkeeper who both takes your gold and reads your fate.
 * @see docs/canon/23-RUN-STRUCTURE.md §1
 */
function buildAveugleTalkPrompt(params: {
  characterName: string
  peopleLabel: string
  vocationLabel: string
  namedSouvenirs: { title: string; body: string }[]
  playerMessage: string
  languageName: string
}): string {
  const { characterName, peopleLabel, vocationLabel, namedSouvenirs, playerMessage, languageName } =
    params

  return [
    "Tu es L'Aveugle, aubergiste-prophète du Doigt-Cassé, à Velkhar.",
    // Language instruction comes early (#168/#181 fix): a model that only sees
    // it after a long French voice block may ignore it and answer in French
    // regardless of the player's locale.
    `Write your reply in ${languageName}. Keep this instruction even though the rest of this prompt is in French. English is the default.`,
    '',
    '[IDENTITÉ]',
    'Aubergiste-prophète, pas magicien. Tu connais le sable, le vent, le sel, la cendre, le thé tiède, les os blanchis, la lampe à huile, la porte.',
    '',
    '[VOIX]',
    'Chaud, ironique, sage paysan. Tu tutoies toujours. Tu parles en proverbes désertiques courts.',
    '',
    '[PHRASES CANONIQUES (exemples de ton style, ne pas recopier telles quelles)]',
    ...AVEUGLE_CANON_PHRASES.map((phrase) => `- « ${phrase} »`),
    '',
    '[INTERDITS]',
    'Jamais lyrique. Jamais "vieux sage mystérieux". Jamais d\'emoji. Jamais de méta-commentaire.',
    '',
    '[LE VOYAGEUR EN FACE DE TOI]',
    `Nom : ${characterName}`,
    `Peuple : ${peopleLabel}`,
    `Vocation : ${vocationLabel}`,
    namedSouvenirs.length > 0
      ? `Souvenirs marquants que tu te rappelles de lui : ${namedSouvenirs
          .map((s) => s.title)
          .join('; ')}`
      : 'Tu ne te souviens encore de rien de marquant sur lui.',
    '',
    '[CE QUE LE VOYAGEUR TE DIT]',
    playerMessage,
    '',
    '[INSTRUCTION]',
    'Réponds STRICTEMENT en JSON : { "reply": "..." }. Une réplique courte (2-4 phrases), en voix de L\'Aveugle uniquement.',
    `Reminder: write the reply in ${languageName}.`,
  ].join('\n')
}

async function tryGenerateTalk(prompt: string): Promise<AveugleTalkOutput | null> {
  const result = await callOpenRouter([{ role: 'user', content: prompt }], {
    model: env.openRouter.model,
    timeoutMs: AVEUGLE_TIMEOUT_MS,
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

  const validated = validateAveugleTalkOutput(parsed)
  return validated.success && validated.data ? validated.data : null
}

/**
 * Generates L'Aveugle's reply to a free-form player message. Stateless per
 * canon (#147 spec): the context is rebuilt from DB on every call, no message
 * history table. Never returns a raw AI error to the player — on failure,
 * falls back to a static canon-voice reply picked at random.
 */
export async function generateAveugleTalkResponse(
  userId: string,
  playerMessage: string
): Promise<{ reply: string; isFallback: boolean }> {
  const [character, locale] = await Promise.all([
    prisma.character.findFirst({ where: { userId } }),
    resolvePlayerLocale(userId),
  ])

  if (!character) {
    return { reply: pickFallbackReply(locale), isFallback: true }
  }

  const [people, vocation, namedSouvenirRows] = await Promise.all([
    Promise.resolve(getPeople(character.people)),
    Promise.resolve(getVocation(character.vocation)),
    prisma.souvenir.findMany({
      where: { userId, anonymous: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  const prompt = buildAveugleTalkPrompt({
    characterName: character.name,
    peopleLabel: people?.name.fr ?? character.people,
    vocationLabel: vocation?.name.fr ?? character.vocation,
    namedSouvenirs: namedSouvenirRows.map((s) => ({ title: s.title, body: s.body })),
    playerMessage,
    languageName: localeDisplayName(locale),
  })

  const output = await tryGenerateTalk(prompt)
  if (!output) {
    console.warn(`[Aveugle] talk generation failed for user ${userId}, using static fallback`)
    return { reply: pickFallbackReply(locale), isFallback: true }
  }

  return { reply: output.reply, isFallback: false }
}

/** Builds the Souvenir-for-lore exchange prompt (11-INVENTORY-ECONOMY.md §3). */
function buildAveugleLorePrompt(params: {
  characterName: string
  peopleLabel: string
  vocationLabel: string
  exchangeType: AveugleExchangeType
  spentSouvenirTitle: string
  languageName: string
}): string {
  const {
    characterName,
    peopleLabel,
    vocationLabel,
    exchangeType,
    spentSouvenirTitle,
    languageName,
  } = params

  return [
    "Tu es L'Aveugle, aubergiste-prophète du Doigt-Cassé, à Velkhar. Un voyageur t'échange un Souvenir contre du savoir.",
    // Language instruction comes early (#168/#181 fix): see buildAveugleTalkPrompt above.
    `Write your reply in ${languageName}. Keep this instruction even though the rest of this prompt is in French. English is the default.`,
    '',
    '[VOIX]',
    'Chaud, ironique, sage paysan. Tu tutoies toujours. Proverbes désertiques courts. Jamais lyrique, jamais "vieux sage mystérieux".',
    '',
    '[LE VOYAGEUR]',
    `Nom : ${characterName}`,
    `Peuple : ${peopleLabel}`,
    `Vocation : ${vocationLabel}`,
    `Souvenir échangé : ${spentSouvenirTitle}`,
    '',
    '[CE QUI EST DEMANDÉ]',
    EXCHANGE_LABELS[exchangeType],
    '',
    '[INSTRUCTION]',
    'Réponds STRICTEMENT en JSON : { "loreResult": "..." }. 2-6 phrases, cohérentes avec le canon de Velkhar, jamais de stat ni de décision mécanique.',
    `Reminder: write the loreResult in ${languageName}.`,
  ].join('\n')
}

async function tryGenerateLore(prompt: string): Promise<AveugleLoreOutput | null> {
  const result = await callOpenRouter([{ role: 'user', content: prompt }], {
    model: env.openRouter.model,
    timeoutMs: AVEUGLE_TIMEOUT_MS,
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

  const validated = validateAveugleLoreOutput(parsed)
  return validated.success && validated.data ? validated.data : null
}

export interface SpendSouvenirResult {
  loreResult: string
  souvenirId: string
}

/**
 * Spends an anonymous (spendable) Souvenir for AI-generated lore. Refuses
 * outright if the Souvenir doesn't belong to `userId`, doesn't exist, is
 * already spent, or — critically — is a named Souvenir (`anonymous: false`):
 * named Souvenirs are narrative medals, never spendable (11-INVENTORY-ECONOMY
 * §3). The Souvenir is only marked spent and `aveugleLoreResult` only written
 * if the AI call succeeds — a failed AI call never costs the player their
 * Souvenir.
 */
export async function spendSouvenirForLore(
  userId: string,
  souvenirId: string,
  exchangeType: AveugleExchangeType
): Promise<SpendSouvenirResult> {
  const souvenir = await prisma.souvenir.findFirst({ where: { id: souvenirId, userId } })
  if (!souvenir) {
    throw new SouvenirNotFoundError('Souvenir not found')
  }
  if (!souvenir.anonymous || souvenir.sharedWithAveugle) {
    throw new SouvenirNotSpendableError(
      'This Souvenir is not spendable — only anonymous, unspent Souvenirs can be exchanged for lore'
    )
  }

  const [character, locale] = await Promise.all([
    prisma.character.findFirst({ where: { userId: souvenir.userId } }),
    resolvePlayerLocale(userId),
  ])

  const prompt = buildAveugleLorePrompt({
    characterName: character?.name ?? 'le voyageur',
    peopleLabel: character ? (getPeople(character.people)?.name.fr ?? character.people) : 'inconnu',
    vocationLabel: character
      ? (getVocation(character.vocation)?.name.fr ?? character.vocation)
      : 'inconnue',
    exchangeType,
    spentSouvenirTitle: souvenir.title,
    languageName: localeDisplayName(locale),
  })

  const output = await tryGenerateLore(prompt)
  if (!output) {
    console.warn(
      `[Aveugle] lore exchange generation failed for souvenir ${souvenirId}, Souvenir not spent`
    )
    throw new Error('ai_generation_failed')
  }

  await prisma.souvenir.update({
    where: { id: souvenirId },
    data: { sharedWithAveugle: true, aveugleLoreResult: output.loreResult },
  })

  return { loreResult: output.loreResult, souvenirId }
}

/** Canon price (in spendable Souvenirs) for a given exchange type. */
export function priceForExchange(exchangeType: AveugleExchangeType): number {
  return EXCHANGE_PRICES[exchangeType]
}
