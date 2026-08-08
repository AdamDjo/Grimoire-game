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

describe('aiSceneSchema — souvenir_candidate (N3, #115)', () => {
  it('accepts a payload with no souvenir_candidate at all (most turns)', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel keeps walking.',
    })

    expect(result.success).toBe(true)
  })

  it('accepts a valid souvenir_candidate', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'The trader falls silent forever.',
      souvenir_candidate: {
        title_suggestion: 'The Trader Who Never Lied',
        body: 'Yarel watched the old trader take his last breath by the dry well, and swore to carry his warning to the next town.',
        type: 'npc-death',
      },
    })

    expect(result.success).toBe(true)
  })

  it('rejects a souvenir_candidate with an invalid type', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      souvenir_candidate: {
        title_suggestion: 'A valid title here',
        body: 'A body long enough to pass the minimum character requirement for this schema.',
        type: 'not-a-real-type',
      },
    })

    expect(result.success).toBe(false)
  })

  it('rejects a souvenir_candidate missing title_suggestion', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      souvenir_candidate: {
        body: 'A body long enough to pass the minimum character requirement for this schema.',
        type: 'moral-choice',
      },
    })

    expect(result.success).toBe(false)
  })

  it('rejects a souvenir_candidate with an empty body', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      souvenir_candidate: { title_suggestion: 'A valid title', body: '', type: 'moral-choice' },
    })

    expect(result.success).toBe(false)
  })
})

describe('aiSceneSchema — apply_condition (#181)', () => {
  it('accepts a payload with no apply_condition at all (most turns)', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel keeps walking.',
    })

    expect(result.success).toBe(true)
  })

  it('accepts a valid [IA-PROPOSÉE] condition id', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel wades through the poisonous marsh.',
      apply_condition: { id: 'poison', reason: 'waded through the poisonous marsh unprotected' },
    })

    expect(result.success).toBe(true)
  })

  it('rejects a [BACKEND] condition id (fever) proposed by the AI', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      apply_condition: { id: 'fever', reason: 'trying to sneak in a backend condition' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects a [BACKEND] condition id (wound) proposed by the AI', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      apply_condition: { id: 'wound', reason: 'trying to sneak in a backend condition' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects an unknown condition id', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      apply_condition: { id: 'not-a-real-condition', reason: 'made up condition' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects an apply_condition missing reason', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      apply_condition: { id: 'poison' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects an apply_condition with an empty reason', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      apply_condition: { id: 'poison', reason: '' },
    })

    expect(result.success).toBe(false)
  })
})

describe('aiSceneSchema — item_gained (#183)', () => {
  it('accepts a payload with no item_gained at all (most turns)', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel keeps walking.',
    })

    expect(result.success).toBe(true)
  })

  it('accepts a valid bag item', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel loots a waterskin from the wreck.',
      item_gained: { name: 'Waterskin', category: 'bag' },
    })

    expect(result.success).toBe(true)
  })

  it('accepts a valid equipment item with a canon slot', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel takes the fallen blade.',
      item_gained: { name: 'Salt-iron blade', category: 'equipment', slot: 'main-hand' },
    })

    expect(result.success).toBe(true)
  })

  it('rejects an equipment item with no slot', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel takes the fallen blade.',
      item_gained: { name: 'Salt-iron blade', category: 'equipment' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects an equipment item with an unknown slot', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel takes the fallen blade.',
      item_gained: { name: 'Salt-iron blade', category: 'equipment', slot: 'backpack' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects an unknown category', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      item_gained: { name: "Grandmother's ring", category: 'heirloom' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects an item_gained missing name', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Something happened.',
      item_gained: { category: 'bag' },
    })

    expect(result.success).toBe(false)
  })

  it('accepts an item_gained with a valid effect', () => {
    const result = aiSceneSchema.safeParse({
      ...basePayload,
      turnSummary: 'Yarel finds a healing salve.',
      item_gained: {
        name: 'Salve of Ash',
        category: 'bag',
        effect: { healAmount: 5, calamineReduction: 2 },
      },
    })

    expect(result.success).toBe(true)
  })
})
