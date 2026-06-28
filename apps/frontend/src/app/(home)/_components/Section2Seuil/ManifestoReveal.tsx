'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { MANIFESTO_LINES } from '../../_data/home-data'

/**
 * ManifestoReveal — manifeste, reveal mot par mot façon incantation.
 *
 * Le parent (Section2Seuil) anime la card entière (montée + blur) via GSAP scrub.
 * Ici, on ajoute une couche : chaque mot apparaît avec stagger 50ms
 * (y:24 → 0, blur(8px) → 0, opacity 0 → 1) au moment où le bloc entre en viewport.
 *
 * En reduced-motion : tous les mots visibles d'emblée.
 */
export function ManifestoReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || reduce) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduce])

  // Stagger global croissant (ligne 1 → ligne 2 → ligne 3), avec stagger interne par mot.
  let wordIndex = 0

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center text-center"
      style={{ gap: 'clamp(8px, 1.5vw, 18px)' }}
    >
      {MANIFESTO_LINES.map((line) => {
        const words = line.split(' ')
        return (
          <p
            key={line}
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(28px, 5vw, 56px)',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
            }}
          >
            {words.map((word, i) => {
              const delay = 0.15 + wordIndex * 0.1
              wordIndex += 1
              return (
                <motion.span
                  key={`${line}-${i}`}
                  initial={
                    reduce
                      ? false
                      : { opacity: 0, filter: 'blur(16px)', letterSpacing: '0.4em', y: 8 }
                  }
                  animate={
                    inView
                      ? { opacity: 1, filter: 'blur(0px)', letterSpacing: '0.06em', y: 0 }
                      : { opacity: 0, filter: 'blur(16px)', letterSpacing: '0.4em', y: 8 }
                  }
                  transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                  style={{
                    backgroundImage: 'var(--gradient-heading)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginRight: i < words.length - 1 ? '0.28em' : 0,
                  }}
                >
                  {word}
                </motion.span>
              )
            })}
          </p>
        )
      })}
    </div>
  )
}
