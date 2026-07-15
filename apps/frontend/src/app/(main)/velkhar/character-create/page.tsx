import { CharacterCreateFlow } from '@/components/character-create/CharacterCreateFlow'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Forge de L’Aveugle · GRIMOIRE',
  description: 'Créez votre personnage dans le prologue de L’Aveugle.',
}

interface VelkharCharacterCreatePageProps {
  searchParams: Promise<{ campaign?: string | string[] }>
}

export default async function VelkharCharacterCreatePage({
  searchParams,
}: VelkharCharacterCreatePageProps) {
  const { campaign } = await searchParams
  const campaignId = typeof campaign === 'string' ? campaign : undefined

  return <CharacterCreateFlow campaignId={campaignId} />
}
