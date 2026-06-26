'use client'

import { motion } from 'framer-motion'

const SECTION_LABELS: Record<string, string> = {
  hero: 'Accueil',
  univers: 'Univers',
  personnage: 'Personnage',
  communaute: 'Communauté',
}

export function PaginationDot({
  active = false,
  sectionId,
  onClick,
}: {
  active?: boolean
  sectionId?: string
  onClick?: () => void
}) {
  const sectionName = sectionId ? (SECTION_LABELS[sectionId] ?? sectionId) : ''
  return (
    <motion.button
      onClick={onClick}
      aria-label={`Aller à la section ${sectionName}`}
      aria-current={active ? 'true' : undefined}
      whileHover={{ scale: 1.4 }}
      animate={active ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={active ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: active ? 14 : 9,
        height: active ? 14 : 9,
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {active && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.6, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,240,180,0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          width: active ? 14 : 9,
          height: active ? 14 : 9,
          borderRadius: '50%',
          background: active
            ? 'radial-gradient(circle, #fff8e0 0%, #f0d870 40%, #c4a020 100%)'
            : 'radial-gradient(circle, rgba(220,190,120,0.6) 0%, rgba(160,130,70,0.3) 100%)',
          boxShadow: active
            ? '0 0 8px rgba(255,240,160,1), 0 0 18px rgba(220,190,80,0.9), 0 0 32px rgba(196,164,60,0.6)'
            : '0 0 4px rgba(196,164,104,0.4), 0 0 8px rgba(196,164,104,0.2)',
          transition: 'all 0.4s ease',
        }}
      />
    </motion.button>
  )
}
