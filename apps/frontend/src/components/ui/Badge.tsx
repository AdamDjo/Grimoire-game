import type { ReactNode } from 'react'

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

interface BadgeProps {
  rarity: Rarity
  children: ReactNode
}

const RARITY_STYLES: Record<Rarity, string> = {
  common: 'text-[var(--r-common)]   border-[var(--r-common)]',
  uncommon: 'text-[var(--r-unc)]      border-[var(--r-unc)]',
  rare: 'text-[var(--r-rare)]     border-[var(--r-rare)]',
  epic: 'text-[var(--r-epic)]     border-[var(--r-epic)]',
  legendary: 'text-[var(--r-leg)]      border-[var(--r-leg)]',
}

export function Badge({ rarity, children }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 text-xs font-ui font-semibold uppercase tracking-wider',
        'border rounded-md bg-[var(--bg-3)]',
        RARITY_STYLES[rarity],
      ].join(' ')}
    >
      {children}
    </span>
  )
}
