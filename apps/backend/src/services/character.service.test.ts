import { beforeEach, describe, expect, it, vi } from 'vitest'

const characterFindFirst = vi.fn()
const characterCreate = vi.fn((args: { data: Record<string, unknown> }) => ({
  id: 'char1',
  ...args.data,
}))
vi.mock('../lib/prisma', () => ({
  prisma: {
    character: { findFirst: characterFindFirst, create: characterCreate },
  },
}))

const { createCharacter, deriveAttributes, InvalidCharacterInputError } =
  await import('./character.service')
const { Prisma } = await import('../generated/prisma/client')

function uniqueConstraintError(): InstanceType<typeof Prisma.PrismaClientKnownRequestError> {
  return new Prisma.PrismaClientKnownRequestError(
    'Unique constraint failed on the fields: (`userId`)',
    {
      code: 'P2002',
      clientVersion: 'test',
    }
  )
}

describe('deriveAttributes', () => {
  it('sums the vocation base attributes with the people bonus (canon triptyque)', () => {
    // salt-walker: blood 14 / breath 10 / ash 10 — sahelin: +1 blood.
    const { attributes, maxHp } = deriveAttributes('sahelin', 'salt-walker')

    expect(attributes).toEqual({ blood: 15, breath: 10, ash: 10 })
    // maxHp = 10 + modifier(15) = 10 + 2.
    expect(maxHp).toBe(12)
  })

  it('applies a negative people bonus (changepeau: +1 breath, -1 ash)', () => {
    const { attributes } = deriveAttributes('changepeau', 'word-weaver')

    // word-weaver: blood 9 / breath 11 / ash 14.
    expect(attributes).toEqual({ blood: 9, breath: 12, ash: 13 })
  })

  it('throws InvalidCharacterInputError for an unknown people id', () => {
    expect(() => deriveAttributes('unknown-people', 'salt-walker')).toThrow(
      InvalidCharacterInputError
    )
  })

  it('throws InvalidCharacterInputError for an unknown vocation id', () => {
    expect(() => deriveAttributes('sahelin', 'unknown-vocation')).toThrow(
      InvalidCharacterInputError
    )
  })
})

describe('createCharacter', () => {
  beforeEach(() => {
    characterFindFirst.mockReset()
    characterCreate.mockClear()
  })

  it('creates a character with attributes derived from people + vocation', async () => {
    characterFindFirst.mockResolvedValue(null)

    const character = await createCharacter('user1', {
      name: 'Kael Vane',
      peopleId: 'rivain',
      vocationId: 'shadow-blade',
    })

    expect(characterCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user1',
        name: 'Kael Vane',
        people: 'rivain',
        vocation: 'shadow-blade',
        freeConcept: null,
        backstory: null,
        // shadow-blade: blood 10 / breath 14 / ash 10 — rivain: +1 ash.
        blood: 10,
        breath: 14,
        ash: 11,
        hp: 10,
        maxHp: 10,
        thirst: 100,
        hunger: 100,
        energy: 100,
        calamine: 0,
        conditions: [],
      },
    })
    expect(character).toMatchObject({ name: 'Kael Vane', vocation: 'shadow-blade' })
  })

  it('is idempotent: returns the existing character instead of creating a new one', async () => {
    const existing = { id: 'char1', userId: 'user1', name: 'Existing' }
    characterFindFirst.mockResolvedValue(existing)

    const character = await createCharacter('user1', {
      name: 'Someone Else',
      peopleId: 'sahelin',
      vocationId: 'salt-walker',
    })

    expect(character).toBe(existing)
    expect(characterCreate).not.toHaveBeenCalled()
  })

  it('falls back to the watcher host vocation when vocationId is empty (unresolved free concept)', async () => {
    characterFindFirst.mockResolvedValue(null)

    await createCharacter('user1', {
      name: 'A Free Concept',
      peopleId: 'sahelin',
      freeConcept: 'A vieille chasseuse de Calcinés, lasse.',
    })

    const [[{ data: watcherCallData }]] = characterCreate.mock.calls as [
      [{ data: { vocation: string; freeConcept: string | null } }],
    ]
    expect(watcherCallData.vocation).toBe('watcher')
    expect(watcherCallData.freeConcept).toBe('A vieille chasseuse de Calcinés, lasse.')
  })

  it('persists null for freeConcept/backstory when not provided', async () => {
    characterFindFirst.mockResolvedValue(null)

    await createCharacter('user1', {
      name: 'Plain Preset',
      peopleId: 'sahelin',
      vocationId: 'salt-walker',
    })

    const [[{ data: plainCallData }]] = characterCreate.mock.calls as [
      [{ data: { freeConcept: string | null; backstory: string | null } }],
    ]
    expect(plainCallData.freeConcept).toBeNull()
    expect(plainCallData.backstory).toBeNull()
  })

  it('throws InvalidCharacterInputError when the people or vocation id is unknown', async () => {
    characterFindFirst.mockResolvedValue(null)

    await expect(
      createCharacter('user1', { name: 'Ghost', peopleId: 'nowhere', vocationId: 'salt-walker' })
    ).rejects.toThrow(InvalidCharacterInputError)
    expect(characterCreate).not.toHaveBeenCalled()
  })

  it('recovers the race winner when a concurrent request already created the character', async () => {
    const raceWinner = { id: 'char1', userId: 'user1', name: 'Race Winner' }
    characterFindFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(raceWinner)
    characterCreate.mockImplementationOnce(() => {
      throw uniqueConstraintError()
    })

    const character = await createCharacter('user1', {
      name: 'Someone Else',
      peopleId: 'sahelin',
      vocationId: 'salt-walker',
    })

    expect(character).toBe(raceWinner)
    expect(characterFindFirst).toHaveBeenCalledTimes(2)
  })

  it('rethrows a P2002 error when no character can be found after the conflict', async () => {
    characterFindFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null)
    characterCreate.mockImplementationOnce(() => {
      throw uniqueConstraintError()
    })

    await expect(
      createCharacter('user1', {
        name: 'Ghost Race',
        peopleId: 'sahelin',
        vocationId: 'salt-walker',
      })
    ).rejects.toThrow(Prisma.PrismaClientKnownRequestError)
  })
})
