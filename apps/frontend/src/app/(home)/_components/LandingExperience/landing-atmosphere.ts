import { gsap } from '@/lib/gsap-init'

const noop = () => undefined

/** Selectors the cursor treats as "something to act on". */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary'

/**
 * Warm light following the pointer across the whole page. It fades in on the
 * first move so a still pointer never lights anything, and rides quickTo so the
 * light lags the cursor slightly — a lantern carried, not a spotlight glued on.
 */
export function attachReadingBeam(beam: HTMLElement) {
  const x = gsap.quickSetter(beam, '--beam-x', '%') as (value: number) => void
  const y = gsap.quickSetter(beam, '--beam-y', '%') as (value: number) => void
  let lit = false
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    x((event.clientX / window.innerWidth) * 100)
    y((event.clientY / window.innerHeight) * 100)
    if (lit) return
    lit = true
    gsap.to(beam, { opacity: 1, duration: 1.2, ease: 'power2.out' })
  }
  const leave = () => {
    lit = false
    gsap.to(beam, { opacity: 0, duration: 0.6, ease: 'power2.out' })
  }
  window.addEventListener('pointermove', move, { passive: true })
  document.addEventListener('pointerleave', leave)
  return () => {
    window.removeEventListener('pointermove', move)
    document.removeEventListener('pointerleave', leave)
  }
}

/**
 * Custom cursor: one grain of salt riding the pointer — the page's own lozenge,
 * no ring around it. It widens over anything interactive. The native cursor
 * stays visible — hiding it would strip an affordance if a frame ever drops.
 */
export function attachCursor(cursor: HTMLElement) {
  const grain = cursor.querySelector<HTMLElement>('.salt-cursor__grain')
  if (!grain) return noop

  // The lozenge is drawn square and tilted here, so GSAP owns the whole
  // transform: a CSS rotate would be wiped by the very first position tween.
  gsap.set(grain, { rotation: 45 })

  const grainX = gsap.quickTo(grain, 'x', { duration: 0.14, ease: 'power3.out' })
  const grainY = gsap.quickTo(grain, 'y', { duration: 0.14, ease: 'power3.out' })

  let shown = false
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    grainX(event.clientX)
    grainY(event.clientY)
    if (shown) return
    shown = true
    gsap.to(cursor, { opacity: 1, duration: 0.4 })
  }

  const over = (event: PointerEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const active = Boolean(target.closest(INTERACTIVE))
    gsap.to(grain, {
      scale: active ? 1.9 : 1,
      backgroundColor: active ? 'var(--salt-paper, #eee8db)' : 'var(--salt-gold, #d9ac55)',
      duration: 0.3,
      ease: 'power3.out',
    })
  }

  const down = () => {
    gsap.to(grain, { scale: 0.7, duration: 0.16 })
  }
  const up = () => {
    gsap.to(grain, { scale: 1, duration: 0.28 })
  }
  const hide = () => {
    shown = false
    gsap.to(cursor, { opacity: 0, duration: 0.3 })
  }

  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerover', over, { passive: true })
  window.addEventListener('pointerdown', down)
  window.addEventListener('pointerup', up)
  document.addEventListener('pointerleave', hide)

  return () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerover', over)
    window.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerup', up)
    document.removeEventListener('pointerleave', hide)
    gsap.set(cursor, { opacity: 0 })
  }
}

/**
 * Leaving the landing plays as a cut in the same film: the veil falls, the mark
 * breathes, then the router takes over underneath. Only same-origin document
 * navigations are veiled — new tabs, downloads, modified clicks and in-page
 * anchors keep the browser's own behaviour.
 */
export function attachPageVeil(
  root: HTMLElement,
  veil: HTMLElement,
  navigate: (to: string) => void
) {
  const mark = veil.querySelector<HTMLElement>('.salt-veil__mark')

  const fall = (to: string) => {
    const timeline = gsap.timeline({
      onComplete: () => navigate(to),
    })
    timeline
      .set(veil, { visibility: 'visible' })
      .to(veil, { opacity: 1, duration: 0.42, ease: 'power2.inOut' })
    if (mark) timeline.to(mark, { opacity: 1, duration: 0.32, ease: 'power2.out' }, 0.18)
    return timeline
  }

  const click = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest('a')
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return

    const href = link.getAttribute('href')
    // In-page anchors are the deck's business, not a navigation.
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
      return

    const url = new URL(link.href, window.location.href)
    if (url.origin !== window.location.origin) return
    if (url.pathname === window.location.pathname && url.hash) return

    event.preventDefault()
    fall(url.pathname + url.search + url.hash)
  }

  root.addEventListener('click', click)

  // Coming back via the browser's history must never leave the veil down.
  const restore = () => {
    gsap.set(veil, { opacity: 0, visibility: 'hidden' })
    if (mark) gsap.set(mark, { opacity: 0 })
  }
  window.addEventListener('pageshow', restore)

  return () => {
    root.removeEventListener('click', click)
    window.removeEventListener('pageshow', restore)
    restore()
  }
}
