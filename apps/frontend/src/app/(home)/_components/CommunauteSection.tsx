'use client'

import { motion } from 'framer-motion'
import { Users, BookMarked, Zap, Sword, Eye, FlaskConical, Scroll } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { GlowCard } from '@/components/ui/GlowCard'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { StatItem } from '@/components/ui/StatItem'
import { GRIMOIRE_IMG, fadeUp } from '@/lib/home-data'

import { FooterSection } from './FooterSection'

const FLOATING_ICONS = [Sword, Eye, FlaskConical, Scroll] as const

export function CommunauteSection() {
  return (
    <Section
      id="communaute"
      snap
      aria-label="La Communauté"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--gold-08)',
        overflow: 'hidden',
        paddingTop: 'clamp(40px, 6vh, 80px)',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Heading title="Une Communauté" />
          <p className="text-serif-md" style={{ marginBottom: 32, maxWidth: 400 }}>
            Rejoins des centaines de rôlistes, participe à des intrigues, crée tes propres
            personnages et explore un monde sans limites. Ton histoire n&apos;attend que toi.
          </p>
          <Button variant="secondary" style={{ marginBottom: 48 }}>
            Rejoindre l&apos;Aventure
          </Button>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <StatItem
              icon={<Users size={20} />}
              iconLabel="Membres"
              value="1 324"
              label="Membres"
            />
            <StatItem
              icon={<BookMarked size={20} />}
              iconLabel="RPG en cours"
              value="287"
              label="RPG en cours"
            />
            <StatItem
              icon={<Zap size={20} />}
              iconLabel="Possibilités infinies"
              value="∞"
              label="Possibilités"
            />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          <GlowCard style={{ padding: 0, overflow: 'hidden' }} glowColor="rgba(196,164,104,0.3)">
            <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
              <img
                src={GRIMOIRE_IMG}
                alt="Grimoire"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.4) sepia(30%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                }}
              >
                {FLOATING_ICONS.map((Icon, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 2.5,
                      delay: i * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="bg-surface-warm"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: '1px solid var(--gold-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 16px var(--gold-20)',
                    }}
                  >
                    <Icon size={18} color="var(--gold)" />
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ padding: '28px 28px 24px' }}>
              <h3 className="text-disp-md text-gold-light" style={{ margin: '0 0 12px' }}>
                L&apos;Artiste des Destins (IA)
              </h3>
              <p className="text-serif-sm" style={{ marginBottom: 24 }}>
                Laisse l&apos;IA tisser ton récit.
                <br />
                Explore des scènes uniques avec des choix multiples pour façonner ton propre destin.
              </p>
              <Button
                variant="primary"
                style={{ width: '100%', fontSize: 13, letterSpacing: '0.22em' }}
              >
                Commencer mon aventure
              </Button>
            </div>
          </GlowCard>
        </motion.div>
      </div>

      <div style={{ marginTop: 'clamp(32px, 4vh, 56px)' }}>
        <FooterSection />
      </div>
    </Section>
  )
}
