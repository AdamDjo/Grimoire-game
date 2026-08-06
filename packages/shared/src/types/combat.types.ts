/**
 * Combat contracts — the shape of a fight: who is in it, whose turn it is, and
 * how it ends.
 *
 * Two invariants hold this file together, and both are structural rather than
 * documented: the bestiary is a closed set (`CreatureId`), and so is the list
 * of modifiers that may be applied to it (`CreatureVariant`). An AI that
 * invents a creature or a modifier produces something this file cannot
 * represent, so it cannot reach the engine.
 *
 * @see docs/public/raw/10-COMBAT.md
 * @see docs/public/raw/03-BESTIARY.md
 */

import type { ActiveCondition, Attributes } from "./character.types";

/**
 * Danger tiers. `calcined` sits apart from the danger ladder on purpose: a
 * Calciné ranges from weak to lethal depending on its stage, so its threat is
 * carried by the creature, not by the tier.
 * @see 03-BESTIARY.md §1
 */
export type CreatureTier = "common" | "rare" | "legendary" | "calcined";

/**
 * Where a creature is native. Deliberately not the scene `Biome` of
 * `scene.types.ts`: that one names a *place* and drives image caching, this one
 * is a *placement rule* for the bestiary — hence `anywhere`, which the Calcinés
 * and the Revenant need and which no image could ever depict.
 * @see 03-BESTIARY.md §6
 */
export type CreatureHabitat =
  | "tissan"
  | "doigts"
  | "rivage"
  | "marais"
  | "anywhere";

/**
 * The bestiary, closed. These 18 are *the* list — the AI draws from it and
 * never adds to it.
 *
 * Not a style rule: a creature invented on the fly has no AC, no HP, no
 * behaviour and no loot, so the backend cannot arbitrate it and the player
 * cannot learn to fight it. Knowledge meta-progression only has value if the
 * creature met on run 8 is the same one met on run 3.
 *
 * @see 03-BESTIARY.md §6
 */
export type CreatureId =
  // 💛 Calcinés — the four stages (§2)
  | "calcined_nascent"
  | "calcined_common"
  | "calcined_ancient"
  | "calcined_major"
  // 🟢 Common (§3)
  | "ash_scorpion"
  | "sand_dog"
  | "road_serpent"
  | "ruin_rat"
  | "stone_bat"
  | "blade_crab"
  // 🟡 Rare (§4)
  | "sand_weaver"
  | "grey_wind"
  | "watcher"
  | "memory_eater"
  | "revenant"
  | "shore_beast"
  // 🔴 Legendary bosses (§5)
  | "heart_of_sand"
  | "watcher_king";

/**
 * How a creature acts, which is what the AI narrates. Behaviour is data, not
 * prose: `evental` in particular marks a creature that is not fought at all —
 * the Vent-Gris is escaped, never beaten.
 * @see 03-BESTIARY.md §8
 */
export type CreatureBehaviour =
  | "opportunistic"
  | "defensive"
  | "territorial"
  | "predatory"
  | "evental"
  | "tragic";

/**
 * Loot tiers, feeding the equipment system rather than naming items directly.
 * @see 03-BESTIARY.md §7
 */
export type LootTier =
  | "basic_materials"
  | "magic_components"
  | "rare_metals"
  | "minor_artefact"
  | "major_artefact";

/**
 * The five controlled variants, closed. 18 creatures repeated across dozens of
 * runs would wear thin; the answer is bounded modification, never invention.
 *
 * Three canon guardrails govern them, enforced in `game-rules/bestiary.ts`:
 * only one variant at a time (no "ancient hungry pack"), always announced
 * before the first turn (an invisible variant is a trap, not a variation), and
 * applied by the backend while the AI only describes it.
 *
 * @see 03-BESTIARY.md §6ter
 */
export type CreatureVariant =
  | "hungry"
  | "pack"
  | "saturated"
  | "wounded"
  | "ancient";

/**
 * A damage expression, as `NdM` plus a flat bonus. Kept as data rather than a
 * rolled number so the backend rolls it — the AI never states damage, it only
 * narrates the result the engine already decided.
 * @see docs/public/raw/08-DICE-RESOLUTION.md §7
 */
export interface DamageDice {
  /** Number of dice. */
  count: number;
  /** Faces per die — the canon weapon ladder, 4 to 12. */
  faces: number;
  /** Flat modifier added after the roll. Usually 0 for creatures. */
  bonus: number;
}

/**
 * How a creature must be engaged. Most are simply fought; two canon entries are
 * not, and flattening them into stat sacks would lose exactly what makes them
 * memorable.
 *
 * - `fight` — the default: rolls to hit, takes damage, dies.
 * - `hazard` — cannot be defeated at all. The Grey Wind is "not a creature but
 *   a cloud"; canon says outright « on ne le combat pas — on le fuit ». It has
 *   no HP because attacking mist is not a thing the engine should let you
 *   attempt and then lose to.
 * - `drain` — fought normally, but its threat is an effect rather than damage.
 *   The Memory Eater is "terrifying not by its strength but by its effect".
 *
 * @see 03-BESTIARY.md §4
 */
export type CreatureEngagement = "fight" | "hazard" | "drain";

/**
 * The canon stat block of one bestiary entry — the fixed sheet an encounter is
 * instantiated from, as opposed to `CombatEnemy` which is one live instance of
 * it inside a fight.
 *
 * Every field here is decided by the backend and merely *described* by the AI.
 * Numbers are calibrated against the two canon anchors — a starting character
 * has `PV = 10 + SANG` (≈11 HP) and CA 11 in leather (`10-COMBAT §4`) — so a
 * creature's HP and damage read directly as "how many turns before this kills
 * me", which is the only scale the player actually feels.
 *
 * @see 03-BESTIARY.md §6, §6bis
 * @see 10-COMBAT.md §4
 */
export interface CreatureStatBlock {
  id: CreatureId;
  /** Canon display name, in the game's French copy. */
  name: string;
  tier: CreatureTier;
  habitat: CreatureHabitat;
  behaviour: CreatureBehaviour;
  engagement: CreatureEngagement;
  /** Base hit points, before any variant is applied. */
  maxHp: number;
  /** Armour class, on the same scale as the canon enemy table (8 → 18). */
  armourClass: number;
  /** Damage dealt on a hit. `null` only for creatures that deal none directly. */
  damage: DamageDice | null;
  /** What it drops, by tier rather than by named item. */
  loot: LootTier[];
  /**
   * Floors this creature may be drawn on, inclusive. Enforces the canon
   * anti-rule — never a legendary on floors 1-2 — structurally rather than by
   * convention: a death on floor 2 to an off-scale boss is precisely the death
   * the player could not see coming.
   * @see 03-BESTIARY.md §6bis
   */
  minDepth: number;
  maxDepth: number;
}

/**
 * The four action categories a player picks from on their turn. Commanding is
 * the design keystone: ash is not merely a social attribute, it is a tactical
 * support role.
 * @see 10-COMBAT.md §3, §5
 */
export type CombatActionCategory = "attack" | "defend" | "command" | "artefact";

/**
 * What the player actually does on a turn. Wider than the categories above
 * because fleeing and item use end or interrupt a fight rather than being one
 * of its four tactical moves.
 * @see 10-COMBAT.md §3, §7
 */
export type CombatAction =
  | "attack"
  | "defend"
  | "command"
  | "awaken_artefact"
  | "use_item"
  | "flee";

/**
 * Fleeing has a direction — this is what turns a losing fight into a decision
 * instead of a punishment. Forward avoids the fight but sinks one floor
 * deeper, lengthening the way home; backward starts the climb.
 * @see 10-COMBAT.md §7
 */
export type FleeDirection = "forward" | "backward";

/**
 * Conditions specific to a fight, on top of the survival conditions of
 * `ConditionId`. Kept separate because these live and die inside a single
 * combat: they are cleared when it ends, and never persist onto the run.
 * @see 10-COMBAT.md §6
 */
export type CombatConditionId =
  | "engaged"
  | "flanked"
  | "disarmed"
  | "frightened"
  | "dazed";

/** Which side acts first. Ties go to the player. @see 10-COMBAT.md §2 */
export type InitiativeSide = "player" | "enemy";

/** How a fight ended. @see 10-COMBAT.md §7, §8 */
export type CombatOutcome = "victory" | "defeat" | "fled";

/**
 * A creature as it stands in a fight. `variant` is present from the first
 * turn, never revealed mid-fight.
 */
export interface CombatEnemy {
  /** Stable id within this fight — several enemies can share a `creatureId`. */
  id: string;
  creatureId: CreatureId;
  /** Display name, already localised for the client. */
  name: string;
  tier: CreatureTier;
  behaviour: CreatureBehaviour;
  /** The single variant applied, if any. Never more than one. */
  variant: CreatureVariant | null;
  hp: number;
  maxHp: number;
  /** Armour class the player's attack roll is compared against. */
  armourClass: number;
  attributes: Attributes;
  combatConditions: CombatConditionId[];
  /** False once dropped — kept in the list so the log stays readable. */
  isAlive: boolean;
}

/** The player's side of the fight. */
export interface CombatPlayer {
  hp: number;
  maxHp: number;
  armourClass: number;
  attributes: Attributes;
  /** Survival conditions carried into the fight from the run. */
  conditions: ActiveCondition[];
  /** Conditions that exist only for the duration of this fight. */
  combatConditions: CombatConditionId[];
}

/** One resolved exchange, already arbitrated. @see 10-COMBAT.md §3 */
export interface CombatLogEntry {
  round: number;
  actor: "player" | "enemy";
  action: CombatAction;
  /** `CombatEnemy.id` when the exchange targeted one. */
  targetId?: string;
  /** The d20 face, when a roll decided the outcome. */
  roll?: number;
  hit?: boolean;
  damage?: number;
  healing?: number;
  /** AI prose describing this exchange. Written from the result, never deciding it. */
  narrative: string;
}

/** What a fight yields on victory. @see 03-BESTIARY.md §7, 10-COMBAT.md §9 */
export interface CombatLoot {
  itemId: string;
  itemName: string;
  tier: LootTier;
  quantity: number;
}

/**
 * The authoritative state of an ongoing fight, owned by the backend and
 * persisted with the session so a resumed session finds its combat intact.
 */
export interface CombatState {
  id: string;
  player: CombatPlayer;
  enemies: CombatEnemy[];
  /** Which side won initiative. A single roll, not one per creature. */
  initiative: InitiativeSide;
  /** 1-based. */
  round: number;
  /** Whose turn it is right now. Enemies act as one block. */
  activeSide: InitiativeSide;
  log: CombatLogEntry[];
  /** Null while the fight is still running. */
  outcome: CombatOutcome | null;
}

/** How a fight concluded, with what it cost and what it paid. */
export interface CombatResult {
  outcome: CombatOutcome;
  loot: CombatLoot[];
  ironGained: number;
  /** Set when the fight ended by fleeing — the run needs to know which way. */
  fleeDirection?: FleeDirection;
}

/**
 * The fight projected to the client alongside every scene — everything the
 * combat interface needs to be drawn without computing a single rule. No AC,
 * no damage and no end condition is recalculated client-side.
 * @see 10-COMBAT.md §3
 */
export interface CombatSnapshot {
  player: CombatPlayer;
  enemies: CombatEnemy[];
  initiative: InitiativeSide;
  round: number;
  activeSide: InitiativeSide;
  log: CombatLogEntry[];
  /** Whether fleeing is offered this turn. Canon says it always is (03 §10). */
  canFlee: boolean;
  /** Present once the fight is over, so the client can show the payoff. */
  result?: CombatResult;
}
