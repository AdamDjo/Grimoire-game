'use client'

import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  async function handleMagicLink(event: React.FormEvent) {
    event.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setStatus(error ? 'error' : 'sent')
  }

  async function handleOAuth(provider: 'google' | 'discord') {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div data-page="signup">
      <h1>Créer un compte</h1>

      <form onSubmit={handleMagicLink}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit">Recevoir un lien d'inscription</button>
      </form>

      {status === 'sent' && <p>Lien envoyé, vérifie ta boîte mail.</p>}
      {status === 'error' && <p>Une erreur est survenue, réessaie.</p>}

      <button type="button" onClick={() => handleOAuth('google')}>
        Continuer avec Google
      </button>
      <button type="button" onClick={() => handleOAuth('discord')}>
        Continuer avec Discord
      </button>
    </div>
  )
}
