'use client'

import { useEffect, useRef } from 'react'

import { gsap } from '@/lib/gsap-init'

// Couche de braises ambiantes : ~24 particules dorées qui montent lentement en
// fond, indépendantes du curseur (distinct de CustomCursor qui, lui, émet des
// braises AU curseur). Canvas fixe plein écran, piloté par gsap.ticker (un seul
// RAF partagé avec ScrollTrigger). Désactivée sur mobile/coarse et en
// reduced-motion. Aucun Math.random rendu côté serveur : tout est généré dans
// l'effet client (règle SSR hydration).
const EMBER_COUNT = 18
const TARGET_FRAME_INTERVAL = 1 / 30
const MAX_PIXEL_RATIO = 1.5
const RISE_MIN = 12 // px/s
const RISE_MAX = 30

interface Ember {
  x: number
  y: number
  radius: number
  rise: number
  drift: number
  driftPhase: number
  driftSpeed: number
  baseAlpha: number
  flickerPhase: number
  flickerSpeed: number
}

export function AmbientEmbers() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const isMobile = window.matchMedia('(max-width: 720px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current

    if (isCoarse || isMobile || reduceMotion || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    let width = 0
    let height = 0
    let dpr = 1

    const random = (min: number, max: number) => min + Math.random() * (max - min)

    const spawn = (ember: Ember, fromBottom: boolean) => {
      ember.x = random(0, width)
      ember.y = fromBottom ? height + random(0, 40) : random(0, height)
      ember.radius = random(0.6, 1.9)
      ember.rise = random(RISE_MIN, RISE_MAX)
      ember.drift = random(6, 20)
      ember.driftPhase = random(0, Math.PI * 2)
      ember.driftSpeed = random(0.2, 0.6)
      ember.baseAlpha = random(0.18, 0.5)
      ember.flickerPhase = random(0, Math.PI * 2)
      ember.flickerSpeed = random(1.4, 3.2)
    }

    const embers: Ember[] = Array.from({ length: EMBER_COUNT }, () => {
      const ember = {} as Ember
      spawn(ember, false)
      return ember
    })

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    let lastTime = gsap.ticker.time
    let accumulatedTime = 0

    const tick = () => {
      const now = gsap.ticker.time
      const delta = Math.min(now - lastTime, 0.05)
      lastTime = now

      if (document.hidden) {
        accumulatedTime = 0
        return
      }

      accumulatedTime += delta

      if (accumulatedTime < TARGET_FRAME_INTERVAL) return

      const frameDelta = accumulatedTime
      accumulatedTime = 0

      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'lighter'

      for (const ember of embers) {
        ember.y -= ember.rise * frameDelta
        ember.driftPhase += ember.driftSpeed * frameDelta
        ember.flickerPhase += ember.flickerSpeed * frameDelta

        if (ember.y + ember.radius < -20) {
          spawn(ember, true)
          continue
        }

        const x = ember.x + Math.sin(ember.driftPhase) * ember.drift
        // Estompe en haut et en bas de l'écran pour une entrée/sortie douce.
        const edgeFade = Math.min(1, ember.y / 120, (height - ember.y) / 120)
        const flicker = 0.7 + 0.3 * Math.sin(ember.flickerPhase)
        const alpha = ember.baseAlpha * flicker * Math.max(0, edgeFade)

        if (alpha <= 0.001) {
          continue
        }

        const glow = context.createRadialGradient(x, ember.y, 0, x, ember.y, ember.radius * 4)
        glow.addColorStop(0, `rgba(240, 212, 138, ${alpha})`)
        glow.addColorStop(0.4, `rgba(217, 164, 65, ${alpha * 0.5})`)
        glow.addColorStop(1, 'rgba(217, 164, 65, 0)')

        context.beginPath()
        context.fillStyle = glow
        context.arc(x, ember.y, ember.radius * 4, 0, Math.PI * 2)
        context.fill()
      }

      context.globalCompositeOperation = 'source-over'
    }

    gsap.ticker.add(tick)
    window.addEventListener('resize', resize)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="ambient-embers pointer-events-none fixed inset-0 z-[55] h-full w-full"
      aria-hidden="true"
    />
  )
}
