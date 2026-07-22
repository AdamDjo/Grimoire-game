import '@testing-library/jest-dom'
import { vi } from 'vitest'

import englishMessages from '../../messages/en.json'

import type * as NextNavigation from 'next/navigation'
import type * as NextIntl from 'next-intl'

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof NextNavigation>()
  return {
    ...actual,
    useRouter: () => ({ refresh: vi.fn() }),
  }
})

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof NextIntl>()
  const translator = actual.createTranslator({
    locale: 'en',
    messages: englishMessages,
  }) as unknown as (key: string, values?: Record<string, unknown>) => string
  const translations = new Map<string, (key: string, values?: Record<string, unknown>) => string>()

  return {
    ...actual,
    useLocale: () => 'en',
    useTranslations: (namespace?: string) => {
      const cacheKey = namespace ?? ''
      const cached = translations.get(cacheKey)
      if (cached) return cached

      const translate = (key: string, values?: Record<string, unknown>) =>
        translator(namespace ? `${namespace}.${key}` : key, values)
      translations.set(cacheKey, translate)
      return translate
    },
  }
})

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string): MediaQueryList => ({
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined,
  }),
  writable: true,
})
