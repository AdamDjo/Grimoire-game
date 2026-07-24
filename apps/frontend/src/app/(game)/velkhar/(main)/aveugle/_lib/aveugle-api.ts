import type {
  ApiResponse,
  AveugleExchangeType,
  AveugleHubState,
  AveugleTalkResponse,
  Souvenir,
  SpendSouvenirResponse,
} from '@grimoire/shared'

export class AveugleApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'AveugleApiError'
  }
}

async function readApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null
  if (!response.ok || !body?.success || body.data === undefined) {
    throw new AveugleApiError(body?.error ?? 'The Blind One is unavailable', response.status)
  }

  return body.data
}

export async function getAveugleHub(): Promise<AveugleHubState> {
  const response = await fetch('/api/aveugle/hub', { cache: 'no-store' })
  return readApiResponse<AveugleHubState>(response)
}

export async function getSouvenirs(): Promise<Souvenir[]> {
  const response = await fetch('/api/souvenirs', { cache: 'no-store' })
  return readApiResponse<Souvenir[]>(response)
}

export async function markAveugleTopicSeen(topicId: string): Promise<void> {
  const response = await fetch(`/api/aveugle/topics/${encodeURIComponent(topicId)}/seen`, {
    method: 'POST',
  })
  await readApiResponse<null>(response)
}

export async function talkToAveugle(message: string): Promise<AveugleTalkResponse> {
  const response = await fetch('/api/aveugle/talk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  return readApiResponse<AveugleTalkResponse>(response)
}

export async function spendSouvenir(
  souvenirId: string,
  exchangeType: AveugleExchangeType
): Promise<SpendSouvenirResponse> {
  const response = await fetch(`/api/aveugle/souvenirs/${encodeURIComponent(souvenirId)}/spend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exchangeType }),
  })
  return readApiResponse<SpendSouvenirResponse>(response)
}
