import { describe, expect, it } from 'vitest'

import englishMessages from '../../messages/en.json'
import frenchMessages from '../../messages/fr.json'

import { detectUiLocale, resolveUiLocale } from './config'

function collectMessageKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]

  return Object.entries(value).flatMap(([key, child]) =>
    collectMessageKeys(child, prefix ? `${prefix}.${key}` : key)
  )
}

describe('UI locale resolution', () => {
  it('uses French only when the primary browser preference is French', () => {
    expect(detectUiLocale('fr-FR,fr;q=0.9,en;q=0.8')).toBe('fr')
    expect(detectUiLocale('en-US,fr;q=0.9')).toBe('en')
    expect(detectUiLocale('de-DE,fr;q=0.9')).toBe('en')
    expect(detectUiLocale(null)).toBe('en')
  })

  it('prioritizes an explicit cookie, then the account preference', () => {
    expect(
      resolveUiLocale({ acceptLanguage: 'fr-FR', accountLocale: 'fr', cookieLocale: 'en' })
    ).toBe('en')
    expect(resolveUiLocale({ acceptLanguage: 'en-US', accountLocale: 'fr' })).toBe('fr')
  })

  it('falls back to English for unsupported stored values', () => {
    expect(
      resolveUiLocale({ acceptLanguage: 'es-ES', accountLocale: 'es', cookieLocale: 'de' })
    ).toBe('en')
  })

  it('keeps the English and French catalogs structurally identical', () => {
    expect(collectMessageKeys(frenchMessages).sort()).toEqual(
      collectMessageKeys(englishMessages).sort()
    )
  })
})
