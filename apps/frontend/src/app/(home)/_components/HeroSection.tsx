'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'
import { Section } from '@/components/ui/Section'
import { HERO_IMG, generateParticles, fadeUp } from '@/lib/home-data'

export function HeroSection() {
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([])
  useEffect(() => {
    setParticles(generateParticles())
  }, [])
  return (
    <Section
      id="hero"
      snap
      aria-label="Accueil"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={HERO_IMG}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.18)',
          width: '100vw',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
        }}
      >
        <source src="/illustration-hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay horizontal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(5,5,6,0.15) 0%, rgba(5,5,6,0.25) 35%, rgba(5,5,6,0.70) 60%, rgba(5,5,6,0.92) 100%)',
        }}
      />
      {/* Overlay vertical */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(5,5,6,0.55) 0%, transparent 18%, transparent 68%, rgba(5,5,6,0.95) 100%)',
        }}
      />

      {/* Floating gold particles */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
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

      {/* Content grid */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1400,
          padding: '0 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
        }}
      >
        <div />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ marginBottom: 20 }}
          >
            <CompassRose size={36} />
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            style={{
              fontFamily: 'var(--font-disp)',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'var(--gold)',
              marginBottom: 14,
              textTransform: 'uppercase',
            }}
          >
            Un monde. Des âmes. Une infinité de rôles.
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            style={{
              fontFamily: 'var(--font-disp)',
              fontSize: 'clamp(40px, 4.5vw, 72px)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              lineHeight: 1.05,
              margin: '0 0 20px',
              background: 'linear-gradient(180deg, #f8eed8 0%, #e8d090 40%, #c4a468 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'pre-line',
            }}
          >
            {'ÉCRIS TON\nHISTOIRE'}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              lineHeight: 1.8,
              color: 'var(--ink-2)',
              marginBottom: 36,
              maxWidth: 420,
            }}
          >
            Plongez dans un univers riche en intrigues, en mystères et en possibilités. Rejoignez
            une communauté de rôlistes passionnés et écrivez votre propre destin.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Button variant="primary" style={{ fontSize: 11, letterSpacing: '0.22em' }}>
              Entrer dans l&apos;Univers
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll arrow */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-disp)',
            fontSize: 9,
            letterSpacing: '0.28em',
            color: 'rgba(196,164,104,0.5)',
            textTransform: 'uppercase',
          }}
        >
          Défiler
        </span>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M18 6 L18 30 M8 20 L18 30 L28 20"
            stroke="rgba(196,164,104,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            width: 1,
            height: 28,
            background: 'linear-gradient(180deg, rgba(196,164,104,0.6), transparent)',
          }}
        />
      </motion.div>
    </Section>
  )
}
