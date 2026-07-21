import { getTranslations } from 'next-intl/server'

import { getSafeInternalDestination } from '@/lib/internal-navigation'

import { ForgotPasswordForm } from './ForgotPasswordForm'

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return { title: t('recoveryMetadataTitle'), description: t('recoveryMetadataDescription') }
}

interface ForgotPasswordPageProps {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { next } = await searchParams
  return <ForgotPasswordForm nextPath={getSafeInternalDestination(next)} />
}
