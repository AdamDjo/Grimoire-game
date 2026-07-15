import { AveugleHub } from '@/components/aveugle-hub/AveugleHub'

import type { Metadata } from 'next'

import './aveugle.css'

export const metadata: Metadata = {
  title: 'L’Auberge de L’Aveugle · GRIMOIRE',
}

interface AveuglePageProps {
  searchParams: Promise<{
    campaign?: string | string[]
    character?: string | string[]
    flow?: string | string[]
    return?: string | string[]
    transition?: string | string[]
  }>
}

export default async function AveuglePage({ searchParams }: AveuglePageProps) {
  const { campaign, character, flow, return: returnState, transition } = await searchParams

  return (
    <AveugleHub
      campaignId={typeof campaign === 'string' ? campaign : undefined}
      characterReadyHint={character === 'ready'}
      isCharacterFlow={flow === 'character-create'}
      isRunReturn={returnState === 'chronicle' || returnState === 'run'}
      transitionFromHome={transition === 'home'}
    />
  )
}
