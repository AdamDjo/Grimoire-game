/** Trigger category for a named Souvenir. @see 14-META-WORLD.md §9 */
export type SouvenirType =
  | "npc-death"
  | "moral-choice"
  | "secret-discovery"
  | "boss-victory"
  | "strong-promise";

export interface Souvenir {
  id: string;
  userId: string;
  characterId: string;
  sessionId: string;
  title: string;
  body: string;
  type: SouvenirType;
  /**
   * True for an anonymous Souvenir (generic lore fragment, spendable as
   * currency with L'Aveugle). False for a named Souvenir (a specific marked
   * act of the player, narrative only, never spendable). The player-facing
   * word "Souvenir" covers both sub-types on purpose (canon).
   * @see 11-INVENTORY-ECONOMY.md §3
   */
  anonymous: boolean;
  sharedWithAveugle: boolean;
  /** AI-generated lore text produced when this Souvenir was spent with L'Aveugle. */
  aveugleLoreResult?: string;
  createdAt: string;
}
