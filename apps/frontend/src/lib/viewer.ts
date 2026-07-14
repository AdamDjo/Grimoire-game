import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'

export interface ViewerSummary {
  displayName: string | null
  hasAccount: boolean
}

export const getViewerSummary = cache(async (): Promise<ViewerSummary> => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const hasAccount = Boolean(user && !user.is_anonymous)
    const displayName =
      typeof user?.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name
        : typeof user?.email === 'string'
          ? user.email.split('@')[0]
          : null

    return { displayName, hasAccount }
  } catch {
    return { displayName: null, hasAccount: false }
  }
})
