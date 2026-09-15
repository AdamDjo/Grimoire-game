import { getTranslations } from 'next-intl/server'

import { getSafeInternalDestination } from '@/lib/internal-navigation'
import { getViewerSummary } from '@/lib/viewer'

import { LandingArt } from '../../(home)/_components/LandingExperience/LandingArt'

import { LoginForm } from './LoginForm'

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return { title: t('loginMetadataTitle'), description: t('loginMetadataDescription') }
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string | string[]; next?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ error, next }, viewer] = await Promise.all([searchParams, getViewerSummary()])
  const nextPath = getSafeInternalDestination(next)

  return (
    <section className="auth-login salt-plan" aria-labelledby="login-title">
      <LandingArt name="seuil" priority />
      <div aria-hidden="true" />
      <LoginForm
        anonymousSession={viewer.hasSession && viewer.tier === 'anonymous'}
        callbackError={(Array.isArray(error) ? error[0] : error) === 'callback'}
        nextPath={nextPath}
      />
    </section>
  )
}
