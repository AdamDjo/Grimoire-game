'use client'

export function RoleRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid rgba(196,164,104,0.1)',
        cursor: 'pointer',
        transition: 'all .2s',
      }}
      className="group"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{ color: 'var(--gold)', transition: 'color .2s' }}
          className="group-hover:text-[var(--gold-light)]"
        >
          {icon}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 14,
            color: 'var(--ink-2)',
            transition: 'color .2s',
          }}
          className="group-hover:text-[var(--ink)]"
        >
          {label}
        </span>
      </div>
      <span style={{ color: 'var(--gold-dark)', fontSize: 11 }}>✦</span>
    </div>
  )
}
