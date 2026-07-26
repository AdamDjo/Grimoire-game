import { prisma } from '../lib/prisma'
import { hasSupabaseServiceKey, uploadSceneImage } from '../lib/supabase-storage'

import type { Biome, LieuType, SceneType } from '@grimoire/shared'

const GENERATION_TIMEOUT_MS = 15000

/**
 * Classifies the current biome from the free-text `location` the AI narrates.
 * The backend is the sole authority (never the AI) so the cache key stays
 * stable regardless of narration phrasing. Keywords are the canon biome names
 * themselves (06-SURVIVAL.md §5) — `coeur` (Velkhar) is the default when no
 * other biome keyword matches, since most early-game scenes are there.
 */
export function classifyBiome(location: string): Biome {
  const normalized = location.toLowerCase()

  if (/tissan|désert|desert/.test(normalized)) return 'tissan'
  if (/doigt|montagne/.test(normalized)) return 'doigts'
  if (/rivage|côte|cote|plage/.test(normalized)) return 'rivage'
  if (/marais|lekh/.test(normalized)) return 'marais_lekh'
  return 'coeur'
}

/**
 * Classifies the dungeon archetype from the free-text `location`, using the
 * canon list (03-BESTIARY.md §9). `plein_air` is the default — most scenes
 * are not inside a dungeon.
 */
export function classifyLieuType(location: string): LieuType {
  const normalized = location.toLowerCase()

  if (/ruine|archontique/.test(normalized)) return 'ruines_archontiques'
  if (/crypte|tombe|revenant/.test(normalized)) return 'cryptes'
  if (/caverne|cendre/.test(normalized)) return 'cavernes_cendre'
  if (normalized.includes('donjon')) return 'donjon_profond'
  return 'plein_air'
}

/** Builds the finite, structured cache key — never derived from AI free text directly. */
export function buildCacheKey(sceneType: SceneType, biome: Biome, lieuType: LieuType): string {
  return `${sceneType}_${biome}_${lieuType}`
}

function buildImagePrompt(sceneType: SceneType, biome: Biome, lieuType: LieuType): string {
  const biomeLabel: Record<Biome, string> = {
    tissan: 'a scorching desert with dunes and mirages',
    doigts: 'jagged cold mountains with archontic ruins',
    rivage: 'a temperate coastline with a rocky shore',
    marais_lekh: 'a misty contaminated swamp',
    coeur: 'the walled city of Velkhar, dense and lived-in',
  }
  const lieuLabel: Partial<Record<LieuType, string>> = {
    ruines_archontiques: 'ancient haunted ruins of a fallen civilization',
    cryptes: 'an old crypt with stone tombs',
    cavernes_cendre: 'a cavern saturated with golden ash mist',
    donjon_profond: 'a deep dangerous dungeon',
  }

  const parts = [
    'dark fantasy game background art, painterly, no text, no UI',
    biomeLabel[biome],
    lieuLabel[lieuType],
    sceneType === 'combat' ? 'tense atmosphere' : undefined,
    sceneType === 'rest' ? 'calm campfire mood' : undefined,
  ].filter((part): part is string => Boolean(part))

  return parts.join(', ')
}

/** Calls Pollinations.ai (free, no API key) and returns the generated image bytes, or null on failure. */
async function generateImage(prompt: string): Promise<Uint8Array | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS)

  try {
    const response = await fetch(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=576&nologo=true`,
      { signal: controller.signal }
    )

    if (!response.ok) {
      console.warn(`[SceneImage] Pollinations request failed (${response.status})`)
      return null
    }

    return new Uint8Array(await response.arrayBuffer())
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    console.warn(`[SceneImage] Pollinations request errored: ${message}`)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Resolves the shared cache image URL for a `sceneType`/`biome`/`lieuType`
 * combination. Returns the existing URL on a cache hit; on a miss, generates
 * once, uploads to Supabase Storage, persists the cache row, and returns the
 * new URL. Never throws — returns null on any failure so the caller falls
 * back to the frontend's static theme image, same defensive pattern as the
 * stub scene fallback.
 * @see docs/public/tech/DYNAMIC_SCENE_IMAGES.md
 */
export async function resolveSceneImage(
  sceneType: SceneType,
  biome: Biome,
  lieuType: LieuType
): Promise<string | null> {
  const cacheKey = buildCacheKey(sceneType, biome, lieuType)

  const existing = await prisma.sceneImage.findUnique({ where: { cacheKey } })
  if (existing) {
    return existing.url
  }

  if (!hasSupabaseServiceKey()) {
    return null
  }

  const bytes = await generateImage(buildImagePrompt(sceneType, biome, lieuType))
  if (!bytes) {
    return null
  }

  const url = await uploadSceneImage(`${cacheKey}.jpg`, bytes)
  if (!url) {
    return null
  }

  try {
    await prisma.sceneImage.create({ data: { cacheKey, url } })
  } catch (err) {
    // Another request won the race and inserted the same cacheKey first (unique
    // constraint) — reuse its row rather than treat this as a failure.
    const existingAfterRace = await prisma.sceneImage.findUnique({ where: { cacheKey } })
    if (existingAfterRace) {
      return existingAfterRace.url
    }
    console.warn(`[SceneImage] failed to persist cache row for ${cacheKey}:`, err)
    return url
  }

  return url
}
