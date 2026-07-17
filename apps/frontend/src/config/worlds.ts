export const WORLD_ROUTES = {
  velkhar: {
    aveugle: '/velkhar/aveugle',
    campaign: '/velkhar/campaign',
    characterCreate: '/velkhar/character-create',
    root: '/velkhar',
    session: '/velkhar/session',
    world: '/velkhar/world',
  },
} as const

export type WorldId = keyof typeof WORLD_ROUTES
