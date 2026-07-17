import { SystemState } from '@/components/system/SystemState/SystemState'
import { GameLink } from '@/components/ui/game-link'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Le Makhzen · GRIMOIRE',
}

export default function VelkharWorldPage() {
  return (
    <SystemState
      eyebrow="Territoire non découvert"
      title="Le Makhzen reste voilé."
      body="La carte ne révélera que les régions connues du personnage. Aucune destination ne peut encore être affichée sans données de découverte."
      action={
        <GameLink href="/dashboard" size="sm" variant="secondary">
          Retour aux Chroniques
        </GameLink>
      }
    />
  )
}
