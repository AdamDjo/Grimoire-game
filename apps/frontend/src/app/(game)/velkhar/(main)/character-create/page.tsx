import { getTranslations } from 'next-intl/server'

import { CharacterCreateFlow } from './_components/CharacterCreateFlow'

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Forge')
  return { title: t('metadataTitle'), description: t('metadataDescription') }
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
