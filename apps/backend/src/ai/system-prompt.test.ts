import { describe, expect, it } from 'vitest'

import { buildSystemPrompt, type RecentTurnSummary } from './system-prompt'

import type { MemoryChunkModel } from '../generated/prisma/models'

const character = {
  id: 'char1',
  userId: 'user1',
  name: 'Yarel of the Salt Roads',
  people: 'sahelin',
  vocation: 'salt-walker',
  stats: {
    attributes: { blood: 10, breath: 10, ash: 10 },
    survival: { hp: 20, maxHp: 20, thirst: 100, hunger: 100, energy: 100, calamine: 0 },
    conditions: [],
  },
  createdAt: new Date().toISOString(),
}

function chunk(overrides: Partial<MemoryChunkModel>): MemoryChunkModel {
  return {
    id: 'c1',
    sessionId: 's1',
    summary: 'Yarel crossed the salt flats.',
    keyFacts: ['crossed the flats'],
    keyFactsPinned: [],
    mood: 'calm',
    npcsEvolution: [],
    turnRangeStart: 1,
    turnRangeEnd: 8,
    createdAt: new Date(),
    ...overrides,
  }
}

describe('buildSystemPrompt — N2 memory injection', () => {
  it('injects no memory section when there are no chunks', () => {
    const prompt = buildSystemPrompt(character, 'en')

    expect(prompt).not.toContain('Story so far')
    expect(prompt).not.toContain('Critical facts to always remember')
  })

  it('injects the summaries of every passed chunk, in the order given', () => {
    const chunks = [
      chunk({ id: 'c2', turnRangeStart: 9, turnRangeEnd: 16, summary: 'Second chunk summary' }),
      chunk({ id: 'c1', turnRangeStart: 1, turnRangeEnd: 8, summary: 'First chunk summary' }),
    ]

    const prompt = buildSystemPrompt(character, 'en', chunks)

    expect(prompt).toContain('Story so far')
    expect(prompt).toContain('(turns 9-16) Second chunk summary')
    expect(prompt).toContain('(turns 1-8) First chunk summary')
    expect(prompt.indexOf('Second chunk summary')).toBeLessThan(
      prompt.indexOf('First chunk summary')
    )
  })

  it('deduplicates pinned facts cumulated across all passed chunks', () => {
    const chunks = [
      chunk({
        id: 'c1',
        keyFactsPinned: ['NPC died: the Trader', 'Artifact obtained: shrine relic'],
      }),
      chunk({
        id: 'c2',
        keyFactsPinned: ['Artifact obtained: shrine relic', 'Quest started: find the well'],
      }),
    ]

    const prompt = buildSystemPrompt(character, 'en', chunks)

    expect(prompt).toContain('Critical facts to always remember')
    const occurrences = prompt.split('Artifact obtained: shrine relic').length - 1
    expect(occurrences).toBe(1)
    expect(prompt).toContain('NPC died: the Trader')
    expect(prompt).toContain('Quest started: find the well')
  })

  it('omits the pinned-facts section when no chunk has any pinned fact', () => {
    const chunks = [chunk({ keyFactsPinned: [] })]

    const prompt = buildSystemPrompt(character, 'en', chunks)

    expect(prompt).toContain('Story so far')
    expect(prompt).not.toContain('Critical facts to always remember')
  })
})

describe('buildSystemPrompt — N1 recent-turns injection', () => {
  it('injects no recent-turns section when the list is empty', () => {
    const prompt = buildSystemPrompt(character, 'en', [], [])

    expect(prompt).not.toContain('Recent turns')
  })

  it('injects no recent-turns section when every entry has a null turnSummary', () => {
    const recentTurns: RecentTurnSummary[] = [
      { turnNumber: 2, turnSummary: null },
      { turnNumber: 1, turnSummary: null },
    ]

    const prompt = buildSystemPrompt(character, 'en', [], recentTurns)

    expect(prompt).not.toContain('Recent turns')
  })

  it('formats recent turns in chronological order (oldest first), regardless of input order', () => {
    const recentTurns: RecentTurnSummary[] = [
      { turnNumber: 3, turnSummary: 'Yarel found a shrine.' },
      { turnNumber: 1, turnSummary: 'Yarel left the Aveugle.' },
      { turnNumber: 2, turnSummary: 'Yarel crossed the dunes.' },
    ]

    const prompt = buildSystemPrompt(character, 'en', [], recentTurns)

    expect(prompt).toContain('Recent turns (most recent scenes, in order):')
    expect(prompt).toContain('- (turn 1) Yarel left the Aveugle.')
    expect(prompt).toContain('- (turn 2) Yarel crossed the dunes.')
    expect(prompt).toContain('- (turn 3) Yarel found a shrine.')
    expect(prompt.indexOf('turn 1')).toBeLessThan(prompt.indexOf('turn 2'))
    expect(prompt.indexOf('turn 2')).toBeLessThan(prompt.indexOf('turn 3'))
  })

  it('filters out entries with a null turnSummary while keeping the valid ones', () => {
    const recentTurns: RecentTurnSummary[] = [
      { turnNumber: 2, turnSummary: null },
      { turnNumber: 1, turnSummary: 'Yarel left the Aveugle.' },
    ]

    const prompt = buildSystemPrompt(character, 'en', [], recentTurns)

    expect(prompt).toContain('- (turn 1) Yarel left the Aveugle.')
    expect(prompt).not.toContain('turn 2')
  })

  it('places the N1 recent-turns section after the N2 memory section', () => {
    const chunks = [chunk({ summary: 'Chunk summary' })]
    const recentTurns: RecentTurnSummary[] = [{ turnNumber: 9, turnSummary: 'Latest turn.' }]

    const prompt = buildSystemPrompt(character, 'en', chunks, recentTurns)

    expect(prompt.indexOf('Story so far')).toBeGreaterThanOrEqual(0)
    expect(prompt.indexOf('Recent turns')).toBeGreaterThan(prompt.indexOf('Story so far'))
  })
})
