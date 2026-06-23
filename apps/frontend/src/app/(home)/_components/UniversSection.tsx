'use client'

import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'
import { Heading } from '@/components/ui/Heading'
import { MapAtmosphere } from '@/components/ui/MapAtmosphere'
import { Section } from '@/components/ui/Section'
import { MAP_IMG, MAP_LABELS, UNIVERS_PILLS, fadeUp } from '@/lib/home-data'

import { UniversPill } from './UniversPill'

export function UniversSection() {
  return (
    <Section
      id="univers"
      snap
      aria-label="L'Univers"
      style={{ display: 'flex', overflow: 'hidden' }}
    >
      {/* Map background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src={MAP_IMG}
          alt="Carte de Valorain"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.55) saturate(0.7) sepia(30%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(8,6,4,0.96) 0%, rgba(8,6,4,0.88) 30%, rgba(8,6,4,0.45) 48%, rgba(8,6,4,0.08) 68%, rgba(8,6,4,0.0) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(8,6,4,0.6) 0%, transparent 15%, transparent 80%, rgba(8,6,4,0.8) 100%)',
          }}
        />
      </div>

      <MapAtmosphere />

      {/* Region labels */}
      {MAP_LABELS.map(({ label, ...pos }) => (
        <div
          key={label}
          style={{
            position: 'absolute',
            zIndex: 2,
            fontFamily: 'var(--font-disp)',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'rgba(224,196,137,0.85)',
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            textTransform: 'uppercase',
            ...pos,
          }}
        >
          {label}
        </div>
      ))}

      {/* Compass top-right */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          right: 48,
          zIndex: 3,
          opacity: 0.7,
        }}
      >
        <CompassRose size={52} />
      </div>

      {/* Left content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '46%',
          minWidth: 420,
          padding: '0 0 0 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p
            style={{
              fontFamily: 'var(--font-disp)',
              fontSize: 9,
              letterSpacing: '0.32em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Chapitre I
          </p>

          <Heading title="L'Univers" />

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              lineHeight: 1.9,
              color: 'var(--ink-2)',
              marginBottom: 36,
              maxWidth: 400,
            }}
          >
            Un monde lacéré par les dieux, déchiré par les guerres, et régi par des forces qui ont
            su se faire réellement comprendre. Découvrez les continents, les peuples,
            l&apos;histoire et les secrets qui composent notre univers.
          </p>

          <Button variant="secondary" style={{ marginBottom: 52, alignSelf: 'flex-start' }}>
            Explorer le Monde
          </Button>

          <div style={{ display: 'flex', gap: 16 }}>
            {UNIVERS_PILLS.map(({ icon: Icon, label }) => (
              <UniversPill key={label} icon={<Icon size={18} />} label={label} />
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
