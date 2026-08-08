'use client'

import { AuthAccessForm } from '../_components/AuthAccessForm'

interface SignupFormProps {
  anonymousSession: boolean
  nextPath: string
}

export function SignupForm({ anonymousSession, nextPath }: SignupFormProps) {
  return <AuthAccessForm anonymousSession={anonymousSession} mode="signup" nextPath={nextPath} />
}
