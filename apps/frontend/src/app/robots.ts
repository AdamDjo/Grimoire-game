import type { MetadataRoute } from 'next'

const SITE_URL = 'https://grimoire.game'

export function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/dashboard/', '/velkhar/session/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

export default robots
