import { SignupForm } from './SignupForm'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Créer une chronique · GRIMOIRE',
  description: 'Créez votre chronique et préparez votre entrée dans Velkhar.',
}

export default function SignupPage() {
  return <SignupForm />
}
