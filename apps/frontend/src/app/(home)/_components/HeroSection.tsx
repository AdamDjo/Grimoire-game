'use client'

import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'
import { Section } from '@/components/ui/Section'
import { HERO_IMG, fadeUp } from '@/lib/home-data'

export function HeroSection() {
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
            'linear-gradient(90deg, var(--bg-overlay-15) 0%, var(--bg-overlay-25) 35%, var(--bg-overlay-70) 60%, var(--bg-overlay-92) 100%)',
        }}
      />
      {/* Overlay vertical */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, var(--bg-overlay-55) 0%, transparent 18%, transparent 68%, var(--bg-overlay-95) 100%)',
        }}
      />

      {/* Overlay mobile — assombrir davantage pour lisibilité */}
      <div
        className="md:hidden"
        style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay-50)' }}
      />

      {/* Content — mobile : centré, desktop : colonne droite */}
      <div
        className="relative z-[2] w-full px-6 md:px-[60px] flex flex-col items-center text-center md:grid md:items-center md:text-left"
        style={{
          maxWidth: 1400,
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* Spacer desktop (colonne gauche vide) */}
        <div className="hidden md:block" />

        <div className="flex flex-col items-center md:items-start">
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
            className="text-disp-sm"
            style={{ marginBottom: 14 }}
          >
            Un monde. Des âmes. Une infinité de rôles.
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-gradient-gold font-display font-bold"
            style={{
              fontSize: 'clamp(32px, 7vw, 72px)',
              letterSpacing: '0.06em',
              lineHeight: 1.05,
              margin: '0 0 20px',
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
            className="text-serif-md"
            style={{ marginBottom: 36, maxWidth: 500 }}
          >
            Plongez dans un univers riche en intrigues, en mystères et en possibilités. Rejoignez
            une communauté de rôlistes passionnés et écrivez votre propre destin.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Button variant="primary" style={{ fontSize: 13, letterSpacing: '0.22em' }}>
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
        <span className="text-disp-xs" style={{ color: 'var(--gold-50)' }}>
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
            background: 'linear-gradient(180deg, var(--gold-50), transparent)',
          }}
        />
      </motion.div>
    </Section>
  )
}
