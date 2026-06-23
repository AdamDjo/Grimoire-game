'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

import { generateParticles } from '@/lib/home-data'

export function LandingAmbiance() {
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([])
  useEffect(() => {
    setParticles(generateParticles())
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff8d0 0%, #e8c840 50%, #c4a020 100%)',
            boxShadow: `0 0 ${p.size * 4}px rgba(240,210,80,0.9), 0 0 ${p.size * 8}px rgba(196,164,60,0.5)`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.5],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
