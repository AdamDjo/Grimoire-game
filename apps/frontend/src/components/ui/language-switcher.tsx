'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { type UiLocale, UI_LOCALE_COOKIE, UI_LOCALE_METADATA_KEY } from '@/i18n/config'
import { createClient } from '@/lib/supabase/client'

import './language-switcher.css'
import { reloadCurrentPage } from './reload-current-page'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

interface LanguageSwitcherProps {
  variant?: 'header' | 'menu' | 'standalone'
}

export function LanguageSwitcher({ variant = 'header' }: LanguageSwitcherProps) {
  const locale = useLocale()
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
      reloadCurrentPage()
    }
  }

  return (
    <div
      aria-label={t('label')}
      aria-busy={isSaving}
      className={`language-switcher language-switcher--${variant}`}
      role="group"
    >
      <span className="language-switcher__label">{t('label')}</span>
      <span className="language-switcher__options">
        <button
          aria-label={t('english')}
          aria-pressed={locale === 'en'}
          className="language-switcher__option"
          data-active={locale === 'en'}
          disabled={isSaving}
          onClick={() => void selectLocale('en')}
          type="button"
        >
          EN
        </button>
        <span aria-hidden="true" className="language-switcher__divider" />
        <button
          aria-label={t('french')}
          aria-pressed={locale === 'fr'}
          className="language-switcher__option"
          data-active={locale === 'fr'}
          disabled={isSaving}
          onClick={() => void selectLocale('fr')}
          type="button"
        >
          FR
        </button>
      </span>
      <span aria-live="polite" className="sr-only">
        {isSaving ? t('saving') : null}
      </span>
    </div>
  )
}
