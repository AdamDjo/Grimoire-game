import type { MetadataRoute } from 'next'

const SITE_URL = 'https://velkhar.game'

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
