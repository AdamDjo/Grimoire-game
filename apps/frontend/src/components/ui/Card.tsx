import { type ReactNode, type MouseEvent, useState } from 'react'

type CardSurface = 'dark' | 'parchment'

interface CardProps {
  children: ReactNode
  title?: string
  surface?: CardSurface
  className?: string
  style?: React.CSSProperties
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

const SURFACE_STYLES: Record<CardSurface, React.CSSProperties> = {
  dark: {
    border: '1px solid var(--border)',
    background: 'linear-gradient(160deg, #211b14, #16110b)',
    boxShadow: 'none',
  },
  parchment: {
    border: '1px solid var(--border-parch)',
    background: 'linear-gradient(160deg, #e7d9ba, #d2bf99 55%, #c2ad86)',
    boxShadow: '0 18px 48px rgba(0,0,0,.55), inset 0 0 70px rgba(120,90,50,.12)',
  },
}

export function Card({
  children,
  title,
  surface = 'dark',
  className = '',
  style,
  onClick,
}: CardProps) {
  const [hovered, setHovered] = useState(false)
  const isClickable = Boolean(onClick)

  const computed: React.CSSProperties = {
    borderRadius: 'var(--radius)',
    padding: '24px',
    position: 'relative',
    transition: 'border-color .25s, box-shadow .3s',
    cursor: isClickable ? 'pointer' : undefined,
    ...SURFACE_STYLES[surface],
    ...(isClickable && hovered
      ? {
          borderColor: 'var(--gold)',
          boxShadow: '0 0 26px rgba(224,196,137,.3)',
        }
      : {}),
    ...style,
  }

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={className}
      style={computed}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ')
                onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
            }
          : undefined
      }
    >
      {title && (
        <h3
          style={{
            fontFamily: 'var(--font-disp)',
            fontSize: '13px',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: surface === 'parchment' ? 'var(--text-parch-3)' : 'var(--gold)',
            marginBottom: '16px',
            marginTop: 0,
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
