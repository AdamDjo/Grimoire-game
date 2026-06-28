'use client'

/**
 * NavLink — underline animé (scaleX 0 → 1 transform-origin: left).
 *
 * État actif : underline plein, doré.
 * Hover : underline qui se trace de gauche à droite, 0.35s ease.
 */
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
        'group relative font-display uppercase no-underline transition-colors duration-[250ms] pb-1',
        small ? 'text-[11px] tracking-[0.22em]' : 'text-[13px] tracking-[0.22em]',
        active ? 'text-gold-light' : 'text-ink-3 hover:text-gold-light',
      ].join(' ')}
    >
      {label}
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute left-0 right-0 bottom-0 block h-px origin-left bg-[var(--gold)]',
          'motion-safe:transition-transform motion-safe:duration-[350ms] motion-safe:ease-out',
          active
            ? 'scale-x-100'
            : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100',
        ].join(' ')}
      />
    </a>
  )
}
