import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap-init'

const noop = () => undefined

/**
 * One transition, played identically at every border. It repeats the threshold's
 * own move — the plate settles out of a slight rise, the copy lifts with it — so
 * a scroll always reads the same whichever plan is being crossed. Nothing is
 * staged per section: no doors, no wipes, no cards dealt out.
 *
 * Driven by the plan's own scroll position rather than the deck, so it stays
 * correct when the reader drags the scrollbar or jumps by anchor.
 */
export function attachPlanTransition(root: HTMLElement) {
  const tweens: gsap.core.Tween[] = []

  gsap.utils.toArray<HTMLElement>('.salt-plan', root).forEach((plan, index) => {
    // The threshold is pinned and sets the grammar; it does not repeat it.
    if (index === 0) return

    // The same window for both layers: they arrive together, as one move.
    const window = {
      trigger: plan,
      start: 'top bottom',
      end: 'top 35%',
      scrub: 0.6,
      invalidateOnRefresh: true,
    } as const

    // Never from zero opacity — the art is content, and a blank frame would read
    // as a fault rather than as a transition.
    const art = plan.querySelector<HTMLElement>('.salt-art')
    if (art) {
      tweens.push(
        gsap.fromTo(
          art,
          { yPercent: 6, opacity: 0.55 },
          { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { ...window } }
        )
      )
    }

    const copy = plan.querySelector<HTMLElement>('.salt-copy')
    if (copy) {
      tweens.push(
        gsap.fromTo(copy, { y: 34 }, { y: 0, ease: 'none', scrollTrigger: { ...window } })
      )
    }
  })

  return () => tweens.forEach((tween) => tween.scrollTrigger?.kill())
}

/**
 * Headings resolve word by word as their plan is read: each word rises out of a
 * mask and its weight settles. Scrubbed, so the reader controls the reveal.
 */
export function attachHeadingResolve(plan: HTMLElement) {
  const heading = plan.querySelector<HTMLElement>('.salt-copy h2')
  if (!heading) return noop

  let tween: gsap.core.Tween | undefined
  const split = SplitText.create(heading, {
    type: 'words',
    mask: 'words',
    wordsClass: 'salt-word',
    autoSplit: true,
    // GSAP requires the animation back so autoSplit can revert it on re-split.
    // A Tween is thenable, which the void-return lint rule mistakes for a promise.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSplit: (self) => {
      tween?.scrollTrigger?.kill()
      tween = gsap.from(self.words, {
        yPercent: 118,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: plan,
          start: 'top 88%',
          end: 'top 42%',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })
      return tween
    },
  })

  return () => {
    tween?.scrollTrigger?.kill()
    split.revert()
  }
}

/**
 * A gold hairline draws itself across the seam between two plans as the reader
 * crosses it — the visual equivalent of a page turn.
 */
export function attachSeams(root: HTMLElement) {
  const plans = gsap.utils.toArray<HTMLElement>('.salt-plan', root)
  const created: HTMLElement[] = []
  const tweens: gsap.core.Tween[] = []

  plans.slice(1).forEach((plan) => {
    const seam = document.createElement('i')
    seam.className = 'salt-seam'
    seam.setAttribute('aria-hidden', 'true')
    plan.prepend(seam)
    created.push(seam)
    tweens.push(
      gsap.fromTo(
        seam,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: plan,
            start: 'top 96%',
            end: 'top 55%',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        }
      )
    )
  })

  return () => {
    tweens.forEach((tween) => tween.scrollTrigger?.kill())
    created.forEach((seam) => seam.remove())
  }
}

/**
 * Reading counter in the corner: the current plan's number against the total,
 * plus its name. It tells the reader where they stand in a page that has no
 * visible scrollbar rhythm of its own.
 */
export function attachPlanCounter(root: HTMLElement, counter: HTMLElement) {
  const plans = gsap.utils.toArray<HTMLElement>('.salt-plan', root)
  const current = counter.querySelector<HTMLElement>('.salt-counter__current')
  const label = counter.querySelector<HTMLElement>('.salt-counter__label')
  const total = counter.querySelector<HTMLElement>('.salt-counter__total')
  if (!current || !label || !total) return noop

  total.textContent = String(plans.length).padStart(2, '0')
  const triggers: ScrollTrigger[] = []

  const write = (index: number) => {
    current.textContent = String(index + 1).padStart(2, '0')
    label.textContent = plans[index].querySelector<HTMLElement>('.salt-eyebrow')?.textContent ?? ''
  }

  // Tracked here rather than read back from the DOM: the markup ships a
  // placeholder "01", which would make the first plan look already shown.
  let shown = -1

  const show = (index: number) => {
    if (shown === index) return
    shown = index
    gsap
      .timeline()
      .to([current, label], { opacity: 0, y: -6, duration: 0.18, ease: 'power2.in' })
      .add(() => write(index))
      .fromTo(
        [current, label],
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
      )
  }

  plans.forEach((plan, index) => {
    triggers.push(
      ScrollTrigger.create({
        trigger: plan,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: ({ isActive }) => {
          if (isActive) show(index)
        },
      })
    )
  })

  // The first plan is written outright: cross-fading on load would be movement
  // with nothing behind it.
  shown = 0
  write(0)
  gsap.to(counter, { opacity: 1, duration: 0.6, delay: 1.8 })

  return () => {
    triggers.forEach((trigger) => trigger.kill())
    gsap.set(counter, { opacity: 0 })
  }
}
