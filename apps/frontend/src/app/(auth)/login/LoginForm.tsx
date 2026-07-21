'use client'

import { AuthAccessForm } from '../_components/AuthAccessForm'

interface LoginFormProps {
  anonymousSession: boolean
  callbackError?: boolean
  nextPath: string
}

export function LoginForm({ anonymousSession, callbackError = false, nextPath }: LoginFormProps) {
  return (
    <AuthAccessForm
      anonymousSession={anonymousSession}
      initialError={callbackError}
      mode="login"
      nextPath={nextPath}
    />
  )
}
