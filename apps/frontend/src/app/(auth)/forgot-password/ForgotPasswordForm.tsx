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
    <GamePanel className="login-form" ornament="diamond" padding="lg" variant="narrative-frame">
      <header className="login-form__header">
        <GameIcon decorative name="unlock" size={48} />
        <p className="login-form__eyebrow">{t('recoveryEyebrow')}</p>
        <h1>{t('recoveryTitle')}</h1>
        <p>{t('recoveryDescription')}</p>
      </header>
      <GameDivider size="sm" />
      <form className="login-form__fields" onSubmit={handleSubmit}>
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
        <Link href={getAuthHref('/login', nextPath)}>{t('backToSignIn')}</Link>
      </p>
    </GamePanel>
  )
}
