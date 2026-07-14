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
  sharedWithAveugle: boolean;
  createdAt: string;
}
