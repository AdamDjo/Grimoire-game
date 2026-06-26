'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

interface ScrollHintProps {
  label?: string
}

export const ScrollHint = forwardRef<HTMLDivElement, ScrollHintProps>(function ScrollHint(
  { label = 'Défiler' },
  ref
) {
  return (
    <div ref={ref} className="fixed left-0 right-0 z-10 flex justify-center" style={{ bottom: 40 }}>
      <motion.div
        className="flex flex-col items-center gap-1.5"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-disp-xs" style={{ color: 'var(--gold-50)' }}>
          {label}
        </span>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
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
    </div>
  )
})
