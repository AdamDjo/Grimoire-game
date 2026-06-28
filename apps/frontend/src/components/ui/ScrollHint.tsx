'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

interface ScrollHintProps {
  label?: string
}

/**
 * ScrollHint — indice de scroll diégétique.
 *
 * Une plume dorée tombe en boucle vers le bas avec une dérive latérale
 * sinusoïdale + légère rotation, comme portée par un courant d'air d'auberge.
 * Le label discret (text-disp-xs) reste sous la plume.
 *
 * L'enveloppe externe (fixed bottom + ref) est inchangée → useCanvasScrollSequence
 * pilote toujours opacity/y de l'élément racine.
 */
export const ScrollHint = forwardRef<HTMLDivElement, ScrollHintProps>(function ScrollHint(
  { label = 'Défiler' },
  ref
) {
  return (
    <div ref={ref} className="fixed left-0 right-0 z-10 flex justify-center" style={{ bottom: 48 }}>
      <div className="flex flex-col items-center gap-3">
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            width: 44,
            height: 84,
            overflow: 'hidden',
            filter:
              'drop-shadow(0 0 6px rgba(224, 196, 137, 0.55)) drop-shadow(0 0 14px rgba(196, 100, 40, 0.32))',
          }}
        >
          <motion.div
            style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -16 }}
            initial={{ y: -22, x: -4, rotate: -14, opacity: 0 }}
            animate={{
              y: [-22, 14, 46, 84],
              x: [-4, 4, -3, 3],
              rotate: [-14, 8, -6, 4],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.25, 0.7, 1],
            }}
          >
            <Feather />
          </motion.div>
        </div>

        <span
          className="text-disp-xs"
          style={{
            color: 'var(--gold-light)',
            textShadow: '0 0 14px rgba(224,196,137,0.55), 0 2px 8px rgba(0,0,0,0.8)',
            letterSpacing: '0.32em',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
})

function Feather() {
  return (
    <svg width="32" height="44" viewBox="0 0 20 28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="feather-gold" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#f4dca8" stopOpacity="1" />
          <stop offset="55%" stopColor="#e0c489" stopOpacity="1" />
          <stop offset="100%" stopColor="#c4a468" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Tige */}
      <path
        d="M10 1 C 10.4 8, 10.6 16, 10.2 26"
        stroke="url(#feather-gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Barbes gauches */}
      <path
        d="M10 4 C 6 5.5, 4 8, 4.5 11
           M10 8 C 5.5 10, 3.5 13, 4 16
           M10 12 C 6 14, 4.5 17, 5 20
           M10 16 C 7 18, 6 21, 6.5 23"
        stroke="url(#feather-gold)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Barbes droites */}
      <path
        d="M10 4 C 14 5.5, 16 8, 15.5 11
           M10 8 C 14.5 10, 16.5 13, 16 16
           M10 12 C 14 14, 15.5 17, 15 20
           M10 16 C 13 18, 14 21, 13.5 23"
        stroke="url(#feather-gold)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
