import Image from 'next/image'

import { AuthNavigation } from './_components/AuthNavigation'

import type { ReactNode } from 'react'

import './auth-layout.css'

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="auth-layout">
      <AuthNavigation />
      <picture className="auth-layout__art" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/encre-de-sel/landing/seuil-mobile.webp" />
        <Image
          alt=""
          fetchPriority="high"
          height={941}
          priority
          sizes="100vw"
          src="/encre-de-sel/landing/seuil.webp"
          unoptimized
          width={1672}
        />
      </picture>
      <div className="auth-layout__content">{children}</div>
    </main>
  )
}
