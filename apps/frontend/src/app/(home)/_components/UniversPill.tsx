'use client'

export function UniversPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '14px 8px',
        border: '1px solid rgba(196,164,104,0.2)',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        transition: 'all .3s',
        color: 'var(--gold)',
      }}
      className="hover:border-[var(--gold)] hover:bg-[linear-gradient(160deg,#211b14,#16110b)] hover:shadow-[0_0_20px_rgba(196,164,104,0.2)] hover:-translate-y-0.5 hover:text-[var(--gold-light)] group"
    >
      <span className="group-hover:text-[var(--gold-light)]">{icon}</span>
      <span
        style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
        }}
        className="group-hover:text-[var(--ink)]"
      >
        {label}
      </span>
    </div>
  )
}
