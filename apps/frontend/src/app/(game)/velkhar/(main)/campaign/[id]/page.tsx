import { notFound, redirect } from 'next/navigation'

import {
  getCampaignResumeSnapshot,
  resolveCampaignDestination,
} from '@/features/campaign-resume/campaign-resume'

interface CampaignPageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params
  const snapshot = getCampaignResumeSnapshot(id)

  if (!snapshot) notFound()

  redirect(resolveCampaignDestination(snapshot))
}
