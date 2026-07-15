import { describe, expect, it } from 'vitest'

import { hasActiveGameSession } from './active-game-session'

describe('active game session', () => {
  it('n’accepte que la valeur explicite écrite par le client', () => {
    expect(hasActiveGameSession('1')).toBe(true)
    expect(hasActiveGameSession(undefined)).toBe(false)
    expect(hasActiveGameSession('true')).toBe(false)
  })
})
