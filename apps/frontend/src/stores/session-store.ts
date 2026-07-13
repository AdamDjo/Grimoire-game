import { create } from 'zustand'

const ANONYMOUS_REQUEST_LIMIT = 30

interface SessionState {
  anonymousRequestCount: number
  showSoftPrompt: boolean
  incrementAnonymousRequestCount: () => void
  dismissSoftPrompt: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  anonymousRequestCount: 0,
  showSoftPrompt: false,
  incrementAnonymousRequestCount: () =>
    set((state) => {
      const anonymousRequestCount = state.anonymousRequestCount + 1
      return {
        anonymousRequestCount,
        showSoftPrompt:
          anonymousRequestCount >= ANONYMOUS_REQUEST_LIMIT ? true : state.showSoftPrompt,
      }
    }),
  dismissSoftPrompt: () => set({ showSoftPrompt: false }),
}))
