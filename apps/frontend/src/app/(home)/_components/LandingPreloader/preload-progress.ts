// Bus de progression du preload, module-level (même esprit que le WeakMap de
// renderers dans FrameSequenceCanvas) : le canvas hero publie combien de frames
// sont décodées, le LandingPreloader s'y abonne. Découple les deux composants
// sans prop-drilling à travers SectionHero.

interface PreloadState {
  loaded: number
  total: number
}

type Listener = (state: PreloadState) => void

const state: PreloadState = { loaded: 0, total: 0 }
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((listener) => listener({ ...state }))
}

export function setPreloadTotal(total: number) {
  state.total = total
  state.loaded = 0
  emit()
}

export function markFrameLoaded() {
  state.loaded += 1
  emit()
}

export function getPreloadState(): PreloadState {
  return { ...state }
}

export function subscribePreload(listener: Listener): () => void {
  listeners.add(listener)
  listener({ ...state })
  return () => {
    listeners.delete(listener)
  }
}
