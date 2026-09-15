import { AuthNavigation } from './_components/AuthNavigation'

import type { ReactNode } from 'react'

import '../(home)/_components/LandingExperience/landing-experience.css'
import './auth-layout.css'

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="auth-layout salt-landing">
      <AuthNavigation />
      <div className="auth-layout__content">{children}</div>
    </main>
  )
}
