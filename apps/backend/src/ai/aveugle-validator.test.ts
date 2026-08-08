import { describe, expect, it } from 'vitest'

import {
  aveugleLoreOutputSchema,
  aveugleTalkOutputSchema,
  validateAveugleLoreOutput,
  validateAveugleTalkOutput,
} from './aveugle-validator'

describe('aveugleTalkOutputSchema', () => {
  it('accepts a valid reply', () => {
    const result = aveugleTalkOutputSchema.safeParse({ reply: 'Le vent a parlé de toi.' })

    expect(result.success).toBe(true)
  })

  it('rejects an empty reply', () => {
    const result = aveugleTalkOutputSchema.safeParse({ reply: '' })

    expect(result.success).toBe(false)
  })

  it('rejects a reply longer than 600 characters', () => {
    const result = aveugleTalkOutputSchema.safeParse({ reply: 'a'.repeat(601) })

    expect(result.success).toBe(false)
  })

  it('rejects a payload missing reply', () => {
    const result = aveugleTalkOutputSchema.safeParse({})

    expect(result.success).toBe(false)
  })
})

describe('aveugleLoreOutputSchema', () => {
  it('accepts a valid loreResult', () => {
    const result = aveugleLoreOutputSchema.safeParse({ loreResult: 'La brume dorée tue.' })

    expect(result.success).toBe(true)
  })

  it('rejects an empty loreResult', () => {
    const result = aveugleLoreOutputSchema.safeParse({ loreResult: '' })

    expect(result.success).toBe(false)
  })

  it('rejects a loreResult longer than 1200 characters', () => {
    const result = aveugleLoreOutputSchema.safeParse({ loreResult: 'a'.repeat(1201) })

    expect(result.success).toBe(false)
  })
})

describe('validateAveugleTalkOutput', () => {
  it('returns success with parsed data for a valid payload', () => {
    const result = validateAveugleTalkOutput({ reply: 'Trois pièces pour le lit.' })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ reply: 'Trois pièces pour le lit.' })
  })

  it('returns failure for a non-object payload', () => {
    const result = validateAveugleTalkOutput('not an object')

    expect(result.success).toBe(false)
    expect(result.data).toBeUndefined()
  })
})

describe('validateAveugleLoreOutput', () => {
  it('returns success with parsed data for a valid payload', () => {
    const result = validateAveugleLoreOutput({ loreResult: 'Le sel n’oublie aucun serment.' })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ loreResult: 'Le sel n’oublie aucun serment.' })
  })

  it('returns failure for a payload missing loreResult', () => {
    const result = validateAveugleLoreOutput({})

    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
