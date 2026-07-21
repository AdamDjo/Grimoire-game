import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import type { ReactNode } from 'react'

import './auth-layout.css'

export default async function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  const t = await getTranslations('Auth')

  return (
    <main className="auth-layout">
      <Link className="auth-layout__home" href="/">
        {t('backHome')}
      </Link>
      <div className="auth-layout__content">{children}</div>
    </main>
  )
}
