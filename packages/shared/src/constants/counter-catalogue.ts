import type { CounterCatalogItem, CounterItemId } from "../types/counter.types";

/**
 * The Comptoir's closed catalogue. Prices are canon
 * (`docs/canon/11-INVENTORY-ECONOMY.md` §2, "Dépenses") — never invented,
 * never tuned without updating the canon table first.
 *
 * | Canon entry                                     | Cost  |
 * | ----------------------------------------------- | ----- |
 * | 💧 Outre d'eau pleine                           | 2 🪙  |
 * | 🍖 Repas chaud                                  | 1 🪙  |
 * | 🩹 Soins (1d6+2 PV, retire 1 condition mineure) | 10 🪙 |
 *
 * `rations` maps to the canon "Repas chaud" line at 1 🪙: the Comptoir sells
 * travel rations at the same price as a hot meal, since both are the same
 * food-stock unit for the return estimate. The antidote is priced against the
 * same 10 🪙 care line — it removes a condition without healing.
 *
 * The healing roll of the canon care line (1d6+2) is not applied here: items
 * carry a flat `healAmount` in the `ItemGainedEffect` contract, and the
 * backend never rolls on item use (`game-rules/inventory.ts#useItem`). 5 is
 * the mean of 1d6+2, so the fixed value matches the canon expectation.
 */
export const COUNTER_CATALOGUE: readonly CounterCatalogItem[] = [
  {
    id: "waterskin",
    name: "Outre d'eau pleine",
    description: "De quoi tenir la route du sel un jour de plus.",
    priceGold: 2,
    supply: "water",
  },
  {
    id: "rations",
    name: "Vivres de route",
    description: "Pain dur, viande séchée. Ça ne réjouit personne.",
    priceGold: 1,
    supply: "food",
  },
  {
    id: "bandages",
    name: "Bandages",
    description:
      "Serrés, propres. Ils font le travail si on s'arrête assez longtemps.",
    priceGold: 10,
    effect: { healAmount: 5 },
  },
  {
    id: "antidote",
    name: "Antidote",
    description: "Amer. Le tenancier ne dit pas ce qu'il y a dedans.",
    priceGold: 10,
    effect: { removesCondition: "poison" },
  },
] as const;

/** Catalogue lookup. Returns undefined for an unknown id — the caller refuses. */
export function findCounterItem(id: string): CounterCatalogItem | undefined {
  return COUNTER_CATALOGUE.find((entry) => entry.id === id);
}

/** Type guard for a catalogue id coming off the wire. */
export function isCounterItemId(id: string): id is CounterItemId {
  return COUNTER_CATALOGUE.some((entry) => entry.id === id);
}
