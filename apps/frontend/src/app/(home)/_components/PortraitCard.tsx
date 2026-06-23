'use client'

import { motion } from 'framer-motion'

import { GlowCard } from '@/components/ui/GlowCard'

interface Portrait {
  id: number
  role: string
  img: string
}

export function PortraitCard({
  portrait,
  selected,
  onClick,
}: {
  portrait: Portrait
  selected: boolean
  onClick: () => void
}) {
  return (
    <GlowCard
      selected={selected}
      onClick={onClick}
      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
      glowColor="rgba(212,175,55,0.5)"
    >
      <div style={{ position: 'relative', aspectRatio: '3/4' }}>
        <img
          src={portrait.img}
          alt={portrait.role}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: selected ? 'brightness(0.95)' : 'brightness(0.55) grayscale(20%)',
            transition: 'filter .3s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 8px 8px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.88))',
          }}
        >
          <p
            className="text-disp-xs text-center m-0 transition-colors duration-300"
            style={{ color: selected ? 'var(--gold-light)' : 'var(--ink-3)' }}
          >
            {portrait.role}
          </p>
        </div>
        {selected && (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: -1,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              background: 'var(--gold)',
              borderRadius: '50%',
              boxShadow: '0 0 10px var(--gold)',
            }}
          />
        )}
      </div>
    </GlowCard>
  )
}
