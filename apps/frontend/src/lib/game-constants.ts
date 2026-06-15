export const UNIVERSES = ['valorain', 'zombie', 'scifi'] as const
export type Universe = (typeof UNIVERSES)[number]

export const ACTIVE_UNIVERSE: Universe = 'valorain'

export const STAT_MAX = {
  hp: 100,
  mana: 100,
  vigor: 100,
} as const

export const RARITY_LEVELS = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const
export type Rarity = (typeof RARITY_LEVELS)[number]
