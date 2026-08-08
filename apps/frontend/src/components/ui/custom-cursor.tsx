'use client'

import { useEffect, useRef } from 'react'

import { gsap } from '@/lib/gsap-init'

import './custom-cursor.css'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label'
const DISABLED_SELECTOR = '[aria-disabled="true"], :disabled'
const EMBER_POOL_SIZE = 10
const EMBER_SPAWN_INTERVAL_MS = 90

export function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null)
  const emberLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!supportsCustomCursor || reduceMotion || !arrowRef.current || !emberLayerRef.current) {
      return
    }

    document.body.classList.add('has-custom-cursor')

    const arrow = arrowRef.current
    const emberLayer = emberLayerRef.current

    const embers = Array.from({ length: EMBER_POOL_SIZE }, () => {
      const ember = document.createElement('span')
      ember.className = 'custom-cursor__ember'
      emberLayer.appendChild(ember)
      return ember
    })

    let emberCursor = 0
    let lastSpawnAt = 0

    const setArrowX = gsap.quickTo(arrow, 'x', { duration: 0.12, ease: 'power3.out' })
    const setArrowY = gsap.quickTo(arrow, 'y', { duration: 0.12, ease: 'power3.out' })

    const spawnEmber = (x: number, y: number) => {
      const ember = embers[emberCursor]
      emberCursor = (emberCursor + 1) % embers.length

      const drift = gsap.utils.random(-18, 18)
      const rise = gsap.utils.random(30, 60)
      const size = gsap.utils.random(2, 4)

      gsap.killTweensOf(ember)
      gsap.set(ember, {
        x: x + gsap.utils.random(-4, 4),
        y: y + gsap.utils.random(-4, 4),
        width: size,
        height: size,
        opacity: 1,
        scale: 1,
      })
      gsap.to(ember, {
        x: `+=${drift}`,
        y: `-=${rise}`,
        opacity: 0,
        scale: 0.3,
        duration: gsap.utils.random(0.6, 1),
        ease: 'power2.out',
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      arrow.classList.remove('is-hidden')
      emberLayer.classList.remove('is-hidden')
      setArrowX(event.clientX)
      setArrowY(event.clientY)

      const now = performance.now()
      if (now - lastSpawnAt >= EMBER_SPAWN_INTERVAL_MS) {
        lastSpawnAt = now
        spawnEmber(event.clientX, event.clientY)
      }
    }

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      // Un élément inerte (bouton grisé) prime sur l'état interactif : la flèche
      // passe en curseur "interdit" plutôt que de grossir comme un lien actif.
      if (target?.closest(DISABLED_SELECTOR)) {
        arrow.classList.add('is-disabled')
        arrow.classList.remove('is-hovering')
      } else if (target?.closest(INTERACTIVE_SELECTOR)) {
        arrow.classList.add('is-hovering')
      }
    }

    const handlePointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      const related = event.relatedTarget as HTMLElement | null
      if (target?.closest(DISABLED_SELECTOR) && !related?.closest(DISABLED_SELECTOR)) {
        arrow.classList.remove('is-disabled')
      }
      if (target?.closest(INTERACTIVE_SELECTOR) && !related?.closest(INTERACTIVE_SELECTOR)) {
        arrow.classList.remove('is-hovering')
      }
    }

    const handlePointerDown = () => {
      arrow.classList.add('is-pressing')
    }

    const handlePointerUp = () => {
      arrow.classList.remove('is-pressing')
    }

    const handlePointerLeaveWindow = () => {
      arrow.classList.add('is-hidden')
      emberLayer.classList.add('is-hidden')
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerover', handlePointerOver)
    window.addEventListener('pointerout', handlePointerOut)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('mouseleave', handlePointerLeaveWindow)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('mouseleave', handlePointerLeaveWindow)
      embers.forEach((ember) => {
        gsap.killTweensOf(ember)
        ember.remove()
      })
    }
  }, [])

  return (
    <div
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[200] h-0 w-0"
      aria-hidden="true"
    >
      <div
        ref={emberLayerRef}
        className="custom-cursor__ember-layer is-hidden fixed left-0 top-0 h-0 w-0"
      />
      <div
        ref={arrowRef}
        className="custom-cursor__arrow is-hidden pointer-events-none fixed left-0 top-0 opacity-100"
      >
        <div className="custom-cursor__arrow-inner h-[26px] w-[26px]">
          <svg
            className="block h-full w-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 2L21 12.5L12.7 14L9.5 22L3 2Z"
              fill="url(#cursor-gold-gradient)"
              style={{ stroke: 'var(--gold-dark)' }}
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="cursor-gold-gradient"
                x1="3"
                y1="2"
                x2="21"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" style={{ stopColor: 'var(--gold-light)' }} />
                <stop offset="55%" style={{ stopColor: 'var(--gold-light)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--gold)' }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
