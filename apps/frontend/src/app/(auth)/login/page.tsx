import { getSafeInternalDestination } from '@/lib/internal-navigation'

import { LoginForm } from './LoginForm'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion · GRIMOIRE',
  description: 'Reprenez votre chronique et retournez dans le monde de Velkhar.',
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams
  const nextPath = getSafeInternalDestination(next)

  return <LoginForm nextPath={nextPath} />
}
