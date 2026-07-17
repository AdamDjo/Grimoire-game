import { type Attributes, getPeople, getVocation, maxHpFromBlood } from '@grimoire/shared'

import { Prisma } from '../generated/prisma/client'
import { prisma } from '../lib/prisma'

import type { Character as DbCharacter } from '../generated/prisma/client'

/** Postgres unique-constraint violation error code (`Character_userId_key`). */
const UNIQUE_CONSTRAINT_VIOLATION = 'P2002'

/**
 * Default host vocation for a free concept whose host the AI hasn't resolved
 * yet (`07-CHARACTER-CREATION.md` §2 step 4 — "the AI identifies the host
 * vocation"). No such resolution step is implemented server-side today, so an
 * empty `vocationId` falls back to `watcher`, mirroring the frontend hub's own
 * fallback (`aveugle-hub-model.ts`: `vocation?.id ?? 'watcher'`).
 */
const DEFAULT_HOST_VOCATION_ID = 'watcher'

export class InvalidCharacterInputError extends Error {}

export interface CreateCharacterServiceInput {
  name: string
  peopleId: string
  vocationId?: string
  freeConcept?: string
  backstory?: string
}

/** Derives blood/breath/ash + maxHp from a people + vocation pair (canon triptyque). */
export function deriveAttributes(
  peopleId: string,
  vocationId: string
): { attributes: Attributes; maxHp: number } {
  const vocation = getVocation(vocationId)
  const people = getPeople(peopleId)
  if (!vocation || !people) {
    throw new InvalidCharacterInputError('Unknown people or vocation id')
  }

  const attributes: Attributes = {
    blood: vocation.baseAttributes.blood + (people.attributeBonus.blood ?? 0),
    breath: vocation.baseAttributes.breath + (people.attributeBonus.breath ?? 0),
    ash: vocation.baseAttributes.ash + (people.attributeBonus.ash ?? 0),
  }

  return { attributes, maxHp: maxHpFromBlood(attributes.blood) }
}

/**
 * Creates the player's `Character` from their Forge draft, or returns their
 * existing one — idempotent, mirroring `getOrCreateSession`'s
 * `findFirst ?? create` pattern (one character per user for now, no
 * multi-character roster yet).
 */
export async function createCharacter(
  userId: string,
  input: CreateCharacterServiceInput
): Promise<DbCharacter> {
  const existing = await prisma.character.findFirst({ where: { userId } })
  if (existing) {
    return existing
  }

  const vocationId = input.vocationId ?? DEFAULT_HOST_VOCATION_ID
  const { attributes, maxHp } = deriveAttributes(input.peopleId, vocationId)

  try {
    return await prisma.character.create({
      data: {
        userId,
        name: input.name,
        people: input.peopleId,
        vocation: vocationId,
        freeConcept: input.freeConcept ?? null,
        backstory: input.backstory ?? null,
        blood: attributes.blood,
        breath: attributes.breath,
        ash: attributes.ash,
        hp: maxHp,
        maxHp,
        thirst: 100,
        hunger: 100,
        energy: 100,
        calamine: 0,
        conditions: [],
      },
    })
  } catch (err) {
    // Two concurrent requests can both pass the findFirst check above before
    // either write lands — the DB's unique constraint on userId is the real
    // guard, this just recovers the same idempotent result instead of erroring.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === UNIQUE_CONSTRAINT_VIOLATION
    ) {
      const raceWinner = await prisma.character.findFirst({ where: { userId } })
      if (raceWinner) {
        return raceWinner
      }
    }
    throw err
  }
}
