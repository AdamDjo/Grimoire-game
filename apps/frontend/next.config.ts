import bundleAnalyzer from '@next/bundle-analyzer'
import createNextIntlPlugin from 'next-intl/plugin'

import type { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

/**
 * Content-Security-Policy for the app shell.
 *
 * `'unsafe-inline'` on styles is required by Next.js, which injects inline
 * `<style>` blocks for CSS-in-JS and critical CSS; there is no nonce-based
 * escape hatch for it in the App Router today. Scripts stay nonce-free but are
 * restricted to same-origin plus the inline/eval forms Next needs to hydrate —
 * tightening those further would break the framework's own bootstrap.
 *
 * `img-src` allows the Supabase Storage origin (dynamic scene images, #207) and
 * `data:`/`blob:` for locally generated previews. `connect-src` covers the
 * Supabase auth/REST calls the browser client makes directly.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabaseUrl ? ` ${supabaseUrl}` : ''}`,
  "font-src 'self' data:",
  `connect-src 'self'${supabaseUrl ? ` ${supabaseUrl} ${supabaseUrl.replace(/^https:/, 'wss:')}` : ''}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join('; ')
  .concat(process.env.NODE_ENV === 'production' ? '; upgrade-insecure-requests' : '')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  // Next expects a Promise here; there is nothing to await, so resolve directly
  // rather than marking the method `async` for no reason.
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: securityHeaders }])
  },
}

export default withBundleAnalyzer(withNextIntl(nextConfig))
