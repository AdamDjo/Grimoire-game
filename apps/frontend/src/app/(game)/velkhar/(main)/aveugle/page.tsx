import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AveugleHub } from './_components/AveugleHub'

import type { Metadata } from 'next'

import './aveugle.css'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auberge')
  return { title: t('metadataTitle') }
}

interface AveuglePageProps {
  searchParams: Promise<{
    campaign?: string | string[]
    character?: string | string[]
    flow?: string | string[]
    intro?: string | string[]
    return?: string | string[]
    transition?: string | string[]
  }>
}

export default async function AveuglePage({ searchParams }: AveuglePageProps) {
  const { campaign, flow, intro, return: returnState, transition } = await searchParams
  const campaignId = typeof campaign === 'string' ? campaign : undefined

  if (flow === 'character-create') {
    redirect(
      campaignId
        ? `/velkhar/character-create?campaign=${encodeURIComponent(campaignId)}`
        : '/velkhar/character-create'
    )
  }

  return (
    <AveugleHub
      campaignId={campaignId}
      isRunReturn={returnState === 'chronicle' || returnState === 'run'}
      previewIntro={intro === 'preview'}
      transitionFromHome={transition === 'home'}
    />
  )
}
