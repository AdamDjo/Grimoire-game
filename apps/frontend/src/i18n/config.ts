export const UI_LOCALES = ['en', 'fr'] as const

export type UiLocale = (typeof UI_LOCALES)[number]

export const DEFAULT_UI_LOCALE: UiLocale = 'en'
export const UI_LOCALE_COOKIE = 'grimoire-ui-locale'
export const UI_LOCALE_METADATA_KEY = 'ui_locale'

export function isUiLocale(value: unknown): value is UiLocale {
  return typeof value === 'string' && UI_LOCALES.includes(value as UiLocale)
}

/** Only the browser's primary preference controls first-visit French detection. */
export function detectUiLocale(acceptLanguage: string | null): UiLocale {
  const primaryLanguage = acceptLanguage?.split(',', 1)[0]?.trim().toLowerCase()
  return primaryLanguage === 'fr' || primaryLanguage?.startsWith('fr-') ? 'fr' : DEFAULT_UI_LOCALE
}

export function resolveUiLocale({
  acceptLanguage,
  accountLocale,
  cookieLocale,
}: {
  acceptLanguage: string | null
  accountLocale?: unknown
  cookieLocale?: unknown
}): UiLocale {
  if (isUiLocale(cookieLocale)) return cookieLocale
  if (isUiLocale(accountLocale)) return accountLocale
  return detectUiLocale(acceptLanguage)
}
