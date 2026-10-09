'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { GameButton } from '@/components/ui/velkhar/GameButton/GameButton'
import { GameField } from '@/components/ui/velkhar/GameField/GameField'
import { GameIcon } from '@/components/ui/velkhar/GameIcon/GameIcon'
import { GameInput } from '@/components/ui/velkhar/GameInput/GameInput'
import { getAuthHref } from '@/lib/internal-navigation'
import { createClient } from '@/lib/supabase/client'

import type { FormEvent } from 'react'

import '../login/login-form.css'

interface ForgotPasswordFormProps {
  nextPath: string
}

export function ForgotPasswordForm({ nextPath }: ForgotPasswordFormProps) {
  const t = useTranslations('Auth')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin)
      callbackUrl.searchParams.set('next', nextPath)
      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: callbackUrl.toString(),
          shouldCreateUser: false,
        },
      })
      setStatus(error ? 'error' : 'sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="login-form" aria-labelledby="recovery-title">
      <header className="login-form__header">
        <p className="login-form__eyebrow">{t('recoveryEyebrow')}</p>
        <h1 id="recovery-title">{t('recoveryTitle')}</h1>
        <p>{t('recoveryDescription')}</p>
      </header>
      <form className="login-form__fields" onSubmit={handleSubmit}>
        <GameField label={t('emailLabel')} required>
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
          size="sm"
          type="submit"
        >
          {t('recoverySubmit')}
        </GameButton>
        <div
          aria-live="polite"
          className="login-form__status"
          role={status === 'error' ? 'alert' : 'status'}
        >
          {status === 'sent' ? <p>{t('recoverySent')}</p> : null}
          {status === 'error' ? <p>{t('requestError')}</p> : null}
        </div>
      </form>
      <p className="login-form__footer">
        <Link className="login-form__text-link" href={getAuthHref('/login', nextPath)}>
          {t('backToSignIn')}
        </Link>
      </p>
    </section>
  )
}
