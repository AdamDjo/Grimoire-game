'use client'

import { useEffect, useRef, useState } from 'react'

interface Spark {
  id: number
  x: number
  y: number
  born: number
  dx: number
  dy: number
  size: number
}

const TRAIL_COUNT = 5
const SPARK_LIFETIME_MS = 700
const SPARK_INTERVAL_MS = 35

/**
 * GoldCursor — curseur custom avec dot doré, traînée fluide et étincelles dorées.
 *
 * - Dot principal : ~10px, gradient doré, mix-blend-screen pour briller.
 * - Traînée : 5 dots qui suivent en cascade (lerp décroissant).
 * - Étincelles : spawn tous les ~35ms, montent + fadent en 700ms.
 * - Désactivé sur reduced-motion + écrans tactiles (pas de hover fin).
 * - Cache le curseur natif uniquement quand actif.
 */
export function GoldCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const sparksContainerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: -100, y: -100 })
  const trailPosRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  )
  const sparksRef = useRef<Spark[]>([])
  const lastSparkRef = useRef(0)
  const sparkIdRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(!reduce && fineHover)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
    }

    const tick = (t: number) => {
      const { x, y } = targetRef.current

      // Dot principal — colle au curseur.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 6}px, ${y - 6}px, 0)`
      }

      // Traînée : chaque dot suit le précédent avec lerp décroissant.
      let prevX = x
      let prevY = y
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const pos = trailPosRef.current[i]
        const k = 0.35 - i * 0.05
        pos.x += (prevX - pos.x) * k
        pos.y += (prevY - pos.y) * k
        const el = trailRefs.current[i]
        if (el) {
          const size = 8 - i
          el.style.transform = `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`
        }
        prevX = pos.x
        prevY = pos.y
      }

      // Spawn étincelle.
      if (t - lastSparkRef.current > SPARK_INTERVAL_MS && sparksContainerRef.current) {
        lastSparkRef.current = t
        const id = ++sparkIdRef.current
        const spark: Spark = {
          id,
          x,
          y,
          born: t,
          dx: (Math.random() - 0.5) * 30,
          dy: -20 - Math.random() * 30,
          size: 1.5 + Math.random() * 2.5,
        }
        sparksRef.current.push(spark)

        const el = document.createElement('div')
        el.dataset.sparkId = String(id)
        el.style.cssText = `position:absolute;top:0;left:0;width:${spark.size}px;height:${spark.size}px;border-radius:9999px;background:radial-gradient(circle,#f4dca8 0%,#c4a468 60%,rgba(196,164,104,0) 100%);box-shadow:0 0 6px rgba(244,220,168,.8);will-change:transform,opacity;pointer-events:none;transform:translate3d(${x}px,${y}px,0)`
        sparksContainerRef.current.appendChild(el)
      }

      // Update + recycle étincelles.
      const alive: Spark[] = []
      for (const s of sparksRef.current) {
        const age = t - s.born
        if (age > SPARK_LIFETIME_MS) {
          const el = sparksContainerRef.current?.querySelector<HTMLDivElement>(
            `[data-spark-id="${s.id}"]`
          )
          el?.remove()
          continue
        }
        const p = age / SPARK_LIFETIME_MS
        const px = s.x + s.dx * p
        const py = s.y + s.dy * p
        const opacity = 1 - p
        const el = sparksContainerRef.current?.querySelector<HTMLDivElement>(
          `[data-spark-id="${s.id}"]`
        )
        if (el) {
          el.style.transform = `translate3d(${px}px, ${py}px, 0)`
          el.style.opacity = String(opacity)
        }
        alive.push(s)
      }
      sparksRef.current = alive

      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    // Cacher le curseur natif.
    const prevCursor = document.body.style.cursor
    document.body.style.cursor = 'none'
    const styleEl = document.createElement('style')
    styleEl.id = 'gold-cursor-style'
    styleEl.textContent = `* { cursor: none !important; }`
    document.head.appendChild(styleEl)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.style.cursor = prevCursor
      styleEl.remove()
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
      {/* Dot principal */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{
          width: 12,
          height: 12,
          borderRadius: 9999,
          background: 'radial-gradient(circle, #f4dca8 0%, #c4a468 55%, rgba(196,164,104,0) 100%)',
          boxShadow: '0 0 16px rgba(244,220,168,.85), 0 0 32px rgba(196,164,104,.5)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Traînée */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          className="absolute top-0 left-0 will-change-transform"
          style={{
            width: 8 - i,
            height: 8 - i,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(244,220,168,.9) 0%, rgba(196,164,104,0) 100%)',
            opacity: 0.55 - i * 0.08,
            mixBlendMode: 'screen',
          }}
        />
      ))}
      {/* Container étincelles (dom-managed pour perf) */}
      <div ref={sparksContainerRef} className="absolute inset-0" />
    </div>
  )
}
