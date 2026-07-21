import { beforeEach, describe, expect, it } from 'vitest'

import {
  ANONYMOUS_SOFT_PROMPT_AT,
  getAnonymousRequestsRemaining,
  useSessionStore,
} from './session-store'

describe('session store anonymous quota', () => {
  beforeEach(() => {
    useSessionStore.setState({
      anonymousRequestCount: 0,
      showSoftPrompt: false,
      softPromptDismissed: false,
    })
  })

  it('ouvre progressivement le rappel avant la limite', () => {
    useSessionStore.setState({ anonymousRequestCount: ANONYMOUS_SOFT_PROMPT_AT - 1 })
    useSessionStore.getState().incrementAnonymousRequestCount()

    expect(useSessionStore.getState().showSoftPrompt).toBe(true)
    expect(getAnonymousRequestsRemaining(ANONYMOUS_SOFT_PROMPT_AT)).toBe(10)
  })

  it('respecte le refus du rappel progressif', () => {
    useSessionStore.setState({ anonymousRequestCount: ANONYMOUS_SOFT_PROMPT_AT - 1 })
    useSessionStore.getState().incrementAnonymousRequestCount()
    useSessionStore.getState().dismissSoftPrompt()
    useSessionStore.getState().incrementAnonymousRequestCount()

    expect(useSessionStore.getState().showSoftPrompt).toBe(false)
  })

  it('ne produit jamais un quota négatif', () => {
    expect(getAnonymousRequestsRemaining(99)).toBe(0)
  })
})
