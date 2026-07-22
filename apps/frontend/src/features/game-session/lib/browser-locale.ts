import { normalizeLocale, type Locale } from '@grimoire/shared'

/**
 * Reads the player's preferred narration language from the browser, as a
 * normalized BCP-47 tag (e.g. "es-ES", "it-IT", "fr"), or `undefined` when none
 * is usable. Walks `navigator.languages` in priority order and returns the first
 * tag that normalizes — the backend applies its own precedence and English
 * fallback, so this only needs to surface the best browser candidate (#168).
 *
 * SSR-safe: returns `undefined` when `navigator` is unavailable.
 */
export function detectBrowserLocale(): Locale | undefined {
  if (typeof navigator === 'undefined') return undefined

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language].filter(Boolean)

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate)
    if (normalized) return normalized
  }

  return undefined
}
