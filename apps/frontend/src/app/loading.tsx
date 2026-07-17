import { SystemState } from '@/components/system/SystemState/SystemState'

export default function Loading() {
  return (
    <SystemState
      eyebrow="Le monde se souvient"
      title="Le récit prend forme."
      body="Les cendres remuent, les voix se rassemblent…"
      isLoading
    />
  )
}
