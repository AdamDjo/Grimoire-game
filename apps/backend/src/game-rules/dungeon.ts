import {
  type ContractDepth,
  type DepthBand,
  type DungeonFloor,
  MAX_CONTRACT_DEPTH,
  type Room,
  type RoomHint,
  type RoomType,
} from '@grimoire/shared'

/**
 * Rooms traversed per floor on the way down. Constant across depths: what grows
 * with depth is danger and reward, never length — the 2h30 ceiling is hard.
 * @see docs/public/raw/23-RUN-STRUCTURE.md §1, §2
 */
export const ROOMS_PER_FLOOR = 3

/**
 * Rooms traversed per floor on the way back. Strictly lower than
 * `ROOMS_PER_FLOOR`: the return is "nettement plus rapide que la descente"
 * because replaying seen ground would be filler and would break the 2h30 cap.
 * @see 23-RUN-STRUCTURE.md §4
 */
export const RETURN_ROOMS_PER_FLOOR = 1

/**
 * Minutes budgeted per room, used by the return estimate.
 *
 * Calibrated against the canon duration table rather than picked round: the
 * shortest contract is the binding one, at 3 floors × 3 rooms of descent plus
 * 3 rooms of return = 12 rooms for its ~45 min target. Deeper contracts then
 * land under their own targets (5 floors ≈ 75 min ≤ 90, 7 floors ≈ 105 ≤ 150),
 * which is what the table asks — those are ceilings, not quotas to fill.
 * @see docs/public/raw/23-RUN-STRUCTURE.md §1 "Barème de durée"
 */
export const MINUTES_PER_ROOM = 3.75

/** A boss locks the far end of deep floors. @see 23-RUN-STRUCTURE.md §2 */
const BOSS_FLOOR_THRESHOLD = 5

/**
 * Maps a floor to the band its scene image is drawn for.
 *
 * The cuts are the bestiary's own (03-BESTIARY §6bis), deliberately not a new
 * scale: the image changes on the same floors where the fauna changes, so what
 * the player sees and what they fight tell one story. Depth comes from the
 * backend-owned run state, never from the AI's prose — a narrator who calls a
 * corridor "abyssal" on floor 1 must not be able to pull the floor-7 art.
 *
 * Out-of-range floors clamp rather than throw: this feeds an image cache, and
 * a bad picture must never be able to fail a turn.
 *
 * @see docs/public/raw/03-BESTIARY.md §6bis
 */
export function depthBandOf(depth: number): DepthBand {
  if (!Number.isFinite(depth) || depth <= 0) return 'surface'
  if (depth <= 2) return 'upper'
  if (depth <= 4) return 'mid'
  if (depth <= 6) return 'deep'
  return 'abyss'
}

/**
 * Room types offered on the way down, ordered from safest to most hostile.
 * `boss` is absent on purpose: it is placed by depth, never drawn at random.
 */
const DESCENT_ROOM_TYPES: readonly RoomType[] = [
  'exploration',
  'encounter',
  'respite',
  'treasure',
  'combat',
]

/**
 * In-character phrasings per hint kind. Several per kind so repeated rooms do
 * not read identically. Each says what the sign *is*, never how bad it gets.
 * @see 23-RUN-STRUCTURE.md §2
 */
const HINT_LABELS: Record<RoomHint['kind'], readonly string[]> = {
  danger: ['Ça sent le sang froid', 'Des marques griffées', 'Un silence qui ne tient pas'],
  loot: ['Un reflet de métal', 'Des sacs éventrés', 'Quelque chose brille au fond'],
  respite: ['Un courant d’air sec', 'De l’eau qui goutte, régulière', 'Une odeur de cendre froide'],
  unknown: ['Le passage s’enfonce', 'Rien ne se lit d’ici', 'L’obscurité avale le seuil'],
}

/** Which kind of sign a room type gives off. */
const HINT_KIND_BY_ROOM: Record<RoomType, RoomHint['kind']> = {
  combat: 'danger',
  boss: 'danger',
  treasure: 'loot',
  respite: 'respite',
  exploration: 'unknown',
  encounter: 'unknown',
}

/** Picks one element from a non-empty list. */
function pick<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)]
}

/**
 * Weight of hostile room types, rising with depth. Deeper floors are "plus
 * dangereux et plus riches" — that curve is what creates the temptation to
 * push on one more floor.
 * @see 23-RUN-STRUCTURE.md §2
 */
function hostileBias(depth: number): number {
  return Math.min(0.15 + depth * 0.1, 0.75)
}

/** Draws a room type for a floor, biased toward hostility as depth grows. */
function rollRoomType(depth: number, rng: () => number): RoomType {
  if (rng() < hostileBias(depth)) {
    return rng() < 0.5 ? 'combat' : 'treasure'
  }
  return pick(DESCENT_ROOM_TYPES, rng)
}

/**
 * Builds the partial clue shown before the player commits to a room.
 *
 * **Rule of the hint**: it reveals the *nature* of what waits, never its
 * *magnitude*. `certainty` says how legible the sign is — a `boss` and a lone
 * scavenger both read as `danger`, and nothing in the hint separates them.
 * That ambiguity is the point: the player chooses informed, not solved.
 * @see 23-RUN-STRUCTURE.md §2
 */
function buildHint(type: RoomType, rng: () => number): RoomHint {
  const kind = HINT_KIND_BY_ROOM[type]
  return {
    kind,
    certainty: rng() < 0.5 ? 'clear' : 'faint',
    label: pick(HINT_LABELS[kind], rng),
  }
}

function buildRoom(id: string, type: RoomType, rng: () => number): Room {
  return { id, type, hint: buildHint(type, rng), cleared: false }
}

/**
 * Generates the floors of a descent for a contract.
 *
 * The 7-floor ceiling is structural, not a validation: `targetDepth` is typed
 * as `ContractDepth` and clamped here too, so the engine cannot produce a run
 * longer than the 2h30 cap even if called with a bad value at runtime.
 * @see 23-RUN-STRUCTURE.md §1, §2, §9
 */
export function generateDescent(
  targetDepth: ContractDepth,
  rng: () => number = Math.random
): DungeonFloor[] {
  const depth = Math.min(targetDepth, MAX_CONTRACT_DEPTH)
  const floors: DungeonFloor[] = []

  for (let level = 1; level <= depth; level++) {
    const rooms: Room[] = []

    for (let index = 0; index < ROOMS_PER_FLOOR; index++) {
      const isLastRoom = index === ROOMS_PER_FLOOR - 1
      // A boss seals the deep floors, and only ever the floor's last room.
      const type = isLastRoom && level >= BOSS_FLOOR_THRESHOLD ? 'boss' : rollRoomType(level, rng)
      rooms.push(buildRoom(`f${level}-r${index + 1}`, type, rng))
    }

    floors.push({
      depth: level,
      rooms,
      // 2-3 onward choices, the most frequent gesture of the game.
      nextChoices: rooms.slice(0, rng() < 0.5 ? 2 : 3).map((room) => room.id),
    })
  }

  return floors
}

/**
 * Generates the trip home from `fromDepth`.
 *
 * Two canon properties hold by construction: the route is **distinct** (fresh
 * room ids and freshly drawn types — never the descent replayed backwards) and
 * **strictly shorter**, since `RETURN_ROOMS_PER_FLOOR < ROOMS_PER_FLOOR`.
 * Floors come back in ascending order, the player climbing toward the surface.
 * @see 23-RUN-STRUCTURE.md §4
 */
export function generateReturn(fromDepth: number, rng: () => number = Math.random): DungeonFloor[] {
  const depth = Math.min(fromDepth, MAX_CONTRACT_DEPTH)
  const floors: DungeonFloor[] = []

  for (let level = depth; level >= 1; level--) {
    const rooms: Room[] = []

    for (let index = 0; index < RETURN_ROOMS_PER_FLOOR; index++) {
      // No boss on the way back: the return kills by attrition, never by ambush.
      rooms.push(buildRoom(`r${level}-r${index + 1}`, rollRoomType(level, rng), rng))
    }

    floors.push({ depth: level, rooms, nextChoices: rooms.map((room) => room.id) })
  }

  return floors
}

/** Total rooms of a descent down to `depth`. */
export function countDescentRooms(depth: number): number {
  return Math.min(depth, MAX_CONTRACT_DEPTH) * ROOMS_PER_FLOOR
}

/** Total rooms of the trip home from `depth`. */
export function countReturnRooms(depth: number): number {
  return Math.min(depth, MAX_CONTRACT_DEPTH) * RETURN_ROOMS_PER_FLOOR
}
