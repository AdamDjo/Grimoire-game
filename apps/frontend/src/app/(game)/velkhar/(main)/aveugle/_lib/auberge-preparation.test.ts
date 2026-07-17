import { describe, expect, it } from 'vitest'

import {
  addSeenId,
  EMPTY_AUBERGE_PREPARATION,
  parseAubergePreparation,
  withOmenQuery,
} from './auberge-preparation'

describe('auberge preparation', () => {
  it('rejette les données locales invalides', () => {
    expect(parseAubergePreparation('{invalid')).toEqual(EMPTY_AUBERGE_PREPARATION)
    expect(parseAubergePreparation(JSON.stringify({ version: 2 }))).toEqual(
      EMPTY_AUBERGE_PREPARATION
    )
  })

  it('filtre les identifiants inconnus', () => {
    expect(
      parseAubergePreparation(
        JSON.stringify({
          version: 1,
          selectedOmenId: 'follow-smoke',
          seenTopicIds: ['calcines', 'unknown'],
          seenMemoryIds: ['vane-night', 'unknown'],
        })
      )
    ).toEqual({
      version: 1,
      selectedOmenId: 'follow-smoke',
      seenTopicIds: ['calcines'],
      seenMemoryIds: ['vane-night'],
    })
  })

  it('évite les doublons dans les éléments consultés', () => {
    expect(addSeenId(['calcines'], 'calcines')).toEqual(['calcines'])
  })

  it('transmet le présage au prochain run', () => {
    expect(withOmenQuery('/velkhar/session/new', 'avoid-bells')).toBe(
      '/velkhar/session/new?omen=avoid-bells'
    )
  })
})
