import Image from 'next/image'

import type { ReactNode } from 'react'

import './system-state.css'

interface SystemStateProps {
  action?: ReactNode
  body: string
  eyebrow: string
  isLoading?: boolean
  title: string
}

export function SystemState({ action, body, eyebrow, isLoading = false, title }: SystemStateProps) {
  return (
    <main
      className="system-state"
      aria-live={isLoading ? 'polite' : undefined}
      aria-busy={isLoading || undefined}
    >
      <div className="system-state__grain" aria-hidden="true" />

      <section className="system-state__content" aria-labelledby="system-state-title">
        <div className="system-state__brand" aria-hidden="true">
          <Image
            className="system-state__logo"
            src="/landing/ui/brand-lockup-grimoire.webp"
            alt=""
            width={720}
            height={336}
            priority
            sizes="(max-width: 640px) 190px, 250px"
          />
        </div>

        <span className="system-state__rule" aria-hidden="true" />
        <p className="system-state__eyebrow">{eyebrow}</p>
        <h1 id="system-state-title" className="system-state__title">
          {title}
        </h1>
        <p className="system-state__body">{body}</p>

        {isLoading ? (
          <div className="system-state__loading" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : null}

        {action ? <div className="system-state__action-wrap">{action}</div> : null}
      </section>
    </main>
  )
}
