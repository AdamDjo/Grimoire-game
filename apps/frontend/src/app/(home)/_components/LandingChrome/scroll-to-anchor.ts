import { getLenis } from '@/hooks/use-lenis'
import { ScrollTrigger } from '@/lib/gsap-init'

interface ScrollToAnchorOptions {
  onDone?: () => void
}

// Résout la cible d'un lien d'ancre et pilote le scroll via Lenis (seul driver
// de scroll de la landing). Fallback natif quand Lenis est absent (reduced-motion
// ou avant montage). Offsets pensés pour les sections pinnées :
// - #gameplay : atterrir APRÈS le voile noir d'entrée (~0.6 viewport de pin).
// - #velkhar : retour tout en haut (la section hero est pinnée dès 0).
export function scrollToAnchor(hash: string, options: ScrollToAnchorOptions = {}): boolean {
  if (!hash.startsWith('#')) return false

  const id = hash.slice(1)
  const target = document.getElementById(id)
  if (!target) return false

  const lenis = getLenis()

  if (id === 'velkhar') {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1, onComplete: options.onDone })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      options.onDone?.()
    }
    return true
  }

  if (id === 'outro') {
    const outroTrigger = ScrollTrigger.getById('landing-outro')
    const outroEnd = outroTrigger?.end

    if (typeof outroEnd === 'number') {
      if (lenis) {
        lenis.scrollTo(outroEnd, { duration: 1.35, onComplete: options.onDone })
      } else {
        window.scrollTo({ top: outroEnd, behavior: 'smooth' })
        options.onDone?.()
      }
      return true
    }
  }

  const offset = id === 'gameplay' ? window.innerHeight * 0.6 : 0

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.15, onComplete: options.onDone })
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
    options.onDone?.()
  }

  return true
}
