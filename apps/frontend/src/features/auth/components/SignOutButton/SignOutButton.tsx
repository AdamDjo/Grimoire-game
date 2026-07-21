'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const t = useTranslations('Auth')
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
        {status === 'loading' ? t('signingOut') : t('signOut')}
      </button>
      <span aria-live="polite" role={status === 'error' ? 'alert' : 'status'}>
        {status === 'error' ? t('signOutError') : null}
      </span>
    </div>
  )
}
