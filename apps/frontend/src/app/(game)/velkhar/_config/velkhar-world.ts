import { WORLD_ROUTES } from '@/config/worlds'

export const VELKHAR_WORLD = {
  id: 'velkhar',
  name: 'Velkhar',
  routes: WORLD_ROUTES.velkhar,
  session: {
    backgroundAlt: 'The hall of El Makhzen',
    fallbackBackground: '/scenes/doigt-casse-session.webp',
  },
} as const

export function getVelkharSessionHref(sessionId: string): string {
  return `${VELKHAR_WORLD.routes.session}/${encodeURIComponent(sessionId)}`
}
