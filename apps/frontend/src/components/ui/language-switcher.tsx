'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { startTransition, useState } from 'react'

import { type UiLocale, UI_LOCALE_COOKIE, UI_LOCALE_METADATA_KEY } from '@/i18n/config'
import { createClient } from '@/lib/supabase/client'

import './language-switcher.css'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('LanguageSwitcher')
  const [isSaving, setIsSaving] = useState(false)

  async function selectLocale(nextLocale: UiLocale) {
    if (nextLocale === locale || isSaving) return

    setIsSaving(true)
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${UI_LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`

    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        await supabase.auth.updateUser({ data: { [UI_LOCALE_METADATA_KEY]: nextLocale } })
      }
    } catch {
      // The cookie remains authoritative when account preference persistence is unavailable.
    } finally {
      startTransition(() => {
        router.refresh()
        setIsSaving(false)
      })
    }
  }

  return (
    <div className="language-switcher">
      <label className="sr-only" htmlFor="ui-language">
        {t('label')}
      </label>
      <select
        aria-busy={isSaving}
        aria-label={t('label')}
        disabled={isSaving}
        id="ui-language"
        onChange={(event) => void selectLocale(event.target.value as UiLocale)}
        value={locale}
      >
        <option value="en">{t('english')}</option>
        <option value="fr">{t('french')}</option>
      </select>
      <span aria-live="polite" className="sr-only">
        {isSaving ? t('saving') : null}
      </span>
    </div>
  )
}
