import { describe, expect, it } from 'vitest'

import {
  validateVocationResolutionOutput,
  vocationResolutionOutputSchema,
} from './vocation-resolution-validator'

const VALID_RESOLVED = {
  understood: true,
  vocationId: 'watcher',
  customVocationName: 'Traqueuse de Cendres',
  narrativeTrait: 'Ne dort jamais deux nuits au même endroit.',
  shiftedSkills: [
    { original: 'Lecture des ruines', shifted: 'Pistage de Calcinés' },
    { original: "Prudence d'artefact", shifted: 'Instinct de traque' },
  ],
  announcement: "L'Aveugle hoche la tête : « Une traqueuse. Le désert te connaît déjà. »",
}

describe('vocationResolutionOutputSchema', () => {
  it('accepts a valid resolved payload', () => {
    const result = vocationResolutionOutputSchema.safeParse(VALID_RESOLVED)

    expect(result.success).toBe(true)
  })

  it('accepts a valid fallback payload', () => {
    const result = vocationResolutionOutputSchema.safeParse({ understood: false })

    expect(result.success).toBe(true)
  })

  it('rejects a hallucinated 5th vocation id', () => {
    const result = vocationResolutionOutputSchema.safeParse({
      ...VALID_RESOLVED,
      vocationId: 'sand-mage',
    })

    expect(result.success).toBe(false)
  })

  it('rejects a resolved payload with only 1 shifted skill', () => {
    const result = vocationResolutionOutputSchema.safeParse({
      ...VALID_RESOLVED,
      shiftedSkills: [{ original: 'Lecture des ruines', shifted: 'Pistage de Calcinés' }],
    })

    expect(result.success).toBe(false)
  })

  it('rejects a resolved payload missing announcement', () => {
    const { announcement: _announcement, ...withoutAnnouncement } = VALID_RESOLVED
    const result = vocationResolutionOutputSchema.safeParse(withoutAnnouncement)

    expect(result.success).toBe(false)
  })

  it('rejects understood:true mixed with a fallback-only shape', () => {
    const result = vocationResolutionOutputSchema.safeParse({ understood: true })

    expect(result.success).toBe(false)
  })
})

describe('validateVocationResolutionOutput', () => {
  it('returns success with parsed data for a valid resolved payload', () => {
    const result = validateVocationResolutionOutput(VALID_RESOLVED)

    expect(result.success).toBe(true)
    expect(result.data).toEqual(VALID_RESOLVED)
  })

  it('returns success for a valid fallback payload', () => {
    const result = validateVocationResolutionOutput({ understood: false })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ understood: false })
  })

  it('returns failure for a non-object payload', () => {
    const result = validateVocationResolutionOutput('not an object')

    expect(result.success).toBe(false)
    expect(result.data).toBeUndefined()
  })

  it('returns failure for a payload with an unknown vocationId', () => {
    const result = validateVocationResolutionOutput({ ...VALID_RESOLVED, vocationId: 'sand-mage' })

    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
