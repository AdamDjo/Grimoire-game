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
      className={[
        'font-display uppercase no-underline transition-colors duration-[250ms] pb-0.5',
        small ? 'text-[11px] tracking-[0.22em]' : 'text-[13px] tracking-[0.22em]',
        active
          ? 'text-gold-light border-b border-gold'
          : 'text-ink-3 border-b border-transparent hover:text-gold-light',
      ].join(' ')}
    >
      {label}
    </a>
  )
}
