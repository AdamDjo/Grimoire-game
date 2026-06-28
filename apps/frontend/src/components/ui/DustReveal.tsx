'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface DustRevealProps {
  text: string
  /** Délai global avant le démarrage (s). Défaut 0.2. */
  startDelay?: number
  /** Stagger entre les mots (s). Défaut 0.09 (lent, brumeux). */
  wordStagger?: number
  /** Durée d'apparition d'un mot (s). Défaut 1.4 (long pour effet brume). */
  duration?: number
  /** Threshold IntersectionObserver. Défaut 0.35. */
  threshold?: number
  /** Wrapper avec guillemets français : « text ». */
  withQuotes?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * DustReveal — texte qui se condense depuis la brume, mot par mot.
 *
 * Chaque mot émerge de :
 *   - filter blur(14px) → blur(0px)   (brume qui se dissipe)
 *   - opacity 0 → 1
 *   - letter-spacing 0.4em → normal   (particules de poussière qui convergent)
 *   - y +6 → 0                        (légère élévation, comme une cendre qui se pose)
 *
 * Ease : `[0.16, 1, 0.3, 1]` (out-expo) — démarrage doux, fin nette.
 *
 * En reduced-motion : tout est visible d'emblée.
 * Accessible : `aria-label` porte la phrase complète, les spans sont aria-hidden.
 */
export function DustReveal({
  text,
  startDelay = 0.2,
  wordStagger = 0.09,
  duration = 1.4,
  threshold = 0.35,
  withQuotes = false,
  className,
  style,
}: DustRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (reduce) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduce, threshold])

  const words = text.split(' ')
  const ariaText = withQuotes ? `« ${text} »` : text

  return (
    <span ref={ref} className={className} style={style} aria-label={ariaText}>
      <span aria-hidden="true">
        {withQuotes && '« '}
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={
              reduce ? false : { opacity: 0, filter: 'blur(14px)', letterSpacing: '0.4em', y: 6 }
            }
            animate={
              inView
                ? { opacity: 1, filter: 'blur(0px)', letterSpacing: '0em', y: 0 }
                : { opacity: 0, filter: 'blur(14px)', letterSpacing: '0.4em', y: 6 }
            }
            transition={{
              duration,
              delay: startDelay + i * wordStagger,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
            style={{ marginRight: i < words.length - 1 ? '0.28em' : 0 }}
          >
            {word}
          </motion.span>
        ))}
        {withQuotes && ' »'}
      </span>
    </span>
  )
}
