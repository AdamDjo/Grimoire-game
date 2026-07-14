import { redirect } from 'next/navigation'

interface VelkharCharacterCreatePageProps {
  searchParams: Promise<{ campaign?: string | string[] }>
}

export default async function VelkharCharacterCreatePage({
  searchParams,
}: VelkharCharacterCreatePageProps) {
  const { campaign } = await searchParams
  const campaignId = typeof campaign === 'string' ? campaign : undefined
  const destination = campaignId
    ? `/velkhar/aveugle?flow=character-create&campaign=${encodeURIComponent(campaignId)}`
    : '/velkhar/aveugle?flow=character-create'

  redirect(destination)
}
