import { describe, expect, it } from 'vitest'

import { getActiveGameSessionHref, hasActiveGameSession } from './active-game-session'

describe('active game session', () => {
  it('accepte le marqueur historique et les routes internes encodées', () => {
    expect(hasActiveGameSession('1')).toBe(true)
    expect(hasActiveGameSession(encodeURIComponent('/velkhar/session/resume'))).toBe(true)
    expect(hasActiveGameSession(undefined)).toBe(false)
    expect(hasActiveGameSession('true')).toBe(false)
  })

  it('refuse les destinations externes', () => {
    expect(getActiveGameSessionHref(encodeURIComponent('/dnd/session/resume'))).toBe(
      '/dnd/session/resume'
    )
    expect(getActiveGameSessionHref(encodeURIComponent('https://example.com'))).toBeUndefined()
    expect(getActiveGameSessionHref(encodeURIComponent('//example.com'))).toBeUndefined()
  })
})
