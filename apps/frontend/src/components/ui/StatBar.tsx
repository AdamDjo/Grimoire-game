type StatType = 'hp' | 'mana' | 'vigor' | 'xp' | 'default'

interface StatBarProps {
  label?: string
  value: number
  max: number
  variant?: StatType
  showValues?: boolean
  icon?: React.ReactNode
}

const STAT_COLORS: Record<StatType, string> = {
  hp: '#c44a3e',
  mana: '#6a8fcc',
  vigor: '#8fb84a',
  xp: 'var(--gold)',
  default: 'var(--gold)',
}

export function StatBar({
  label,
  value,
  max,
  variant = 'default',
  showValues = true,
  icon,
}: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const color = STAT_COLORS[variant]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {(label != null || showValues) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {label && (
            <span
              style={{
                fontFamily: 'var(--font-disp)',
                fontSize: '11px',
                letterSpacing: '.18em',
                color: 'var(--ink-3)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {icon}
              {label}
            </span>
          )}
          {showValues && (
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '13px',
                color: 'var(--ink-2)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          height: '4px',
          width: '100%',
          borderRadius: '2px',
          background: 'rgba(0,0,0,.4)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            boxShadow: `0 0 8px ${color}80`,
            transition: 'width 500ms ease-out',
          }}
        />
      </div>
    </div>
  )
}
