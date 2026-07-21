import { WORLD_ROUTES } from '@/config/worlds'

const INTERNAL_ORIGIN = 'https://grimoire.local'

const ALLOWED_DESTINATIONS = [
  '/',
  '/dashboard',
  WORLD_ROUTES.velkhar.aveugle,
  WORLD_ROUTES.velkhar.characterCreate,
  WORLD_ROUTES.velkhar.world,
] as const
const ALLOWED_DYNAMIC_DESTINATIONS = [
  `${WORLD_ROUTES.velkhar.campaign}/`,
  `${WORLD_ROUTES.velkhar.session}/`,
] as const

type SearchParamValue = string | string[] | null | undefined

function isAllowedPathname(pathname: string): boolean {
  return (
    ALLOWED_DESTINATIONS.some((destination) => pathname === destination) ||
    ALLOWED_DYNAMIC_DESTINATIONS.some((prefix) => pathname.startsWith(prefix))
  )
}

/**
 * Keeps post-auth navigation inside known GRIMOIRE surfaces. Absolute URLs,
 * protocol-relative URLs and auth loops always fall back to a safe route.
 */
export function getSafeInternalDestination(
  value: SearchParamValue,
  fallback = '/dashboard'
): string {
  const candidate = Array.isArray(value) ? value[0] : value

  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return fallback
  }

  try {
    const destination = new URL(candidate, INTERNAL_ORIGIN)

    if (destination.origin !== INTERNAL_ORIGIN || !isAllowedPathname(destination.pathname)) {
      return fallback
    }

    return `${destination.pathname}${destination.search}${destination.hash}`
  } catch {
    return fallback
  }
}

export function getAuthHref(pathname: '/login' | '/signup', next: string): string {
  const safeNext = getSafeInternalDestination(next)
  return `${pathname}?next=${encodeURIComponent(safeNext)}`
}

export function getAccessRecoveryHref(next: string): string {
  const safeNext = getSafeInternalDestination(next)
  return `/forgot-password?next=${encodeURIComponent(safeNext)}`
}
