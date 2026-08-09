/**
 * The Aveugle's Inn ("Le Doigt-Cassé") — hub state and exchanges with
 * L'Aveugle, the innkeeper-prophet. Player-facing wording always says
 * "Souvenirs" (canon), even though the backend distinguishes anonymous
 * (spendable) from named (narrative only) Souvenirs internally.
 * @see 15-GAME-MASTER.md §1.1, 11-INVENTORY-ECONOMY.md §3
 */

import type { Souvenir } from "./souvenir.types";

/** State of the Aveugle hub screen for the authenticated player's character. */
export interface AveugleHubState {
  /** Gold (🪙) currently held by the character. */
  gold: number;
  /** Count of anonymous (spendable) Souvenirs still available. */
  spendableSouvenirCount: number;
  /** Named Souvenirs the player has earned so far, most recent first. */
  namedSouvenirs: Souvenir[];
  /** Topic ids from the frontend's static catalogue already seen by this player. */
  seenTopicIds: string[];
}

export interface AveugleTalkRequest {
  /** Free-form message the player addresses to L'Aveugle. */
  message: string;
}

export interface AveugleTalkResponse {
  /** L'Aveugle's reply, always in canon voice — AI-generated or a static fallback. */
  reply: string;
  /** True when the reply came from the static fallback bank (AI call failed). */
  isFallback: boolean;
}

/** The canon exchange catalogue a spendable Souvenir can be traded for. @see 11-INVENTORY-ECONOMY.md §3 */
export type AveugleExchangeType =
  | "lore-fragment"
  | "artifact-identification"
  | "quest-hint"
  | "region-map"
  | "moral-advice";

export interface SpendSouvenirRequest {
  exchangeType: AveugleExchangeType;
}

export interface SpendSouvenirResponse {
  /** The AI-generated lore text produced by the exchange. */
  loreResult: string;
  /** The spent Souvenir, updated (`sharedWithAveugle: true`). */
  souvenir: Souvenir;
}
