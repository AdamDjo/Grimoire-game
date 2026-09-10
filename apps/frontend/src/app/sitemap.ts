import type { MetadataRoute } from 'next'

const SITE_URL = 'https://grimoire.game'

export function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/traversee`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}

export default sitemap
