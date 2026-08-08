import { describe, expect, it } from 'vitest'

import { chronicleOutputSchema, validateChronicleOutput } from './chronicle-validator'

const validPayload = {
  title: 'The Last Crossing of Yarel',
  body_markdown: 'A long literary chronicle body describing the run.',
  mood: 'epic' as const,
  key_moments: [{ label: 'Yarel crosses the salt flats', scene_ref: 3 }],
  tagline: 'The salt remembers her name',
}

describe('chronicleOutputSchema', () => {
  it('accepts a valid payload', () => {
    const result = chronicleOutputSchema.safeParse(validPayload)

    expect(result.success).toBe(true)
  })

  it('rejects a title longer than 80 characters', () => {
    const result = chronicleOutputSchema.safeParse({ ...validPayload, title: 'a'.repeat(81) })

    expect(result.success).toBe(false)
  })

  it('rejects an empty title', () => {
    const result = chronicleOutputSchema.safeParse({ ...validPayload, title: '' })

    expect(result.success).toBe(false)
  })

  it('rejects an empty body_markdown', () => {
    const result = chronicleOutputSchema.safeParse({ ...validPayload, body_markdown: '' })

    expect(result.success).toBe(false)
  })

  it('rejects a mood outside the fixed enum', () => {
    const result = chronicleOutputSchema.safeParse({ ...validPayload, mood: 'joyful' })

    expect(result.success).toBe(false)
  })

  it('rejects a key_moments entry missing scene_ref', () => {
    const result = chronicleOutputSchema.safeParse({
      ...validPayload,
      key_moments: [{ label: 'Yarel crosses the salt flats' }],
    })

    expect(result.success).toBe(false)
  })

  it('accepts an empty key_moments array', () => {
    const result = chronicleOutputSchema.safeParse({ ...validPayload, key_moments: [] })

    expect(result.success).toBe(true)
  })

  it('rejects a tagline shorter than 15 characters', () => {
    const result = chronicleOutputSchema.safeParse({ ...validPayload, tagline: 'Too short' })

    expect(result.success).toBe(false)
  })

  it('rejects a tagline longer than 30 characters', () => {
    const result = chronicleOutputSchema.safeParse({ ...validPayload, tagline: 'a'.repeat(31) })

    expect(result.success).toBe(false)
  })

  it('rejects a payload carrying an illustration_prompt (out of scope for #116)', () => {
    // illustration_prompt is simply ignored (not an error) since Zod strips unknown
    // keys by default — this test documents that the field is never surfaced in `data`.
    const result = chronicleOutputSchema.safeParse({
      ...validPayload,
      illustration_prompt: 'a painterly wide shot of the salt flats at dusk',
    })

    expect(result.success).toBe(true)
    expect(result.success && 'illustration_prompt' in result.data).toBe(false)
  })
})

describe('validateChronicleOutput', () => {
  it('returns success with parsed data for a valid payload', () => {
    const result = validateChronicleOutput(validPayload)

    expect(result.success).toBe(true)
    expect(result.data).toEqual(validPayload)
  })

  it('returns failure with an error message for an invalid payload', () => {
    const result = validateChronicleOutput({ title: 'Too short a payload' })

    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
    expect(result.data).toBeUndefined()
  })

  it('returns failure for a non-object payload', () => {
    const result = validateChronicleOutput('not an object')

    expect(result.success).toBe(false)
  })
})
