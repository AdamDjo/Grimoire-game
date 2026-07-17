import { getSafeInternalDestination } from '@/lib/internal-navigation'
import { getViewerSummary } from '@/lib/viewer'

import { LoginForm } from './LoginForm'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion · GRIMOIRE',
  description: 'Reprenez votre chronique et retournez dans le monde de Velkhar.',
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string | string[]; next?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ error, next }, viewer] = await Promise.all([searchParams, getViewerSummary()])
  const nextPath = getSafeInternalDestination(next)

  return (
    <LoginForm
      anonymousSession={viewer.hasSession && viewer.tier === 'anonymous'}
      callbackError={(Array.isArray(error) ? error[0] : error) === 'callback'}
      nextPath={nextPath}
    />
  )
}
