'use client'

import type { ReactNode } from 'react'

interface OrnamentBorderProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: 'gold' | 'dark'
}

export function OrnamentBorder({
  children,
  className = '',
  style,
  variant = 'gold',
}: OrnamentBorderProps) {
  const borderColor = variant === 'gold' ? 'var(--gold-dark)' : 'rgba(196,164,104,0.18)'

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius)',
        background: 'linear-gradient(160deg, #1a1410 0%, #0e0b07 100%)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(196,164,104,0.1)',
        ...style,
      }}
    >
      {/* Corner ornaments */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const [v, h] = corner.split('-')
        return (
          <span
            key={corner}
            style={{
              position: 'absolute',
              [v]: -1,
              [h]: -1,
              width: 12,
              height: 12,
              border: `1px solid ${borderColor}`,
              borderRadius: 0,
              background: 'var(--bg)',
            }}
          />
        )
      })}
      {children}
    </div>
  )
}
