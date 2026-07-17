import { SystemState } from '@/components/system/SystemState/SystemState'

export default function NotFound() {
  return (
    <SystemState
      eyebrow="Fragment introuvable"
      title="Cette page s’est perdue dans les cendres."
      body="Le passage que vous cherchez n’appartient plus à ce récit."
    />
  )
}
