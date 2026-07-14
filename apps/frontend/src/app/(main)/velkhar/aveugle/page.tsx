import { SystemState } from '@/components/system-state/SystemState'
import { GameLink } from '@/components/ui/game-link'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'L’Auberge de L’Aveugle · GRIMOIRE',
}

export default function AveuglePage() {
  return (
    <SystemState
      eyebrow="Le seuil de chaque run"
      title="L’Aveugle vous attend."
      body="L’Auberge est la prochaine étape du chantier frontend. En attendant son ouverture complète, la Forge reste accessible depuis ce seuil."
      action={
        <GameLink href="/velkhar/character-create" size="sm">
          Entrer dans le prologue
        </GameLink>
      }
    />
  )
}
