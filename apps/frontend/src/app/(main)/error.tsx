'use client'

import { SystemState } from '@/components/system/SystemState/SystemState'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'

interface MainErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MainError({ reset }: MainErrorProps) {
  return (
    <SystemState
      eyebrow="La trace s’est interrompue"
      title="Vos Chroniques ne répondent pas."
      body="Aucune progression n’a été modifiée. Vous pouvez tenter de rouvrir cet espace."
      action={
        <GameButton onClick={reset} size="sm" variant="secondary">
          Réessayer
        </GameButton>
      }
    />
  )
}
