'use client'

import Link from 'next/link'
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

const COPY = {
  login: {
    icon: 'key',
    eyebrow: 'Les portes de Velkhar',
    title: 'Reprendre votre chronique',
    description: 'Vos choix, vos souvenirs et les traces laissées dans le monde vous attendent.',
    submit: 'Recevoir le lien d’accès',
    sent: 'Si cette adresse possède un compte, un lien d’accès vient d’être envoyé.',
  },
  signup: {
    icon: 'book',
    eyebrow: 'Une trace qui demeure',
    title: 'Conserver votre chronique',
    description: 'Ajoutez un accès à votre voyage sans recommencer votre aventure.',
    submit: 'Conserver avec mon email',
    sent: 'Lien envoyé. Confirmez cette adresse pour conserver vos traces.',
  },
} as const

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
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>(initialError ? 'error' : 'idle')
  const copy = COPY[mode]
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
    <GamePanel className="login-form" ornament="diamond" padding="lg" variant="main">
      <header className="login-form__header">
        <GameIcon decorative name={copy.icon} size={48} />
        <p className="login-form__eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </header>

      {isConversion ? (
        <aside className="login-form__preservation" aria-label="Données conservées">
          <GameIcon decorative name="memory" size={24} />
          <p>
            Votre personnage, le run en cours, vos Souvenirs et votre Chronique restent attachés à
            cette même trace.
          </p>
        </aside>
      ) : null}

      {mode === 'login' && anonymousSession ? (
        <p className="login-form__account-switch">
          Cette connexion ouvre un compte existant. Pour rattacher la trace actuelle,{' '}
          <Link href={getAuthHref('/signup', nextPath)}>créez plutôt votre accès</Link>.
        </p>
      ) : null}

      <GameDivider size="sm" />

      <form className="login-form__fields" onSubmit={handleMagicLink}>
        <GameField label="Adresse de messager">
          <GameInput
            autoComplete="email"
            disabled={status === 'loading' || status === 'sent'}
            leadingIcon={<GameIcon decorative name="envelope" size={24} />}
            name="email"
            placeholder="vous@exemple.fr"
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
            <Link href={getAccessRecoveryHref(nextPath)}>Renvoyer un lien d’accès</Link>
          </p>
        ) : null}

        <div className="login-form__oauth" aria-label="Accès avec un service externe">
          <GameButton
            disabled={status === 'loading' || status === 'sent'}
            onClick={() => handleOAuth('google')}
            type="button"
            variant="secondary"
          >
            Continuer avec Google
          </GameButton>
          <GameButton
            disabled={status === 'loading' || status === 'sent'}
            onClick={() => handleOAuth('discord')}
            type="button"
            variant="secondary"
          >
            Continuer avec Discord
          </GameButton>
        </div>

        <div
          aria-live="polite"
          className="login-form__status"
          role={status === 'error' ? 'alert' : 'status'}
        >
          {status === 'sent' ? <p>{copy.sent}</p> : null}
          {status === 'error' ? (
            <p>La demande n’a pas abouti. Vérifiez votre connexion puis réessayez.</p>
          ) : null}
        </div>
      </form>

      <p className="login-form__footer">
        {mode === 'login' ? (
          <>
            Première visite ?{' '}
            <Link href={getAuthHref('/signup', nextPath)}>Conserver votre trace</Link>
          </>
        ) : (
          <>
            Chronique existante ? <Link href={getAuthHref('/login', nextPath)}>Se connecter</Link>
          </>
        )}
      </p>
    </GamePanel>
  )
}
