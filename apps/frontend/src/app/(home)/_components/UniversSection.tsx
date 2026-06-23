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
              'linear-gradient(90deg, var(--bg-overlay-97) 0%, var(--bg-overlay-92) 30%, var(--bg-overlay-50) 48%, var(--bg-overlay-15) 68%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, var(--bg-overlay-50) 0%, transparent 15%, transparent 80%, var(--bg-overlay-70) 100%)',
          }}
        />
        {/* Mobile extra overlay for readability */}
        <div
          className="md:hidden"
          style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay-55)' }}
        />
      </div>

      <MapAtmosphere />

      {/* Region labels — hidden on mobile */}
      {MAP_LABELS.map(({ label, ...pos }) => (
        <div
          key={label}
          className="hidden lg:block text-disp-xs"
          style={{
            position: 'absolute',
            zIndex: 2,
            color: 'rgba(224,196,137,0.85)',
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            ...pos,
          }}
        >
          {label}
        </div>
      ))}

      {/* Compass — hidden on mobile */}
      <div className="hidden md:block absolute z-[3] opacity-70" style={{ top: 90, right: 48 }}>
        <CompassRose size={52} />
      </div>

      {/* Left content */}
      <div
        className="relative z-[3] flex flex-col justify-center h-full w-full px-6 md:px-20"
        style={{ maxWidth: 560 }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-disp-sm" style={{ marginBottom: 10 }}>
            Chapitre I
          </p>

          <Heading title="L'Univers" />

          <p className="text-serif-md" style={{ marginBottom: 36, maxWidth: 400 }}>
            Un monde lacéré par les dieux, déchiré par les guerres, et régi par des forces qui ont
            su se faire réellement comprendre. Découvrez les continents, les peuples,
            l&apos;histoire et les secrets qui composent notre univers.
          </p>

          <Button variant="secondary" style={{ marginBottom: 52, alignSelf: 'flex-start' }}>
            Explorer le Monde
          </Button>

          <div className="flex flex-wrap gap-3 md:gap-4">
            {UNIVERS_PILLS.map(({ icon: Icon, label }) => (
              <UniversPill key={label} icon={<Icon size={18} />} label={label} />
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
