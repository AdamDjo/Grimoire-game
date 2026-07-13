import { LoginForm } from './LoginForm'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion · GRIMOIRE',
  description: 'Reprenez votre chronique et retournez dans le monde de Velkhar.',
}

export default function LoginPage() {
  return <LoginForm />
}
