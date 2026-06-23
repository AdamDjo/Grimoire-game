'use client'

export function RoleRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="group"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid var(--gold-08)',
        cursor: 'pointer',
        transition: 'all .2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="text-gold group-hover:text-gold-light transition-colors duration-200">
          {icon}
        </span>
        <span className="text-serif-sm group-hover:text-ink transition-colors duration-200">
          {label}
        </span>
      </div>
      <span className="text-gold-dark" style={{ fontSize: 11 }}>
        ✦
      </span>
    </div>
  )
}
