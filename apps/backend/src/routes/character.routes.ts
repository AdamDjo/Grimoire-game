import { type Request, type Response, Router } from 'express'

import { createCharacter, InvalidCharacterInputError } from '../services/character.service'

import { createCharacterSchema } from './character.schema'

import type { ApiResponse, Character } from '@grimoire/shared'

export const characterRouter: Router = Router()

/**
 * POST /api/character
 * Creates the player's character from their Forge draft (`CharacterCreateFlow`).
 * Idempotent: replaying with an existing character returns that character
 * unchanged rather than erroring or duplicating (mirrors `getOrCreateSession`).
 */
characterRouter.post('/', async (req: Request, res: Response<ApiResponse<Character>>) => {
  const parsed = createCharacterSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    })
    return
  }

  try {
    const character = await createCharacter(req.auth!.userId, {
      name: parsed.data.name,
      peopleId: parsed.data.peopleId,
      vocationId: parsed.data.vocationId,
      freeConcept: parsed.data.freeConcept,
      backstory: parsed.data.backstory,
    })

    const data: Character = {
      id: character.id,
      userId: character.userId,
      name: character.name,
      people: character.people,
      vocation: character.vocation,
      freeConcept: character.freeConcept ?? undefined,
      backstory: character.backstory ?? undefined,
      avatarUrl: character.avatarUrl ?? undefined,
      stats: {
        attributes: { blood: character.blood, breath: character.breath, ash: character.ash },
        survival: {
          hp: character.hp,
          maxHp: character.maxHp,
          thirst: character.thirst,
          hunger: character.hunger,
          energy: character.energy,
          calamine: character.calamine,
          isDying: character.isDying,
          neglectStreak: character.neglectStreak,
        },
        conditions: [],
        inventory: [],
      },
      createdAt: character.createdAt.toISOString(),
    }

    res.json({ success: true, data })
  } catch (err) {
    if (err instanceof InvalidCharacterInputError) {
      res.status(400).json({ success: false, error: err.message })
      return
    }
    throw err
  }
})
