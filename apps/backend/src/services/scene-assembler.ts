import { randomUUID } from 'node:crypto'

import type { AiScenePayload } from '../ai/scene-validator'
import type { Choice, Scene } from '@grimoire/shared'

export interface AssembleSceneInput {
  payload: AiScenePayload
  sessionId: string
  turnNumber: number
}

/**
 * Builds the final `Scene` from the validated AI/stub payload.
 * The backend owns all ids and turn numbering — the AI never provides them.
 */
export function assembleScene({ payload, sessionId, turnNumber }: AssembleSceneInput): Scene {
  const choices: Choice[] = payload.choices.map((choice) => ({
    id: randomUUID(),
    text: choice.text,
    type: choice.type,
    riskLevel: choice.riskLevel,
  }))

  return {
    id: randomUUID(),
    sessionId,
    turnNumber,
    narrative: payload.narrative,
    choices,
    sceneType: payload.sceneType,
    location: payload.location,
    createdAt: new Date().toISOString(),
  }
}
