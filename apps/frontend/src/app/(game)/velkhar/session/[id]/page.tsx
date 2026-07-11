import { SessionClient } from './_components/SessionClient'
import { MOCK_CHARACTER } from './_data/mock-character'

interface VelkharSessionPageProps {
  params: Promise<{ id: string }>
}

export default async function VelkharSessionPage({ params }: VelkharSessionPageProps) {
  const { id } = await params

  return <SessionClient sessionId={id} initialCharacter={MOCK_CHARACTER} />
}
