'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function handleSignOut() {
    setStatus('loading')
    try {
      const { error } = await createClient().auth.signOut()
      if (error) {
        setStatus('error')
        return
      }
      router.replace('/')
      router.refresh()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="auth-sign-out">
      <button disabled={status === 'loading'} onClick={() => void handleSignOut()} type="button">
        {status === 'loading' ? 'Fermeture de la session…' : 'Se déconnecter'}
      </button>
      <span aria-live="polite" role={status === 'error' ? 'alert' : 'status'}>
        {status === 'error' ? 'La déconnexion a échoué. Réessayez.' : null}
      </span>
    </div>
  )
}
