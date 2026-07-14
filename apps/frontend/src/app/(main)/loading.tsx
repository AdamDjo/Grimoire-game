import { SystemState } from '@/components/system-state/SystemState'

export default function MainLoading() {
  return (
    <SystemState
      eyebrow="Une trace réapparaît"
      title="Vos Chroniques s’ouvrent."
      body="Les fragments disponibles se rassemblent sans altérer le récit."
      isLoading
    />
  )
}
