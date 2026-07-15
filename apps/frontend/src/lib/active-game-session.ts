export const ACTIVE_GAME_SESSION_COOKIE = 'grimoire_active_session'
export const ACTIVE_GAME_SESSION_HREF = '/velkhar/session/resume'

const ACTIVE_GAME_SESSION_VALUE = '1'
const ACTIVE_GAME_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function hasActiveGameSession(value: string | undefined): boolean {
  return value === ACTIVE_GAME_SESSION_VALUE
}

export function rememberActiveGameSession(): void {
  document.cookie = `${ACTIVE_GAME_SESSION_COOKIE}=${ACTIVE_GAME_SESSION_VALUE}; Path=/; Max-Age=${ACTIVE_GAME_SESSION_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function forgetActiveGameSession(): void {
  document.cookie = `${ACTIVE_GAME_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}
