'use client'

import Image from 'next/image'

import { MainNavigation } from '@/components/system/MainNavigation/main-navigation'

import '../../(home)/_components/LandingExperience/landing-experience.css'
import './loading-experience.css'

interface LoadingExperienceProps {
  body: string
  eyebrow: string
  title: string
}

// Native anchors keep the landing navigation behavior and preserve history.
const useNativeAnchor = () => false

export function LoadingExperience({ body, eyebrow, title }: LoadingExperienceProps) {
  return (
    <main className="loading-experience salt-landing" aria-busy="true" aria-live="polite">
      <MainNavigation context="marketing" onAnchorNavigate={useNativeAnchor} />

      <picture className="loading-experience__art" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/encre-de-sel/landing/seuil-mobile.webp" />
        <Image
          alt=""
          src="/encre-de-sel/landing/seuil.webp"
          width={1672}
          height={941}
          sizes="100vw"
          priority
        />
      </picture>

      <div className="loading-experience__veil" aria-hidden="true" />

      <section className="loading-experience__content" aria-labelledby="loading-title">
        <p className="loading-experience__eyebrow">{eyebrow}</p>
        <h1 id="loading-title">{title}</h1>
        <p className="loading-experience__body">{body}</p>

        <div className="loading-experience__marks" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  )
}
