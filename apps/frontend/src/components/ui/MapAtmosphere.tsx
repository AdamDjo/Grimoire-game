'use client'

import { motion } from 'framer-motion'

/* Volutes de brume — partent déjà en milieu d'écran pour être immédiatement visibles */
const MIST_LAYERS = [
  {
    y: '12%',
    w: 1000,
    h: 130,
    blur: 35,
    opacity: 0.45,
    dur: 22,
    delay: 0,
    fromX: '-20%',
    toX: '110%',
  },
  {
    y: '32%',
    w: 1200,
    h: 100,
    blur: 28,
    opacity: 0.38,
    dur: 28,
    delay: 4,
    fromX: '-30%',
    toX: '115%',
  },
  {
    y: '50%',
    w: 900,
    h: 150,
    blur: 40,
    opacity: 0.5,
    dur: 18,
    delay: 2,
    fromX: '-10%',
    toX: '110%',
  },
  {
    y: '65%',
    w: 1100,
    h: 90,
    blur: 25,
    opacity: 0.35,
    dur: 32,
    delay: 8,
    fromX: '-25%',
    toX: '112%',
  },
  {
    y: '78%',
    w: 800,
    h: 120,
    blur: 32,
    opacity: 0.42,
    dur: 24,
    delay: 6,
    fromX: '-15%',
    toX: '110%',
  },
  {
    y: '22%',
    w: 750,
    h: 110,
    blur: 30,
    opacity: 0.3,
    dur: 36,
    delay: 12,
    fromX: '-35%',
    toX: '115%',
  },
  {
    y: '88%',
    w: 950,
    h: 80,
    blur: 22,
    opacity: 0.28,
    dur: 26,
    delay: 3,
    fromX: '-20%',
    toX: '110%',
  },
]

/* Particules de poussière dorée */
const DUST = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 30 + (i / 22) * 65,
  y: 5 + ((i * 37) % 88),
  size: 1.2 + (i % 3) * 0.8,
  dur: 5 + (i % 5) * 2.5,
  delay: (i * 0.6) % 10,
  driftX: ((i % 5) - 2) * 25,
  driftY: -(15 + (i % 4) * 18),
  opacity: 0.45 + (i % 3) * 0.18,
}))

export function MapAtmosphere() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Volutes de brume traversantes */}
      {MIST_LAYERS.map((m, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: m.y,
            width: m.w,
            height: m.h,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(220,215,210,0.65) 0%, rgba(180,175,170,0.35) 40%, rgba(140,135,130,0.12) 70%, transparent 100%)',
            filter: `blur(${m.blur}px)`,
          }}
          initial={{ x: m.fromX, opacity: 0 }}
          animate={{
            x: [m.fromX, m.toX],
            opacity: [0, m.opacity, m.opacity, 0],
          }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.08, 0.92, 1],
          }}
        />
      ))}

      {/* Poussière dorée flottante */}
      {DUST.map((d) => (
        <motion.div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff8c0 0%, #e8c840 50%, #c09020 100%)',
            boxShadow: `0 0 ${d.size * 4}px rgba(240,200,60,0.8)`,
          }}
          animate={{
            x: [0, d.driftX, d.driftX * 0.5],
            y: [0, d.driftY],
            opacity: [0, d.opacity, d.opacity * 0.5, 0],
            scale: [0.4, 1.2, 0.6, 0],
          }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Lumière mystérieuse qui pulse sur la carte */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          left: '55%',
          width: 400,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(210,175,90,0.18) 0%, rgba(180,140,60,0.08) 50%, transparent 75%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.3, 0.9, 1.15, 1],
          opacity: [0.5, 1, 0.6, 0.9, 0.5],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Second foyer de lumière */}
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '75%',
          width: 280,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(180,140,80,0.15) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
        animate={{
          scale: [1, 1.2, 0.85, 1],
          opacity: [0.4, 0.8, 0.3, 0.4],
        }}
        transition={{ duration: 5, delay: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
