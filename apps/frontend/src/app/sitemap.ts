import type { MetadataRoute } from 'next'

const SITE_URL = 'https://grimoire.game'

export function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}

export default sitemap
