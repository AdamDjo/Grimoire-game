import { getTranslations } from 'next-intl/server'

import { VelkharSession } from '../_components/VelkharSession'
import { MOCK_CHARACTER } from '../_data/mock-character'

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Session')
  return { title: t('metadataTitle') }
}

interface VelkharSessionPageProps {
  params: Promise<{ id: string }>
}

export default async function VelkharSessionPage({ params }: VelkharSessionPageProps) {
  // The `[id]` segment is only a route placeholder — the real session id is
  // owned by the backend and returned by the shared game-session controller.
  await params

  return <VelkharSession initialCharacter={MOCK_CHARACTER} />
}
