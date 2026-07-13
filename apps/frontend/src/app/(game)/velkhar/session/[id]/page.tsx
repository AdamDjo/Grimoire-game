import { SessionClient } from './_components/SessionClient'
import { MOCK_CHARACTER } from './_data/mock-character'

interface VelkharSessionPageProps {
  params: Promise<{ id: string }>
}

export default async function VelkharSessionPage({ params }: VelkharSessionPageProps) {
  // The `[id]` segment is only a route placeholder — the real session id is
  // owned by the backend and returned by `createSession` inside SessionClient.
  await params

  return <SessionClient initialCharacter={MOCK_CHARACTER} />
}
