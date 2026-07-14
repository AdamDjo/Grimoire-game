import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'

export interface ViewerSummary {
  displayName: string | null
  tier: ViewerTier
}

export type ViewerTier = 'anonymous' | 'free' | 'premium'

export const getViewerSummary = cache(async (): Promise<ViewerSummary> => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const tier: ViewerTier = user?.is_anonymous
      ? 'anonymous'
      : user?.app_metadata?.tier === 'premium'
        ? 'premium'
        : user
          ? 'free'
          : 'anonymous'
    const displayName =
      typeof user?.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name
        : typeof user?.email === 'string'
          ? user.email.split('@')[0]
          : null

    return { displayName, tier }
  } catch {
    return { displayName: null, tier: 'anonymous' }
  }
})
