import type { ConditionId } from "./character.types";
import type { PersistedInventoryItem } from "./inventory.types";

/**
 * The Comptoir — the Inn's supply counter (#249).
 *
 * Canon references:
 * - `docs/canon/11-INVENTORY-ECONOMY.md` §2 (gold prices), §1 (bag capacity)
 * - `docs/canon/23-RUN-STRUCTURE.md` §1 (the Comptoir as one of the four
 *   Inn destinations)
 *
 * Two deliberate departures from canon §7 ("Pas de prix fixes", negotiation by
 * d20 + CENDRE + Persuasion), decided for v0.2.1:
 *
 * 1. **Fixed prices.** The Comptoir sells survival consumables — the lever of
 *    preparation, not a haggling scene. A dice roll on the price of water adds
 *    variance without adding a decision. Canon §7's negotiation targets the
 *    *market* and faction merchants, whose reputation modifiers have no
 *    persisted model yet.
 * 2. **Unlimited stock** on the closed catalogue. The real constraint is gold
 *    and the 12 bag slots (§1: "le sac est délibérément trop petit"), not
 *    availability. A stock counter would add bookkeeping without adding an
 *    arbitrage.
 *
 * Negotiation and faction pricing remain open for a later market ticket.
 */

/** Closed catalogue ids. The client never invents one; the backend rejects anything else. */
export const COUNTER_ITEM_IDS = [
  "waterskin",
  "rations",
  "bandages",
  "antidote",
] as const;

export type CounterItemId = (typeof COUNTER_ITEM_IDS)[number];

/**
 * What a catalogue entry restocks, when it is a survival supply. This is the
 * structural signal `countCarriedSupplies` needs: a Comptoir item must never
 * be recognised by a regex on its display name (the fallback that exists for
 * AI-named loot in `run.service.ts`).
 */
export type SupplyKind = "water" | "food";

/**
 * One purchasable entry. Prices are canon (11-INVENTORY-ECONOMY §2) and are
 * never tuned here without updating the canon table first.
 */
export interface CounterCatalogItem {
  readonly id: CounterItemId;
  /** Display label key resolved client-side; the backend stores the canon name. */
  readonly name: string;
  readonly description: string;
  /** Unit price in gold. */
  readonly priceGold: number;
  /**
   * Which supply stock this item feeds, when it is one. Undefined for items
   * that are not water/food (bandages, antidote).
   */
  readonly supply?: SupplyKind;
  /** Effect applied on use, mirroring `ItemGainedEffect`. */
  readonly effect?: {
    readonly healAmount?: number;
    readonly removesCondition?: ConditionId;
  };
}

/** A single line of a purchase request. */
export interface CounterPurchaseLine {
  itemId: CounterItemId;
  /** Units to buy. Must be >= 1; the backend caps the total against bag space. */
  quantity: number;
}

/**
 * A purchase request. `purchaseId` is client-supplied and makes the whole
 * transaction idempotent: replaying the same id returns the original result
 * without charging gold twice (#249, "toute transaction est persistée et
 * idempotente").
 */
export interface CounterPurchaseRequest {
  purchaseId: string;
  lines: CounterPurchaseLine[];
}

/** Why a purchase was refused. The refusal is always atomic — nothing is applied. */
export type CounterPurchaseRefusal =
  | "insufficient_gold"
  | "bag_full"
  | "unknown_item"
  | "invalid_quantity"
  | "not_at_inn";

export interface CounterPurchaseResult {
  /** False when refused — gold and inventory are untouched. */
  accepted: boolean;
  refusal?: CounterPurchaseRefusal;
  /** Total charged in gold. 0 on refusal. */
  totalGold: number;
  /** Gold remaining after the purchase. */
  goldAfter: number;
  /** The full inventory after the purchase. */
  inventory: PersistedInventoryItem[];
  /** True when this id was already processed — the result is the original one, replayed. */
  replayed: boolean;
}

/**
 * Everything the player needs to decide whether they are ready to leave the
 * Inn. Backend-owned and complete: the client renders it as given and computes
 * nothing — not the free slots, not the affordability of a line.
 * @see docs/canon/23-RUN-STRUCTURE.md §1
 */
export interface PreparationSnapshot {
  /** Current gold, from the persisted character. */
  gold: number;
  /** Bag slots used out of `bagCapacity` (equipment/artifact/key never count). */
  bagUsed: number;
  bagCapacity: number;
  /** Free bag slots — projected, so the client never recomputes the cap. */
  bagFree: number;
  /** Water and food units actually carried, counted structurally. */
  supplies: {
    water: number;
    food: number;
  };
  /** The closed catalogue, with affordability resolved per entry. */
  catalogue: PreparationCatalogueEntry[];
}

export interface PreparationCatalogueEntry {
  item: CounterCatalogItem;
  /** False when the character cannot afford a single unit right now. */
  affordable: boolean;
  /** Max units buyable given both gold and free bag slots. 0 when none. */
  maxAffordableQuantity: number;
}
