import { describe, expect, it } from 'vitest'

import { getAuthHref, getSafeInternalDestination } from './internal-navigation'

describe('getSafeInternalDestination', () => {
  it.each([
    ['/dashboard', '/dashboard'],
    ['/velkhar/session/resume?from=dashboard', '/velkhar/session/resume?from=dashboard'],
    ['/velkhar/character-create?campaign=new', '/velkhar/character-create?campaign=new'],
  ])('keeps an allowed internal destination', (input, expected) => {
    expect(getSafeInternalDestination(input)).toBe(expected)
  })

  it.each([
    'https://example.com/steal-session',
    '//example.com/steal-session',
    '/login?next=/dashboard',
    '/chronique/route-pas-encore-livree',
    '/velkhar/profile/route-pas-encore-livree',
    '/unknown-route',
    '',
  ])('rejects unsafe or unknown destination %s', (input) => {
    expect(getSafeInternalDestination(input)).toBe('/dashboard')
  })

  it('uses the requested safe fallback', () => {
    expect(getSafeInternalDestination(undefined, '/')).toBe('/')
  })
})

describe('getAuthHref', () => {
  it('encodes a validated return destination', () => {
    expect(getAuthHref('/login', '/velkhar/session/resume?from=dashboard')).toBe(
      '/login?next=%2Fvelkhar%2Fsession%2Fresume%3Ffrom%3Ddashboard'
    )
  })
})
