import { beforeEach, describe, expect, it, vi } from 'vitest'

const sceneImageFindUnique = vi.fn()
const sceneImageCreate = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: { sceneImage: { findUnique: sceneImageFindUnique, create: sceneImageCreate } },
}))

const hasSupabaseServiceKey = vi.fn<() => boolean>()
const uploadSceneImage = vi.fn<(...args: unknown[]) => Promise<string | null>>()
vi.mock('../lib/supabase-storage', () => ({
  hasSupabaseServiceKey: () => hasSupabaseServiceKey(),
  uploadSceneImage: (...args: unknown[]) => uploadSceneImage(...args),
}))

const { classifyLieuType, buildCacheKey, resolveSceneImage } = await import('./scene-image.service')

describe('classifyLieuType', () => {
  it('matches each canon lieuType keyword', () => {
    expect(classifyLieuType('ancient archontique ruins')).toBe('ruines_archontiques')
    expect(classifyLieuType('a crypte full of tombs')).toBe('cryptes')
    expect(classifyLieuType('a caverne saturated with cendre')).toBe('cavernes_cendre')
    expect(classifyLieuType('a deep donjon')).toBe('donjon_profond')
  })

  it('defaults to plein_air when no keyword matches', () => {
    expect(classifyLieuType('an open market square')).toBe('plein_air')
  })
})

describe('buildCacheKey', () => {
  it('joins sceneType, depthBand and lieuType with underscores', () => {
    expect(buildCacheKey('combat', 'surface', 'plein_air')).toBe('combat_surface_plein_air')
  })

  it('separates two floors of the same archetype by their band', () => {
    expect(buildCacheKey('combat', 'upper', 'cryptes')).not.toBe(
      buildCacheKey('combat', 'abyss', 'cryptes')
    )
  })
})

describe('resolveSceneImage', () => {
  beforeEach(() => {
    sceneImageFindUnique.mockReset()
    sceneImageCreate.mockReset()
    hasSupabaseServiceKey.mockReset()
    uploadSceneImage.mockReset()
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)) })
    )
  })

  it('returns the cached URL on a cache hit without generating anything', async () => {
    sceneImageFindUnique.mockResolvedValue({ url: 'https://cache/combat_surface_plein_air.jpg' })

    const url = await resolveSceneImage('combat', 'surface', 'plein_air')

    expect(url).toBe('https://cache/combat_surface_plein_air.jpg')
    expect(hasSupabaseServiceKey).not.toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns null on a cache miss when no service key is configured', async () => {
    sceneImageFindUnique.mockResolvedValue(null)
    hasSupabaseServiceKey.mockReturnValue(false)

    const url = await resolveSceneImage('combat', 'surface', 'plein_air')

    expect(url).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('generates, uploads and persists a new cache row on a cache miss', async () => {
    sceneImageFindUnique.mockResolvedValue(null)
    hasSupabaseServiceKey.mockReturnValue(true)
    uploadSceneImage.mockResolvedValue('https://cache/new.jpg')
    sceneImageCreate.mockResolvedValue({})

    const url = await resolveSceneImage('rest', 'surface', 'plein_air')

    expect(url).toBe('https://cache/new.jpg')
    expect(uploadSceneImage).toHaveBeenCalledWith(
      'rest_surface_plein_air.jpg',
      expect.any(Uint8Array)
    )
    expect(sceneImageCreate).toHaveBeenCalledWith({
      data: { cacheKey: 'rest_surface_plein_air', url: 'https://cache/new.jpg' },
    })
  })

  it('reuses the winning row when a concurrent request wins the unique-key race', async () => {
    sceneImageFindUnique.mockResolvedValueOnce(null)
    hasSupabaseServiceKey.mockReturnValue(true)
    uploadSceneImage.mockResolvedValue('https://cache/mine.jpg')
    sceneImageCreate.mockRejectedValue(new Error('unique constraint'))
    sceneImageFindUnique.mockResolvedValueOnce({ url: 'https://cache/winner.jpg' })

    const url = await resolveSceneImage('rest', 'surface', 'plein_air')

    expect(url).toBe('https://cache/winner.jpg')
  })

  it('returns null when image generation fails', async () => {
    sceneImageFindUnique.mockResolvedValue(null)
    hasSupabaseServiceKey.mockReturnValue(true)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const url = await resolveSceneImage('combat', 'surface', 'plein_air')

    expect(url).toBeNull()
    expect(uploadSceneImage).not.toHaveBeenCalled()
  })

  it('returns null when the Storage upload fails', async () => {
    sceneImageFindUnique.mockResolvedValue(null)
    hasSupabaseServiceKey.mockReturnValue(true)
    uploadSceneImage.mockResolvedValue(null)

    const url = await resolveSceneImage('combat', 'surface', 'plein_air')

    expect(url).toBeNull()
    expect(sceneImageCreate).not.toHaveBeenCalled()
  })
})
