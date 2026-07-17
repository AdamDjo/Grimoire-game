import { getSafeInternalDestination } from '@/lib/internal-navigation'
import { getViewerSummary } from '@/lib/viewer'

import { SignupForm } from './SignupForm'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Créer une chronique · GRIMOIRE',
  description: 'Créez votre chronique et préparez votre entrée dans Velkhar.',
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
