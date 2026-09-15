'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameDivider } from '@/components/ui/grimoire/GameDivider/GameDivider'
import { GameField } from '@/components/ui/grimoire/GameField/GameField'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameInput } from '@/components/ui/grimoire/GameInput/GameInput'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'
import { getAccessRecoveryHref, getAuthHref } from '@/lib/internal-navigation'
import { createClient } from '@/lib/supabase/client'

import type { FormEvent } from 'react'

import '../login/login-form.css'

type AccessMode = 'login' | 'signup'
type FormStatus = 'idle' | 'loading' | 'sent' | 'error'

interface AuthAccessFormProps {
  anonymousSession: boolean
  initialError?: boolean
  mode: AccessMode
  nextPath: string
}

function createCallbackUrl(nextPath: string): string {
  const callbackUrl = new URL('/auth/callback', window.location.origin)
  callbackUrl.searchParams.set('next', nextPath)
  return callbackUrl.toString()
}

export function AuthAccessForm({
  anonymousSession,
  initialError = false,
  mode,
  nextPath,
}: AuthAccessFormProps) {
  const t = useTranslations('Auth')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>(initialError ? 'error' : 'idle')
  const copy =
    mode === 'login'
      ? {
          icon: 'key' as const,
          eyebrow: t('loginEyebrow'),
          title: t('loginTitle'),
          description: t('loginDescription'),
          submit: t('loginSubmit'),
          sent: t('loginSent'),
        }
      : {
          icon: 'book' as const,
          eyebrow: t('signupEyebrow'),
          title: t('signupTitle'),
          description: t('signupDescription'),
          submit: t('signupSubmit'),
          sent: t('signupSent'),
        }
  const isConversion = mode === 'signup' && anonymousSession

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    try {
      const supabase = createClient()
      const emailRedirectTo = createCallbackUrl(nextPath)
      const result = isConversion
        ? await supabase.auth.updateUser({ email }, { emailRedirectTo })
        : await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo,
              shouldCreateUser: mode === 'signup',
            },
          })

      setStatus(result.error ? 'error' : 'sent')
    } catch {
      setStatus('error')
    }
  }

  async function handleOAuth(provider: 'google' | 'discord') {
    setStatus('loading')

    try {
      const supabase = createClient()
      const options = { redirectTo: createCallbackUrl(nextPath) }
      const result = isConversion
        ? await supabase.auth.linkIdentity({ provider, options })
        : await supabase.auth.signInWithOAuth({ provider, options })

      if (result.error) setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <GamePanel className="login-form" ornament="diamond" padding="lg" variant="narrative-frame">
      <header className="login-form__header">
        <GameIcon decorative name={copy.icon} size={48} />
        <p className="login-form__eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </header>

      {isConversion ? (
        <aside className="login-form__preservation" aria-label={t('preservedDataLabel')}>
          <GameIcon decorative name="memory" size={24} />
          <p>{t('preservedData')}</p>
        </aside>
      ) : null}

      {mode === 'login' && anonymousSession ? (
        <p className="login-form__account-switch">
          {t('existingAccountBefore')}{' '}
          <Link href={getAuthHref('/signup', nextPath)}>{t('createAccess')}</Link>{' '}
          {t('existingAccountAfter')}
        </p>
      ) : null}

      <GameDivider size="sm" />

      <form className="login-form__fields" onSubmit={handleMagicLink}>
        <GameField label={t('emailLabel')}>
          <GameInput
            autoComplete="email"
            disabled={status === 'loading' || status === 'sent'}
            leadingIcon={<GameIcon decorative name="envelope" size={24} />}
            name="email"
            placeholder={t('emailPlaceholder')}
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </GameField>

        <GameButton
          className="login-form__submit"
          disabled={status === 'sent'}
          loading={status === 'loading'}
          size="lg"
          type="submit"
        >
          {copy.submit}
        </GameButton>

        {mode === 'login' ? (
          <p className="login-form__recovery-link">
            <Link href={getAccessRecoveryHref(nextPath)}>{t('resendLink')}</Link>
          </p>
        ) : null}

        <div className="login-form__oauth" aria-label={t('externalAccess')}>
          <GameButton
            disabled={status === 'loading' || status === 'sent'}
            onClick={() => handleOAuth('google')}
            type="button"
            variant="secondary"
          >
            {t('continueGoogle')}
          </GameButton>
          <GameButton
            disabled={status === 'loading' || status === 'sent'}
            onClick={() => handleOAuth('discord')}
            type="button"
            variant="secondary"
          >
            {t('continueDiscord')}
          </GameButton>
        </div>

        <div
          aria-live="polite"
          className="login-form__status"
          role={status === 'error' ? 'alert' : 'status'}
        >
          {status === 'sent' ? <p>{copy.sent}</p> : null}
          {status === 'error' ? <p>{t('requestError')}</p> : null}
        </div>
      </form>

      <p className="login-form__footer">
        {mode === 'login' ? (
          <>
            {t('firstVisit')}{' '}
            <Link href={getAuthHref('/signup', nextPath)}>{t('keepJourney')}</Link>
          </>
        ) : (
          <>
            {t('existingChronicle')}{' '}
            <Link href={getAuthHref('/login', nextPath)}>{t('signIn')}</Link>
          </>
        )}
      </p>
    </GamePanel>
  )
}
