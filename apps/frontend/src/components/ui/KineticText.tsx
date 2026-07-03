'use client'

import { SplitText } from 'gsap/SplitText'
import { useRef, type CSSProperties, type ElementType } from 'react'

import { gsap, useGSAP } from '@/lib/gsap-init'

interface KineticTextProps {
  text: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** Déclenche l'animation au scroll (par défaut : centre viewport). */
  trigger?: 'scroll' | 'mount'
  /** Position ScrollTrigger.start si trigger='scroll'. */
  start?: string
  /** Durée de la révélation. */
  duration?: number
  /** Décalage char-by-char. */
  stagger?: number
}

/**
 * KineticText — révélation caractère par caractère type Cuberto/Levora.
 *
 * Utilise SplitText (gratuit depuis GSAP 3.13). Chaque char entre avec
 * clip-path bas→haut + blur 12→0 + stagger. `aria-label` porte le texte
 * complet pour l'accessibilité.
 *
 * Fallback `prefers-reduced-motion` : le texte s'affiche instantanément
 * dans son état final.
 */
export function KineticText({
  text,
  as: Tag = 'span',
  className,
  style,
  trigger = 'scroll',
  start = 'top 75%',
  duration = 0.9,
  stagger = 0.02,
}: KineticTextProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText)
      if (!ref.current) return

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        gsap.set(ref.current, { opacity: 1, filter: 'blur(0px)' })
        return
      }

      const split = new SplitText(ref.current, { type: 'chars,words' })

      gsap.set(split.chars, {
        yPercent: 100,
        opacity: 0,
        filter: 'blur(12px)',
      })

      const tween = gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration,
        stagger,
        ease: 'power3.out',
        ...(trigger === 'scroll'
          ? {
              scrollTrigger: {
                trigger: ref.current,
                start,
                toggleActions: 'play none none reverse',
              },
            }
          : {}),
      })

      return () => {
        tween.kill()
        split.revert()
      }
    },
    { scope: ref, dependencies: [text] }
  )

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={className}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        ...style,
      }}
    >
      {text}
    </Tag>
  )
}
