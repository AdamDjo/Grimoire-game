'use client'

import { motion } from 'framer-motion'
import { type ReactNode, useState } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: string
  selected?: boolean
  onClick?: () => void
}

export function GlowCard({
  children,
  className = '',
  style,
  glowColor = 'rgba(212,175,55,0.4)',
  selected = false,
  onClick,
}: GlowCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={className}
      style={{
        position: 'relative',
        border: '1px solid',
        borderColor: selected || hovered ? 'var(--gold-light)' : 'var(--border)',
        borderRadius: 'var(--radius)',
        background: 'linear-gradient(160deg, #1e1810, #130e08)',
        boxShadow: selected
          ? `0 0 20px ${glowColor}, 0 0 60px ${glowColor.replace('0.4', '0.2')}, inset 0 0 20px rgba(212,175,55,0.05)`
          : hovered
            ? `0 0 25px ${glowColor}, 0 0 50px ${glowColor.replace('0.4', '0.15')}`
            : '0 4px 20px rgba(0,0,0,0.5)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color .3s, box-shadow .3s',
        ...style,
      }}
      animate={
        selected
          ? {
              boxShadow: [
                `0 0 15px ${glowColor}, 0 0 40px ${glowColor.replace('0.4', '0.15')}`,
                `0 0 30px ${glowColor}, 0 0 80px ${glowColor.replace('0.4', '0.25')}`,
                `0 0 15px ${glowColor}, 0 0 40px ${glowColor.replace('0.4', '0.15')}`,
              ],
            }
          : {}
      }
      transition={selected ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
