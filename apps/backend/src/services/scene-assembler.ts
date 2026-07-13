import { randomUUID } from 'node:crypto'

import type { AiScenePayload } from '../ai/scene-validator'
import type { Choice, ChoiceConsequence, Scene } from '@grimoire/shared'

export interface AssembleSceneInput {
  payload: AiScenePayload
  sessionId: string
  turnNumber: number
  /** Mechanical consequences resolved by the backend for this turn, if any. */
  consequences?: ChoiceConsequence
}

/**
 * Builds the final `Scene` from the validated AI/stub payload.
 * The backend owns all ids, turn numbering and consequences — the AI never
 * provides them, it only narrates.
 */
export function assembleScene({
  payload,
  sessionId,
  turnNumber,
  consequences,
}: AssembleSceneInput): Scene {
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
    ...(consequences ? { consequences } : {}),
    sceneType: payload.sceneType,
    location: payload.location,
    createdAt: new Date().toISOString(),
  }
}
