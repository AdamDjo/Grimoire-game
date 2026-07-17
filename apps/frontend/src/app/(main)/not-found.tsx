import { SystemState } from '@/components/system/SystemState/SystemState'
import { GameLink } from '@/components/ui/game-link'

export default function MainNotFound() {
  return (
    <SystemState
      eyebrow="Trace introuvable"
      title="Ce passage n’appartient à aucune Chronique."
      body="La campagne demandée n’est pas disponible dans les données accessibles à ce navigateur."
      action={
        <GameLink href="/dashboard" size="sm" variant="secondary">
          Retour aux Chroniques
        </GameLink>
      }
    />
  )
}
