import type { ReactNode } from 'react'

type BadgeVariant = 'gold' | 'ruby' | 'parchment' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  gold: {
    color: 'var(--gold)',
    borderColor: 'var(--gold)',
    background: 'rgba(196, 164, 104, 0.08)',
  },
  ruby: {
    color: '#c44a3e',
    borderColor: 'var(--ruby)',
    background: 'rgba(124, 36, 26, 0.15)',
  },
  parchment: {
    color: 'var(--text-parch)',
    borderColor: 'var(--border-parch)',
    background: 'var(--parchment-3)',
  },
  muted: {
    color: 'var(--ink-3)',
    borderColor: 'var(--border)',
    background: 'rgba(0,0,0,.18)',
  },
}

export function Badge({ variant = 'gold', children }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 14px',
        border: '1px solid',
        borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-serif)',
        fontSize: '15px',
        ...VARIANT_STYLES[variant],
      }}
    >
      {children}
    </span>
  )
}
