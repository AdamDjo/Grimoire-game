'use client'

export function NavLink({
  label,
  href = '#',
  active = false,
  small = false,
  'aria-current': ariaCurrent,
}: {
  label: string
  href?: string
  active?: boolean
  small?: boolean
  'aria-current'?: 'page' | boolean
}) {
  return (
    <a
      href={href}
      aria-current={ariaCurrent ?? (active ? 'page' : undefined)}
      style={{
        fontFamily: 'var(--font-disp)',
        fontSize: small ? 10 : 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: active ? 'var(--gold-light)' : 'var(--ink-3)',
        borderBottom: active ? '1px solid var(--gold)' : '1px solid transparent',
        paddingBottom: 2,
        transition: 'color .25s',
      }}
      className="hover:!text-[var(--gold-light)]"
    >
      {label}
    </a>
  )
}
