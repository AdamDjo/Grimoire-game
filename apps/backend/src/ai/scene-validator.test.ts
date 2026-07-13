import { describe, expect, it } from 'vitest'

import { aiSceneSchema, validateAiScene } from './scene-validator'

const basePayload = {
  narrative: 'The wind carries salt across the broken road.',
  sceneType: 'exploration' as const,
  location: 'Salt Road',
  choices: [{ text: 'Keep walking', type: 'action' as const, riskLevel: 'safe' as const }],
}

describe('aiSceneSchema — turnSummary (N1)', () => {
  it('accepts a valid turnSummary', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel reaches the salt road and spots a stranger by a dry well.',
    })

    expect(result.success).toBe(true)
  })

  it('rejects an empty turnSummary', () => {
    const result = aiSceneSchema.safeParse({ ...basePayload, turnSummary: '' })

    expect(result.success).toBe(false)
  })

  it('rejects a turnSummary longer than 200 characters', () => {
    const result = aiSceneSchema.safeParse({ ...basePayload, turnSummary: 'a'.repeat(201) })

    expect(result.success).toBe(false)
  })

  it('accepts a turnSummary at exactly the 200 character boundary', () => {
    const result = aiSceneSchema.safeParse({ ...basePayload, turnSummary: 'a'.repeat(200) })

    expect(result.success).toBe(true)
  })

  it('rejects a payload missing turnSummary entirely', () => {
    const result = aiSceneSchema.safeParse(basePayload)

    expect(result.success).toBe(false)
  })
})

describe('validateAiScene — turnSummary (N1)', () => {
  it('returns success with the parsed turnSummary on valid input', () => {
    const result = validateAiScene({ ...basePayload, turnSummary: 'A stranger appears.' })

    expect(result.success).toBe(true)
    expect(result.data?.turnSummary).toBe('A stranger appears.')
  })

  it('returns failure when turnSummary is missing', () => {
    const result = validateAiScene(basePayload)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
