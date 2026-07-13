import Link from 'next/link'

import type { ReactNode } from 'react'

import './auth-layout.css'

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="auth-layout">
      <Link className="auth-layout__home" href="/">
        ← Retour au Grimoire
      </Link>
      <div className="auth-layout__content">{children}</div>
    </main>
  )
}
