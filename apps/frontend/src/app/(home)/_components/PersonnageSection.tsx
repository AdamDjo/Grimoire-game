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
        borderTop: '1px solid var(--gold-08)',
        overflow: 'hidden',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-20 py-8 md:py-0">
        {/* Header grid : texte + rôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start mb-10 md:mb-14">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Heading title="Crée ton Personnage" />
            <p className="text-serif-md" style={{ marginBottom: 28, maxWidth: 400 }}>
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
              <p className="text-disp-sm" style={{ marginBottom: 20 }}>
                Exemples de rôles
              </p>
              {ROLES.map(({ icon: Icon, label }) => (
                <RoleRow key={label} icon={<Icon size={14} />} label={label} />
              ))}
            </OrnamentBorder>
          </motion.div>
        </div>

        {/* Row 1 — 5 portraits sur desktop, 2 sur mobile, 3 sur tablet */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-2.5">
          {PORTRAITS.slice(0, 5).map((p) => (
            <PortraitCard
              key={p.id}
              portrait={p}
              selected={selectedPortrait === p.id}
              onClick={() => onSelectPortrait(p.id)}
            />
          ))}
        </div>

        {/* Row 2 — 3 portraits centrés sur desktop, inline sur mobile */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-2.5">
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

        {/* Row 2 mobile/tablet — portraits 5-7 inline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 lg:hidden">
          {PORTRAITS.slice(5, 8).map((p) => (
            <PortraitCard
              key={p.id}
              portrait={p}
              selected={selectedPortrait === p.id}
              onClick={() => onSelectPortrait(p.id)}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
