import { getSafeInternalDestination } from '@/lib/internal-navigation'

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
  const { next } = await searchParams
  const nextPath = getSafeInternalDestination(next)

  return <SignupForm nextPath={nextPath} />
}
