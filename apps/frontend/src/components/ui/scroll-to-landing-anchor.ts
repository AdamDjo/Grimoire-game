import { getLenis } from '@/hooks/use-lenis'
import { ScrollTrigger } from '@/lib/gsap-init'

interface ScrollToLandingAnchorOptions {
  onDone?: () => void
}

export function scrollToLandingAnchor(
  hash: string,
  options: ScrollToLandingAnchorOptions = {}
): boolean {
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
