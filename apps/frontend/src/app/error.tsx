'use client'

import { SystemState } from '@/components/system-state/SystemState'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <SystemState
      eyebrow="Le fil s’est rompu"
      title="L’histoire hésite."
      body="Une ombre imprévue a interrompu le récit. Rien n’est encore perdu."
      action={
        <button className="system-state__action" type="button" onClick={reset}>
          Reprendre le récit
        </button>
      }
    />
  )
}
