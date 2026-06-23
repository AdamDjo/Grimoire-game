'use client'

export function UniversPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="group hover:bg-surface-dark hover:-translate-y-0.5 transition-all duration-300"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '14px 8px',
        border: '1px solid var(--gold-20)',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        color: 'var(--gold)',
      }}
    >
      <span className="group-hover:text-gold-light transition-colors duration-300">{icon}</span>
      <span className="text-disp-xs group-hover:text-ink transition-colors duration-300">
        {label}
      </span>
    </div>
  )
}
