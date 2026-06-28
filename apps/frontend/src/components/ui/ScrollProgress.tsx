'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * ScrollProgress — fine ligne dorée fixée en haut, remplie selon scrollYProgress.
 *
 * - 1.5px doré (`--gold`) avec léger glow.
 * - `useSpring` pour adoucir le suivi du scroll (sinon trop nerveux).
 * - `role="progressbar"` + valeurs ARIA mises à jour à chaque changement.
 * - Masqué en `prefers-reduced-motion` (visuel uniquement, sans valeur fonctionnelle).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.3 })
  const ariaValue = useTransform(scrollYProgress, (v) => Math.round(v * 100))
  const [ariaNow, setAriaNow] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setHidden(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const unsub = ariaValue.on('change', (v) => setAriaNow(v))
    return () => unsub()
  }, [ariaValue])

  if (hidden) return null

  return (
    <motion.div
      role="progressbar"
      aria-label="Progression de lecture"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={ariaNow}
      className="fixed top-0 left-0 right-0 z-[55] h-[1.5px] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, transparent 0%, var(--gold) 35%, var(--gold-light) 70%, var(--gold) 100%)',
        boxShadow: '0 0 8px rgba(224, 196, 137, 0.55)',
      }}
    />
  )
}
