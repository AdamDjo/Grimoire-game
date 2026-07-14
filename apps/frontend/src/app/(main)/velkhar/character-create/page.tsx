import { SystemState } from '@/components/system-state/SystemState'
import { GameLink } from '@/components/ui/game-link'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Forge · GRIMOIRE',
}

export default function VelkharCharacterCreatePage() {
  return (
    <SystemState
      eyebrow="Le prologue de L’Aveugle"
      title="La Forge se prépare."
      body="La création guidée du personnage arrive dans la prochaine feature. Vous pouvez revenir à vos Chroniques sans perdre votre chemin."
      action={
        <GameLink href="/dashboard" size="sm" variant="secondary">
          Retour aux Chroniques
        </GameLink>
      }
    />
  )
}
