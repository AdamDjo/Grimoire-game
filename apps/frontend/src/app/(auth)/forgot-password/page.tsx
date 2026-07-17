import { getSafeInternalDestination } from '@/lib/internal-navigation'

import { ForgotPasswordForm } from './ForgotPasswordForm'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retrouver votre accès · GRIMOIRE',
  description: 'Recevez un nouveau lien sécurisé pour retrouver l’accès à votre chronique.',
}

interface ForgotPasswordPageProps {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { next } = await searchParams
  return <ForgotPasswordForm nextPath={getSafeInternalDestination(next)} />
}
