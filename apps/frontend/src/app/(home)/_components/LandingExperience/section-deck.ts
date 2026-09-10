'use client'

import { getLenis } from '@/hooks/use-lenis'
import { ScrollTrigger } from '@/lib/gsap-init'

/** Long enough to read as a move, short enough to feel immediate. */
const TRAVEL = 0.9
/** A trackpad sends a long tail of events; one gesture must not skip two plans. */
const LOCK_MS = 950

/**
 * Deck navigation: one wheel gesture moves exactly one plan. The wheel is taken
 * over so Lenis' momentum can never leave the reader between two plans, and the
 * deck refuses further input until the current move has landed.
 */
export function createSectionDeck(root: HTMLElement) {
  const plans = Array.from(root.querySelectorAll<HTMLElement>('.salt-plan'))
  if (plans.length < 2) return () => undefined

  /**
   * A pinned plan is measured on its spacer: ScrollTrigger holds the section
   * itself against the viewport, so only the spacer marks the real stop.
   */
  const stops = () => {
    const limit = ScrollTrigger.maxScroll(window)
    const tops = plans.map((plan) => {
      const parent = plan.parentElement
      const box = parent?.classList.contains('pin-spacer') ? parent : plan
      return Math.min(Math.round(box.getBoundingClientRect().top + window.scrollY), limit)
    })
    // Whatever follows the last plan (the footer) deserves its own stop, otherwise
    // the closing plan would be cropped to make room for it.
    if (limit - tops[tops.length - 1] > 1) tops.push(limit)
    return tops
  }

  let targets = stops()
  let index = 0
  let locked = false
  let timer = 0

  /** The nearest stop to a given position — the deck's own reading of "where we are". */
  const nearest = (y: number) =>
    targets.reduce(
      (best, value, at) => (Math.abs(value - y) < Math.abs(targets[best] - y) ? at : best),
      0
    )

  const fly = (duration: number) => {
    getLenis()?.scrollTo(targets[index], {
      duration,
      easing: (time: number) => 1 - Math.pow(1 - time, 3),
      lock: true,
    })
  }

  const refresh = () => {
    targets = stops()
    if (locked) {
      // Mid-flight the reader sits between two plans, so the nearest stop is not
      // where they are going: re-snapping the index would strand the move. The
      // refresh has just cancelled Lenis' tween, so the trip is resumed towards
      // the same plan, shortened to what is left of it.
      fly(TRAVEL * 0.6)
      return
    }
    // Keep the current plan under the reader after a resize or a late reflow.
    index = nearest(window.scrollY)
  }

  const go = (direction: number) => {
    // Anything that moves the page without going through the deck — an anchor
    // click, a hash on load, the keyboard — would otherwise leave the index on a
    // plan the reader has already left, and the next gesture would fly backwards.
    // Mid-flight the index is the destination and must be kept.
    if (!locked) index = nearest(window.scrollY)
    const next = Math.min(Math.max(index + direction, 0), targets.length - 1)
    if (next === index) return
    index = next
    locked = true
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      locked = false
    }, LOCK_MS)
    fly(TRAVEL)
  }

  /**
   * The demo keeps the wheel only while it still has somewhere to go. Handing it
   * every gesture that merely lands on it — the reader's cursor sits over the
   * demo the whole time they read that plan — let the native scroll through and
   * dropped the deck between two plans, which is why the plan after the demo was
   * the one that never arrived square.
   */
  const scrolls = (target: EventTarget | null, direction: number) => {
    if (!(target instanceof Element) || !target.closest('.salt-demo')) return false
    let node: Element | null = target
    while (node) {
      const overflow = getComputedStyle(node).overflowY
      if (overflow === 'auto' || overflow === 'scroll') {
        const room =
          direction > 0 ? node.scrollHeight - node.clientHeight - node.scrollTop : node.scrollTop
        if (room > 1) return true
      }
      if (node.classList.contains('salt-demo')) break
      node = node.parentElement
    }
    return false
  }

  const onWheel = (event: WheelEvent) => {
    // The playable demo keeps its own scrolling, but only where it can act on it.
    if (scrolls(event.target, event.deltaY > 0 ? 1 : -1)) return
    event.preventDefault()
    if (locked || Math.abs(event.deltaY) < 4) return
    go(event.deltaY > 0 ? 1 : -1)
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  ScrollTrigger.addEventListener('refresh', refresh)

  return () => {
    window.clearTimeout(timer)
    window.removeEventListener('wheel', onWheel)
    ScrollTrigger.removeEventListener('refresh', refresh)
  }
}
