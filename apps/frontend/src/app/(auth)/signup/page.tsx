import { getTranslations } from 'next-intl/server'

import { getSafeInternalDestination } from '@/lib/internal-navigation'
import { getViewerSummary } from '@/lib/viewer'

import { SignupForm } from './SignupForm'

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return { title: t('signupMetadataTitle'), description: t('signupMetadataDescription') }
}

interface SignupPageProps {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const [{ next }, viewer] = await Promise.all([searchParams, getViewerSummary()])
  const nextPath = getSafeInternalDestination(next)

  return (
    <SignupForm
      anonymousSession={viewer.hasSession && viewer.tier === 'anonymous'}
      nextPath={nextPath}
    />
  )
}
