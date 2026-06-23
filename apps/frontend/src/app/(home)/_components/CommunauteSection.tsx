'use client'

import { motion } from 'framer-motion'
import { Users, BookMarked, Zap, Sword, Eye, FlaskConical, Scroll } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { GlowCard } from '@/components/ui/GlowCard'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { StatItem } from '@/components/ui/StatItem'
import { GRIMOIRE_IMG, fadeUp } from '@/lib/home-data'

const FLOATING_ICONS = [Sword, Eye, FlaskConical, Scroll] as const

export function CommunauteSection() {
  return (
    <Section
      id="communaute"
      snap
      aria-label="La Communauté"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
        borderTop: '1px solid rgba(196,164,104,0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Heading title="Une Communauté" />
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              lineHeight: 1.85,
              color: 'var(--ink-2)',
              marginBottom: 32,
              maxWidth: 400,
            }}
          >
            Rejoins des centaines de rôlistes, participe à des intrigues, crée tes propres
            personnages et explore un monde sans limites. Ton histoire n&apos;attend que toi.
          </p>
          <Button variant="secondary" style={{ marginBottom: 48 }}>
            Rejoindre l&apos;Aventure
          </Button>
          <div style={{ display: 'flex', gap: 48 }}>
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
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'linear-gradient(160deg, #2c2217, #1a130c)',
                      border: '1px solid var(--gold-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 16px rgba(196,164,104,0.2)',
                    }}
                  >
                    <Icon size={18} color="var(--gold)" />
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ padding: '28px 28px 24px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-disp)',
                  fontSize: 17,
                  letterSpacing: '0.12em',
                  color: 'var(--gold-light)',
                  margin: '0 0 12px',
                  textTransform: 'uppercase',
                }}
              >
                L&apos;Artiste des Destins (IA)
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: 'var(--ink-2)',
                  marginBottom: 24,
                }}
              >
                Laisse l&apos;IA tisser ton récit.
                <br />
                Explore des scènes uniques avec des choix multiples pour façonner ton propre destin.
              </p>
              <Button
                variant="primary"
                style={{ width: '100%', fontSize: 11, letterSpacing: '0.22em' }}
              >
                Commencer mon aventure
              </Button>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </Section>
  )
}
