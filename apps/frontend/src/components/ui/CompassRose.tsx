'use client'

import { motion } from 'framer-motion'

interface CompassRoseProps {
  size?: number
  className?: string
}

export function CompassRose({ size = 56, className = '' }: CompassRoseProps) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, position: 'relative' }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle cx="28" cy="28" r="26" stroke="rgba(196,164,104,0.35)" strokeWidth="0.8" />
        <circle cx="28" cy="28" r="22" stroke="rgba(196,164,104,0.2)" strokeWidth="0.5" />
        {/* Cardinal points */}
        {[0, 90, 180, 270].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 28 28)`}>
            {/* Main arrow */}
            <path
              d="M28 4 L31 24 L28 22 L25 24 Z"
              fill={i === 0 ? '#E0C489' : 'rgba(196,164,104,0.7)'}
            />
            <path d="M28 52 L31 32 L28 34 L25 32 Z" fill="rgba(196,164,104,0.4)" />
          </g>
        ))}
        {/* Intercardinal small */}
        {[45, 135, 225, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 28 28)`}>
            <path d="M28 8 L29.5 22 L28 21 L26.5 22 Z" fill="rgba(196,164,104,0.4)" />
          </g>
        ))}
        {/* Center circles */}
        <circle cx="28" cy="28" r="5" stroke="var(--gold)" strokeWidth="0.8" fill="var(--bg-2)" />
        <circle cx="28" cy="28" r="2.5" fill="var(--gold)" />
        {/* Tick marks */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 360) / 16
          const r1 = 24,
            r2 = i % 4 === 0 ? 21 : 22.5
          const rad = (a * Math.PI) / 180
          return (
            <line
              key={i}
              x1={28 + r1 * Math.sin(rad)}
              y1={28 - r1 * Math.cos(rad)}
              x2={28 + r2 * Math.sin(rad)}
              y2={28 - r2 * Math.cos(rad)}
              stroke="rgba(196,164,104,0.5)"
              strokeWidth="0.6"
            />
          )
        })}
      </svg>
    </motion.div>
  )
}
