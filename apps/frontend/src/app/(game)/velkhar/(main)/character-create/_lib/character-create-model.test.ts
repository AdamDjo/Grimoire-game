import { describe, expect, it } from 'vitest'

import {
  EMPTY_CHARACTER_DRAFT,
  createCharacterResult,
  freeConceptSchema,
  getResumeStep,
  parseStoredCharacterDraft,
} from './character-create-model'

describe('character create model', () => {
  it('rejects an invalid or obsolete stored draft', () => {
    expect(parseStoredCharacterDraft('not-json')).toBeNull()
    expect(parseStoredCharacterDraft(JSON.stringify({ version: 0 }))).toBeNull()
  })

  it('resumes at the first incomplete step', () => {
    expect(getResumeStep(EMPTY_CHARACTER_DRAFT)).toBe('identity')
    expect(getResumeStep({ ...EMPTY_CHARACTER_DRAFT, name: 'Amani' })).toBe('people')
    expect(getResumeStep({ ...EMPTY_CHARACTER_DRAFT, name: 'Amani', peopleId: 'sahelin' })).toBe(
      'vocation'
    )
  })

  it('requires a meaningful free concept', () => {
    expect(freeConceptSchema.safeParse('trop court').success).toBe(false)
    expect(
      freeConceptSchema.safeParse('Une chasseuse de Calcinés en quête de repos.').success
    ).toBe(true)
  })

  it('normalizes the confirmed result without calculating rules', () => {
    const result = createCharacterResult({
      ...EMPTY_CHARACTER_DRAFT,
      name: '  Kael Vane  ',
      peopleId: 'rivain',
      vocationId: 'watcher',
    })

    expect(result.name).toBe('Kael Vane')
    expect(result).not.toHaveProperty('stats')
  })
})
