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
      backgroundColor: active ? 'var(--salt-paper)' : 'var(--salt-gold)',
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
