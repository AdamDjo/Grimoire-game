import { GameBrand } from '@/components/ui/grimoire/GameBrand/GameBrand'

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
          <GameBrand
            className="system-state__logo"
            decorative
            priority
            size="md"
            variant="lockup"
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
