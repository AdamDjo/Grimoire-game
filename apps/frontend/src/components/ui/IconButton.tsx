'use client'

export function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--ink-4)',
        padding: 0,
        transition: 'color .2s',
      }}
      className="hover:!text-[var(--gold)]"
    >
      {icon}
    </button>
  )
}
