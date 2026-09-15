import { prisma } from '../lib/prisma'
import { hasSupabaseServiceKey, uploadSceneImage } from '../lib/supabase-storage'

import type { DepthBand, LieuType, SceneType } from '@grimoire/shared'

const GENERATION_TIMEOUT_MS = 15000

/**
 * Classifies the dungeon archetype from the free-text `location`, using the
 * canon list (03-BESTIARY.md §9). `plein_air` is the default — it covers the
 * surface and any floor the narration does not mark as built or enclosed.
 */
export function classifyLieuType(location: string): LieuType {
  const normalized = location.toLowerCase()

  if (/ruine|archontique/.test(normalized)) return 'ruines_archontiques'
  if (/crypte|tombe|revenant/.test(normalized)) return 'cryptes'
  if (/caverne|cendre/.test(normalized)) return 'cavernes_cendre'
  if (normalized.includes('donjon')) return 'donjon_profond'
  return 'plein_air'
}

/**
 * Builds the finite, structured cache key.
 *
 * Indexed on depth rather than biome since the run loop landed: a run is a
 * descent, so what the player must read off the picture is how far down they
 * are, not which region of the map the fiction sits in. `depthBand` comes from
 * the run state and `lieuType` from the narration, which keeps the key bounded
 * at 6 scene types × 5 bands × 5 archetypes.
 *
 * @see docs/canon/03-BESTIARY.md §6bis
 */
export function buildCacheKey(
  sceneType: SceneType,
  depthBand: DepthBand,
  lieuType: LieuType
): string {
  return `${sceneType}_${depthBand}_${lieuType}`
}

function buildImagePrompt(sceneType: SceneType, depthBand: DepthBand, lieuType: LieuType): string {
  /**
   * Light is the through-line: it thins band by band until there is none left
   * but the ash itself. That gradient is what makes two floors of the same
   * archetype read as different places.
   */
  const depthLabel: Record<DepthBand, string> = {
    surface: 'above ground under an open sky, warm daylight',
    upper: 'a shallow underground level, pale daylight still falling from above',
    mid: 'a deep underground level, no daylight left, lit only by torchlight',
    deep: 'a very deep oppressive underground level, heavy darkness, distant golden glow',
    abyss: 'the deepest level of all, near-total darkness lit by burning golden ash',
  }
  const lieuLabel: Record<LieuType, string> = {
    plein_air: 'open terrain, wind-carved rock and drifting golden dust',
    ruines_archontiques: 'ancient haunted ruins of a fallen civilization',
    cryptes: 'an old crypt with stone tombs',
    cavernes_cendre: 'a cavern saturated with golden ash mist',
    donjon_profond: 'a deep dangerous dungeon of worked stone',
  }

  const parts = [
    'dark fantasy game background art, painterly, no text, no UI',
    depthLabel[depthBand],
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
 * Resolves the shared cache image URL for a `sceneType`/`depthBand`/`lieuType`
 * combination. Returns the existing URL on a cache hit; on a miss, generates
 * once, uploads to Supabase Storage, persists the cache row, and returns the
 * new URL. Never throws — returns null on any failure so the caller falls
 * back to the frontend's static theme image, same defensive pattern as the
 * stub scene fallback.
 * @see docs/tech/SCENE_IMAGES.md
 */
export async function resolveSceneImage(
  sceneType: SceneType,
  depthBand: DepthBand,
  lieuType: LieuType
): Promise<string | null> {
  const cacheKey = buildCacheKey(sceneType, depthBand, lieuType)

  const existing = await prisma.sceneImage.findUnique({ where: { cacheKey } })
  if (existing) {
    return existing.url
  }

  if (!hasSupabaseServiceKey()) {
    return null
  }

  const bytes = await generateImage(buildImagePrompt(sceneType, depthBand, lieuType))
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
