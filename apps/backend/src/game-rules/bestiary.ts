import type { CreatureId, CreatureStatBlock, CreatureVariant, DamageDice } from '@grimoire/shared'

/**
 * The 18 canon creatures, with numbers.
 *
 * The canon fixes *which* creatures exist, their behaviour, their habitat, their
 * loot and their danger in words ("faible", "élevé", "mortel") — but it never
 * printed HP, AC or damage per creature. The only figures it gives are the
 * enemy AC reference table (`10-COMBAT §4`: civil 8, brigand 11, soldier 14,
 * inquisitor 16, crawling Calciné 12, Watcher 18) and the weapon damage ladder
 * (`08-DICE-RESOLUTION §7`: 1d4 → 1d12). Those are the anchors this table is
 * built on; nothing here is a placeholder awaiting a "real" value later.
 *
 * **How the numbers were derived.** A starting character has `PV = 10 + SANG`,
 * so ≈11 HP, CA 11 in leather, and hits for a short sword + SANG ≈ 4.5 per
 * turn. Two ratios follow, and they are what the whole table is calibrated on:
 *
 * - **HP is read as turns-to-kill.** 6 HP ≈ two player turns, 30 HP ≈ seven.
 * - **Damage is read as turns-to-die.** A creature dealing 1d4 (≈2.5) needs
 *   four turns to drop that character; one dealing 1d10 (≈5.5) needs two.
 *
 * That is why the floor bands of `03-BESTIARY §6bis` land where they do: floors
 * 1-2 hold creatures the player survives seven-plus turns against ("je gère"),
 * floors 5-6 hold ones that kill in three ("je devrais peut-être remonter"),
 * and floor 7 holds ones that kill in two.
 *
 * The two AC values the canon states outright are honoured exactly rather than
 * re-derived: crawling Calciné 12, Watcher 18.
 *
 * @see docs/public/raw/03-BESTIARY.md §2-§6ter
 * @see docs/public/raw/10-COMBAT.md §4
 * @see docs/public/raw/08-DICE-RESOLUTION.md §7
 */
const BESTIARY: Record<CreatureId, CreatureStatBlock> = {
  // ─── 💛 Calcinés (§2) ────────────────────────────────────────────────────
  // The thematic spine: one ladder from "almost still human" to "apocalyptic",
  // spanning the whole depth range on its own.
  calcined_nascent: {
    id: 'calcined_nascent',
    name: 'Calciné naissant',
    tier: 'calcined',
    species: 'calcined',
    habitat: 'anywhere',
    behaviour: 'tragic',
    engagement: 'fight',
    // Still nearly human, and canon says it can hesitate or be terrified —
    // so it is the softest thing in the game that still fights back.
    maxHp: 8,
    armourClass: 10,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['basic_materials'],
    minDepth: 1,
    maxDepth: 3,
  },
  calcined_common: {
    id: 'calcined_common',
    name: 'Calciné courant',
    tier: 'calcined',
    species: 'calcined',
    habitat: 'anywhere',
    behaviour: 'predatory',
    engagement: 'fight',
    // "Force surnaturelle mais sans stratégie": hits above its AC bracket.
    maxHp: 14,
    armourClass: 12, // canon "Calciné rampant" row, taken verbatim
    damage: { count: 1, faces: 6, bonus: 1 },
    loot: ['magic_components'],
    minDepth: 3,
    maxDepth: 5,
  },
  calcined_ancient: {
    id: 'calcined_ancient',
    name: 'Calciné ancien',
    tier: 'calcined',
    species: 'calcined',
    habitat: 'anywhere',
    behaviour: 'territorial',
    engagement: 'fight',
    // "Très résistant, frappe lourd, lent": high HP and damage, and the low
    // initiative that its slowness implies is expressed by attributes, not here.
    maxHp: 30,
    armourClass: 15,
    damage: { count: 1, faces: 10, bonus: 2 },
    loot: ['magic_components', 'minor_artefact'],
    minDepth: 5,
    maxDepth: 7,
  },
  calcined_major: {
    id: 'calcined_major',
    name: 'Calciné majeur',
    tier: 'calcined',
    species: 'calcined',
    habitat: 'anywhere',
    behaviour: 'predatory',
    engagement: 'fight',
    // Floor boss. Kills an unprepared character in two turns — which is the
    // point: "une rencontre qu'on n'oublie pas — si on survit".
    maxHp: 48,
    armourClass: 16,
    damage: { count: 2, faces: 6, bonus: 3 },
    loot: ['magic_components', 'major_artefact'],
    minDepth: 6,
    maxDepth: 7,
  },

  // ─── 🟢 Communes (§3) ────────────────────────────────────────────────────
  // Floors 1-2 fauna. All sit at or below the canon "civil/brigand" AC bracket
  // and none can kill an intact character in under four turns.
  ash_scorpion: {
    id: 'ash_scorpion',
    name: 'Scorpion-à-Cendre',
    tier: 'common',
    species: 'beast',
    habitat: 'tissan',
    behaviour: 'defensive',
    engagement: 'fight',
    // Cat-sized and armoured: hard to land a clean hit on, trivial to kill.
    // "Faible seul, mortel en essaim" — the swarm is the `pack` variant.
    maxHp: 4,
    armourClass: 13,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['basic_materials', 'magic_components'],
    minDepth: 1,
    maxDepth: 3,
  },
  sand_dog: {
    id: 'sand_dog',
    name: 'Chien des Sables',
    tier: 'common',
    species: 'beast',
    habitat: 'tissan',
    behaviour: 'opportunistic',
    engagement: 'fight',
    maxHp: 7,
    armourClass: 12,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['basic_materials'],
    minDepth: 1,
    maxDepth: 3,
  },
  road_serpent: {
    id: 'road_serpent',
    name: 'Serpent des Routes',
    tier: 'common',
    species: 'beast',
    habitat: 'tissan',
    behaviour: 'opportunistic',
    engagement: 'fight',
    // Frail, but its paralysing venom is what actually threatens — carried by
    // combat conditions, not by the damage die.
    maxHp: 5,
    armourClass: 13,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['magic_components', 'basic_materials'],
    minDepth: 1,
    maxDepth: 3,
  },
  ruin_rat: {
    id: 'ruin_rat',
    name: 'Rat des Ruines',
    tier: 'common',
    species: 'beast',
    habitat: 'doigts',
    behaviour: 'opportunistic',
    engagement: 'fight',
    // The weakest entry in the bestiary: canon danger is plainly "faible".
    maxHp: 3,
    armourClass: 10,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['basic_materials'],
    minDepth: 1,
    maxDepth: 2,
  },
  stone_bat: {
    id: 'stone_bat',
    name: 'Chauve-souris de Pierre',
    tier: 'common',
    species: 'beast',
    habitat: 'doigts',
    behaviour: 'opportunistic',
    engagement: 'fight',
    // Silent and airborne: the hardest common to hit, and the flimsiest.
    maxHp: 5,
    armourClass: 14,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['magic_components', 'basic_materials'],
    minDepth: 1,
    maxDepth: 3,
  },
  blade_crab: {
    id: 'blade_crab',
    name: 'Crabe-Lame',
    tier: 'common',
    species: 'beast',
    habitat: 'rivage',
    behaviour: 'defensive',
    engagement: 'fight',
    // "Défensif, attaque si on s'approche de son nid": a shell to break
    // through, and cutting pincers behind it. The shell is its whole identity,
    // so the difficulty sits in AC 15 rather than in the damage — a floor-1
    // creature must never threaten to kill in under four turns.
    maxHp: 11,
    armourClass: 15,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['basic_materials'],
    minDepth: 1,
    maxDepth: 3,
  },

  // ─── 🟡 Rares (§4) ───────────────────────────────────────────────────────
  // Floors 3-4 and up. Each one costs the player something: HP, a resource, or
  // in one case a memory.
  sand_weaver: {
    id: 'sand_weaver',
    name: 'Tisseur de Sable',
    tier: 'rare',
    species: 'beast',
    habitat: 'tissan',
    behaviour: 'predatory',
    engagement: 'fight',
    // "Solitaire, mortel." Massive and ambushing from below: heavy damage,
    // but a broad body that is not hard to hit once it has surfaced. Canon
    // calls it outright deadly, and at 1d10+2 it drops the reference character
    // in two turns — so it belongs to the floors where the player is supposed
    // to wonder whether to climb back out, not to the ones that merely cost.
    maxHp: 26,
    armourClass: 13,
    damage: { count: 1, faces: 10, bonus: 2 },
    loot: ['magic_components', 'rare_metals'],
    minDepth: 5,
    maxDepth: 7,
  },
  grey_wind: {
    id: 'grey_wind',
    name: 'Vent-Gris',
    tier: 'rare',
    species: 'archontic',
    habitat: 'tissan',
    behaviour: 'evental',
    engagement: 'hazard',
    // Not a creature but a cloud. Canon is explicit: « on ne le combat pas —
    // on le fuit ». Giving it HP would invite the player to attack mist and
    // lose, so it has none and no AC worth rolling against; the engine must
    // route it to flight and Calamine, never to an attack exchange.
    maxHp: 0,
    armourClass: 0,
    damage: { count: 2, faces: 6, bonus: 0 },
    loot: ['magic_components'],
    minDepth: 3,
    maxDepth: 7,
  },
  watcher: {
    id: 'watcher',
    name: 'Veilleur',
    tier: 'rare',
    species: 'archontic',
    habitat: 'doigts',
    behaviour: 'territorial',
    engagement: 'fight',
    // AC 18 is canon, stated outright in the enemy table — the single hardest
    // thing to hit in the game, stone and metal. "Très résistant, frappe lourd."
    // Canon also notes it is immune to Intimidation: an automaton has no fear.
    maxHp: 34,
    armourClass: 18,
    damage: { count: 1, faces: 12, bonus: 2 },
    loot: ['rare_metals', 'minor_artefact'],
    minDepth: 5,
    maxDepth: 7,
  },
  memory_eater: {
    id: 'memory_eater',
    name: 'Mangeur de Souvenir',
    tier: 'rare',
    species: 'beast',
    habitat: 'marais',
    behaviour: 'predatory',
    engagement: 'drain',
    // "Terrifiant non par sa force mais par son effet." Deliberately the
    // weakest damage of any rare: what it costs the player is a memory, not HP.
    maxHp: 18,
    armourClass: 13,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['rare_metals'],
    minDepth: 4,
    maxDepth: 6,
  },
  revenant: {
    id: 'revenant',
    name: 'Revenant',
    tier: 'rare',
    species: 'archontic',
    habitat: 'anywhere',
    behaviour: 'tragic',
    engagement: 'fight',
    // Canon flags this one for V1.1 detail, so it stays mid-bracket by
    // construction: no invented signature effect, only honest numbers. Rated
    // 🟡 rare rather than lethal, so it must not kill in two turns on floor 3 —
    // that reading belongs to the Calcinés and the Veilleur, deeper down.
    maxHp: 20,
    armourClass: 14,
    damage: { count: 1, faces: 8, bonus: 0 },
    loot: ['magic_components'],
    minDepth: 3,
    maxDepth: 6,
  },
  shore_beast: {
    id: 'shore_beast',
    name: 'Bête de Rivage',
    tier: 'rare',
    species: 'beast',
    habitat: 'rivage',
    behaviour: 'predatory',
    engagement: 'fight',
    // Same V1.1 caveat as the Revenant; a mutant brawler, so more HP but
    // easier to hit. Canon rates it "élevé", not "mortel", so it stays on the
    // costly floors rather than the ones that end runs.
    maxHp: 24,
    armourClass: 12,
    damage: { count: 1, faces: 8, bonus: 0 },
    loot: ['basic_materials', 'rare_metals'],
    minDepth: 3,
    maxDepth: 6,
  },

  // ─── 🔴 Légendaires (§5) ─────────────────────────────────────────────────
  // Floor 7 only. The anti-rule of §6bis is enforced by `minDepth`, not by
  // trusting the encounter roller to behave.
  heart_of_sand: {
    id: 'heart_of_sand',
    name: 'Le Cœur de Sable',
    tier: 'legendary',
    species: 'archontic',
    habitat: 'tissan',
    behaviour: 'territorial',
    engagement: 'fight',
    // A living mass of crystallised Ash: enormous HP, and slow enough to be
    // hittable. The run either ends here or is won here.
    maxHp: 70,
    armourClass: 15,
    damage: { count: 2, faces: 8, bonus: 3 },
    loot: ['major_artefact', 'magic_components'],
    minDepth: 7,
    maxDepth: 7,
  },
  watcher_king: {
    id: 'watcher_king',
    name: 'Le Veilleur-Roi',
    tier: 'legendary',
    species: 'archontic',
    habitat: 'doigts',
    behaviour: 'territorial',
    engagement: 'fight',
    // The oldest Watcher, near-conscious. Keeps the Watcher's AC 18 and
    // outclasses it on every other axis.
    maxHp: 60,
    armourClass: 18,
    damage: { count: 2, faces: 6, bonus: 4 },
    loot: ['major_artefact', 'rare_metals'],
    minDepth: 7,
    maxDepth: 7,
  },

  // ─── 🧍 Humans (10-COMBAT §4, §8) ────────────────────────────────────────
  // These four are the only enemies whose AC the canon states outright, so
  // unlike everything above, their AC is quoted rather than derived — they are
  // the anchors the rest of the table was calibrated against.
  //
  // Their `tier` is the one field with no canon backing: `03-BESTIARY` never
  // ranks humans, because they belong to the world rather than to the
  // bestiary's danger ladder. It is set from the danger they actually pose to a
  // starting character, which is what `tier` is used for elsewhere.
  //
  // `habitat: 'anywhere'` is literal, not a shrug: people are met on roads, in
  // ruins and in towns alike. What keeps them off the deep floors is
  // `maxDepth` — an Inquisitor patrolling floor 7 alongside a Watcher-King
  // would be a scene the world does not support.
  civilian: {
    id: 'civilian',
    name: 'Civil',
    tier: 'common',
    species: 'human',
    habitat: 'anywhere',
    // Fights only when cornered, and badly. Canon AC 8 — the floor of the
    // whole scale, and the only enemy a starting character outclasses outright.
    behaviour: 'defensive',
    engagement: 'fight',
    maxHp: 5,
    armourClass: 8,
    damage: { count: 1, faces: 4, bonus: 0 },
    loot: ['basic_materials'],
    minDepth: 1,
    maxDepth: 2,
  },
  brigand: {
    id: 'brigand',
    name: 'Brigand',
    tier: 'common',
    species: 'human',
    habitat: 'anywhere',
    // Canon puts brigands in ambushes (§2) and in dungeon fights
    // (11-INVENTORY §507); they pick their moment and rob rather than hunt.
    behaviour: 'opportunistic',
    engagement: 'fight',
    // Canon AC 11. ~10 HP is two-to-three player turns: a fair fight, which is
    // exactly what a road robbery should be.
    //
    // 1d6 with no bonus is deliberate: a brigand is met from floor 1, and the
    // « je gère » band forbids anything that can drop an intact character in
    // under four turns. A flat +1 would break that by itself.
    maxHp: 10,
    armourClass: 11,
    damage: { count: 1, faces: 6, bonus: 0 },
    loot: ['basic_materials', 'rare_metals'],
    // Floor 3 up, not floor 1: an armed man who chose to rob you kills a fresh
    // character in ~3 turns, which is the « ça coûte » band, not « je gère ».
    minDepth: 3,
    maxDepth: 5,
  },
  soldier: {
    id: 'soldier',
    name: 'Soldat équipé',
    tier: 'common',
    species: 'human',
    habitat: 'anywhere',
    behaviour: 'territorial',
    engagement: 'fight',
    // Canon AC 14. Trained and armoured: the point where a starting character
    // stops winning by trading blows and has to use the tactical actions.
    // 1d8 flat kills in ~2.4 turns, which is the deep end of « ça coûte »
    // without crossing into the two-turn band reserved for floors 5+.
    maxHp: 16,
    armourClass: 14,
    damage: { count: 1, faces: 8, bonus: 0 },
    loot: ['basic_materials', 'rare_metals'],
    minDepth: 4,
    maxDepth: 6,
  },
  inquisitor: {
    id: 'inquisitor',
    name: 'Inquisiteur',
    tier: 'rare',
    species: 'human',
    habitat: 'anywhere',
    // Hunts undeclared Tisse-Verbe (12-NPCS §90): he comes looking for you.
    behaviour: 'predatory',
    engagement: 'fight',
    // Canon AC 16 — above a Watcher's peer and second only to it. Canon also
    // prices his purse at 50 🪙 (11-INVENTORY §120), the richest human loot.
    maxHp: 26,
    armourClass: 16,
    damage: { count: 1, faces: 10, bonus: 3 },
    loot: ['rare_metals', 'magic_components', 'minor_artefact'],
    // Floors 5+, with the things that kill in two turns. Canon rates him the
    // second-hardest AC in the game and a « Légendaire » DC 25 even to talk
    // down (08-DICE §32) — meeting him early would be the unseeable death.
    minDepth: 5,
    maxDepth: 7,
  },
}

/** Returns the canon stat block of a creature. */
export function getCreature(id: CreatureId): CreatureStatBlock {
  return BESTIARY[id]
}

/** Every creature of the bestiary, in canon order. */
export function listCreatures(): CreatureStatBlock[] {
  return Object.values(BESTIARY)
}

/**
 * Creatures that may legitimately appear on a floor.
 *
 * The canon anti-rule — never a legendary on floors 1-2, "même pour la
 * surprise" — holds here by construction rather than by the caller's goodwill:
 * a death on floor 2 to something off-scale is exactly the death the player
 * could not have seen coming.
 *
 * @see 03-BESTIARY.md §6bis
 */
export function creaturesForDepth(depth: number): CreatureStatBlock[] {
  return listCreatures().filter(
    (creature) => depth >= creature.minDepth && depth <= creature.maxDepth
  )
}

/**
 * Creatures the return trip may draw from.
 *
 * The way back is shorter, not gentler: it pulls from the fauna of floors
 * *already traversed* and never anything deeper. What makes the climb dangerous
 * is the player's own state — spent HP, worn gear, counted water — not a
 * harder creature.
 *
 * @see 03-BESTIARY.md §6bis "Sur le trajet de retour"
 */
export function creaturesForReturn(deepestDepth: number): CreatureStatBlock[] {
  return listCreatures().filter((creature) => creature.minDepth <= deepestDepth)
}

/** Fraction of max HP kept by the `pack` variant. @see 03-BESTIARY §6ter */
const PACK_HP_RATIO = 0.7

/** Fraction of max HP kept by the `wounded` variant. @see 03-BESTIARY §6ter */
const WOUNDED_HP_RATIO = 0.6

/**
 * Applies one controlled variant to a stat block.
 *
 * Enforces the first canon guardrail structurally: the signature takes a single
 * variant, so "Calciné ancien affamé en meute" cannot be expressed. The second
 * guardrail (always announced before the first turn) belongs to the encounter
 * builder, and the third (backend applies, AI describes) is this function
 * existing at all.
 *
 * `saturated` changes no number here — it inflicts Calamine on contact, which
 * is resolved when a hit lands, not when the creature is built.
 *
 * @see 03-BESTIARY.md §6ter
 */
export function applyVariant(
  creature: CreatureStatBlock,
  variant: CreatureVariant | null
): CreatureStatBlock {
  if (!variant) {
    return creature
  }

  switch (variant) {
    case 'hungry':
      // "Il attaque sans prudence": hits harder, guards worse.
      return {
        ...creature,
        damage: addDamageBonus(creature.damage, 2),
        armourClass: Math.max(0, creature.armourClass - 2),
      }
    case 'pack':
      // Individual HP drops because the *number* doubles; the encounter
      // builder owns the count, this only weakens each body.
      return { ...creature, maxHp: scaleHp(creature.maxHp, PACK_HP_RATIO) }
    case 'wounded':
      return { ...creature, maxHp: scaleHp(creature.maxHp, WOUNDED_HP_RATIO) }
    case 'ancient':
      // The extra combat condition is applied by the encounter builder, which
      // owns the condition list; here only the AC is the creature's own.
      return { ...creature, armourClass: creature.armourClass + 2 }
    case 'saturated':
      return creature
  }
}

/** Adds a flat bonus to a damage expression, leaving `null` damage alone. */
function addDamageBonus(damage: DamageDice | null, bonus: number): DamageDice | null {
  return damage ? { ...damage, bonus: damage.bonus + bonus } : null
}

/**
 * Scales max HP, never below 1: a variant makes a creature frail, never
 * already-dead, and a 0 HP body would end the fight before it started.
 */
function scaleHp(maxHp: number, ratio: number): number {
  return Math.max(1, Math.round(maxHp * ratio))
}
