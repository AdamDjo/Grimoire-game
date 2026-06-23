'use client'

import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { OrnamentBorder } from '@/components/ui/OrnamentBorder'
import { Section } from '@/components/ui/Section'
import { PORTRAITS, ROLES, fadeUp } from '@/lib/home-data'

import { PortraitCard } from './PortraitCard'
import { RoleRow } from './RoleRow'

export function PersonnageSection({
  selectedPortrait,
  onSelectPortrait,
}: {
  selectedPortrait: number
  onSelectPortrait: (id: number) => void
}) {
  return (
    <Section
      id="personnage"
      snap
      aria-label="Créer ton personnage"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
        borderTop: '1px solid rgba(196,164,104,0.08)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'start',
            marginBottom: 56,
          }}
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Heading title="Crée ton Personnage" />
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 15,
                lineHeight: 1.85,
                color: 'var(--ink-2)',
                marginBottom: 28,
                maxWidth: 400,
              }}
            >
              Choisis ton peuple, les magies, les remplumes et élève ton histoire. Chaque être avec
              son propre parcours et rôle au sein de ce monde...
            </p>
            <Button variant="secondary">Voir les possibilités</Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <OrnamentBorder style={{ padding: '24px 28px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-disp)',
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  color: 'var(--gold)',
                  marginBottom: 20,
                  textTransform: 'uppercase',
                }}
              >
                Exemples de rôles
              </p>
              {ROLES.map(({ icon: Icon, label }) => (
                <RoleRow key={label} icon={<Icon size={14} />} label={label} />
              ))}
            </OrnamentBorder>
          </motion.div>
        </div>

        {/* Row 1 — 5 portraits */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 10,
            marginBottom: 10,
          }}
        >
          {PORTRAITS.slice(0, 5).map((p) => (
            <PortraitCard
              key={p.id}
              portrait={p}
              selected={selectedPortrait === p.id}
              onClick={() => onSelectPortrait(p.id)}
            />
          ))}
        </div>

        {/* Row 2 — 3 portraits centered */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          <div />
          {PORTRAITS.slice(5, 8).map((p) => (
            <PortraitCard
              key={p.id}
              portrait={p}
              selected={selectedPortrait === p.id}
              onClick={() => onSelectPortrait(p.id)}
            />
          ))}
          <div />
        </div>
      </div>
    </Section>
  )
}
