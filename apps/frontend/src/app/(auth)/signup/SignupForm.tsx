'use client'

import Link from 'next/link'
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

interface SignupFormProps {
  nextPath: string
}

export function SignupForm({ nextPath }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    const supabase = createClient()
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    callbackUrl.searchParams.set('next', nextPath)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: callbackUrl.toString(),
      },
    })

    setStatus(error ? 'error' : 'sent')
  }

  async function handleOAuth(provider: 'google' | 'discord') {
    setStatus('loading')
    const supabase = createClient()
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    callbackUrl.searchParams.set('next', nextPath)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl.toString() },
    })

    if (error) setStatus('error')
  }

  return (
    <GamePanel className="login-form" ornament="diamond" padding="lg" variant="main">
      <header className="login-form__header">
        <GameIcon decorative name="book" size={48} />
        <p className="login-form__eyebrow">Une légende commence</p>
        <h1>Créer votre chronique</h1>
        <p>Choisissez vos sceaux d’accès. Votre personnage viendra ensuite.</p>
      </header>

      <GameDivider size="sm" />

      <form className="login-form__fields" onSubmit={handleMagicLink}>
        <GameField label="Adresse de messager">
          <GameInput
            autoComplete="email"
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
          loading={status === 'loading'}
          size="lg"
          type="submit"
        >
          Recevoir le lien d’inscription
        </GameButton>

        <div className="login-form__oauth" aria-label="Inscription avec un service externe">
          <GameButton
            disabled={status === 'loading'}
            onClick={() => handleOAuth('google')}
            type="button"
            variant="secondary"
          >
            Continuer avec Google
          </GameButton>
          <GameButton
            disabled={status === 'loading'}
            onClick={() => handleOAuth('discord')}
            type="button"
            variant="secondary"
          >
            Continuer avec Discord
          </GameButton>
        </div>

        <div aria-live="polite" className="login-form__status">
          {status === 'sent' && <p>Lien envoyé. Vérifiez votre boîte mail.</p>}
          {status === 'error' && <p>Une erreur est survenue. Réessayez.</p>}
        </div>
      </form>

      <p className="login-form__footer">
        Chronique existante ? <Link href={getAuthHref('/login', nextPath)}>Se connecter</Link>
      </p>
    </GamePanel>
  )
}
