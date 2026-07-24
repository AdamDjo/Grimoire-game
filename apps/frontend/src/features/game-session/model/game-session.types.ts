import type { CreateSessionLocaleInput } from '../api/game-session-api'

export type GameSessionRiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'deadly'

export interface GameSessionChoice {
  id: string
  text: string
  type: 'action' | 'dialog' | 'combat' | 'flee' | 'use_item' | 'skill'
  riskLevel?: GameSessionRiskLevel
}

export interface GameSessionDiceRoll {
  critical?: 'success' | 'failure' | null
  modifier: number
  roll: number
  success: boolean
  target: number
  total: number
}

export interface GameSessionInventoryItem {
  allowedActions?: ('use' | 'equip' | 'unequip' | 'inspect')[]
  category?: 'equipment' | 'bag' | 'artifact' | 'heirloom' | 'key'
  description?: string
  equippedSlot?: string
  id: string
  name: string
  quantity: number
  state?: 'ready' | 'locked' | 'pending'
}

export interface GameSessionNotification {
  message: string
}

export interface GameSessionScene {
  choices: GameSessionChoice[]
  consequences?: {
    gameOver?: boolean
  }
  id: string
  imageUrl?: string
  location: string
  narrative: string
  sessionId: string
}

export interface GameSessionResponse {
  diceRoll?: GameSessionDiceRoll
  notifications: GameSessionNotification[]
  scene: GameSessionScene
  source?: 'ai' | 'stub'
  updatedInventory: GameSessionInventoryItem[]
  updatedStats: Record<string, number>
}

export interface GameSessionEndResponse {
  endReason: 'inn' | 'abandon'
  status: 'ended'
}

export interface PendingGameAction {
  choice?: GameSessionChoice
  freeAction?: string
}

export interface GameSessionApi<TResponse extends GameSessionResponse = GameSessionResponse> {
  abandonSession: (sessionId: string) => Promise<GameSessionEndResponse>
  createSession: (input?: CreateSessionLocaleInput) => Promise<TResponse>
  postGameAction: (input: {
    sessionId: string
    choiceId?: string
    chosenActionText?: string
    freeAction?: string
  }) => Promise<TResponse>
}

export interface GameSessionState<
  TWorldState,
  TResponse extends GameSessionResponse = GameSessionResponse,
> {
  endReason: 'death' | 'inn' | 'abandon' | null
  error: string | null
  ending: boolean
  gameOver: boolean
  inventory: GameSessionInventoryItem[]
  limitReached: boolean
  loading: boolean
  online: boolean
  response: TResponse | null
  roll: GameSessionDiceRoll | null
  scene: TResponse['scene'] | null
  sessionId: string | null
  selectedChoiceId: string | null
  source?: GameSessionResponse['source']
  turn: number
  worldState: TWorldState
}
