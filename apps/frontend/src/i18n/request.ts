import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

import { createClient } from '@/lib/supabase/server'

import englishMessages from '../../messages/en.json'
import frenchMessages from '../../messages/fr.json'

import { resolveUiLocale, UI_LOCALE_COOKIE, UI_LOCALE_METADATA_KEY } from './config'

async function getAccountLocale(): Promise<unknown> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return undefined
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user?.user_metadata[UI_LOCALE_METADATA_KEY]
  } catch {
    return undefined
  }
}

export default getRequestConfig(async () => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const cookieLocale = cookieStore.get(UI_LOCALE_COOKIE)?.value
  const accountLocale = cookieLocale ? undefined : await getAccountLocale()
  const locale = resolveUiLocale({
    acceptLanguage: headerStore.get('accept-language'),
    accountLocale,
    cookieLocale,
  })

  const catalogs = { en: englishMessages, fr: frenchMessages } as const

  return {
    locale,
    messages: catalogs[locale],
  }
})
