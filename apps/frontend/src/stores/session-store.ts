import { create } from 'zustand'

export const ANONYMOUS_REQUEST_LIMIT = 30
export const ANONYMOUS_SOFT_PROMPT_AT = 20

export function getAnonymousRequestsRemaining(count: number): number {
  return Math.max(0, ANONYMOUS_REQUEST_LIMIT - count)
}

interface SessionState {
  anonymousRequestCount: number
  softPromptDismissed: boolean
  showSoftPrompt: boolean
  incrementAnonymousRequestCount: () => void
  dismissSoftPrompt: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  anonymousRequestCount: 0,
  softPromptDismissed: false,
  showSoftPrompt: false,
  incrementAnonymousRequestCount: () =>
    set((state) => {
      const anonymousRequestCount = state.anonymousRequestCount + 1
      return {
        anonymousRequestCount,
        showSoftPrompt:
          anonymousRequestCount >= ANONYMOUS_REQUEST_LIMIT ||
          (anonymousRequestCount >= ANONYMOUS_SOFT_PROMPT_AT && !state.softPromptDismissed)
            ? true
            : state.showSoftPrompt,
      }
    }),
  dismissSoftPrompt: () => set({ showSoftPrompt: false, softPromptDismissed: true }),
}))
