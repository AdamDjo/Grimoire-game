export const ACTIVE_GAME_SESSION_COOKIE = 'grimoire_active_session'

const LEGACY_ACTIVE_GAME_SESSION_VALUE = '1'
const ACTIVE_GAME_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function hasActiveGameSession(value: string | undefined): boolean {
  return value === LEGACY_ACTIVE_GAME_SESSION_VALUE || getActiveGameSessionHref(value) !== undefined
}

export function getActiveGameSessionHref(value: string | undefined): string | undefined {
  if (!value || value === LEGACY_ACTIVE_GAME_SESSION_VALUE) return undefined

  try {
    const href = decodeURIComponent(value)
    return href.startsWith('/') && !href.startsWith('//') ? href : undefined
  } catch {
    return undefined
  }
}

export function rememberActiveGameSession(href: string): void {
  const value = encodeURIComponent(href)
  document.cookie = `${ACTIVE_GAME_SESSION_COOKIE}=${value}; Path=/; Max-Age=${ACTIVE_GAME_SESSION_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function forgetActiveGameSession(): void {
  document.cookie = `${ACTIVE_GAME_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}
