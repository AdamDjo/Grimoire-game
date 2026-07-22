import { createClient } from './client'

/**
 * Guarantees an authenticated Supabase session exists before an API call that
 * the backend protects with a bearer token. When the visitor has no session yet
 * (first contact, anonymous tier), an anonymous session is created so the
 * `/api/[...path]` proxy can attach `Authorization: Bearer <token>`.
 *
 * Every authenticated flow reachable as a first landing point — character
 * creation, the Aveugle hub, the game session — must call this before hitting a
 * protected route, otherwise the request goes out tokenless and the backend
 * rejects it with "Missing bearer token".
 */
export async function ensureAnonymousSession(): Promise<void> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    await supabase.auth.signInAnonymously()
  }
}
