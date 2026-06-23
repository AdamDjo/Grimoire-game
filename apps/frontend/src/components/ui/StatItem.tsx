export function StatItem({
  icon,
  value,
  label,
  iconLabel,
}: {
  icon: React.ReactNode
  value: string
  label: string
  iconLabel: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span aria-label={iconLabel} role="img" style={{ color: 'var(--gold)' }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--gold-light)',
          letterSpacing: '0.05em',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 9,
          letterSpacing: '0.22em',
          color: 'var(--ink-4)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  )
}
