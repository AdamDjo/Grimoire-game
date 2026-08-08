import type { SessionEndReason } from "./session.types";

/** Dominant tone of a Chronicle. @see 17-RUN-CHRONICLE.md §2 */
export type ChronicleMood =
  | "tragic"
  | "epic"
  | "melancholic"
  | "serene"
  | "absurd";

export interface ChronicleKeyMoment {
  label: string;
  sceneRef: number;
}

/** Why a GameSession ended. Alias of `SessionEndReason` — a Chronicle always mirrors its GameSession. */
export type ChronicleEndReason = SessionEndReason;

export interface Chronicle {
  id: string;
  userId: string;
  characterId: string;
  sessionId: string;
  endReason: ChronicleEndReason;
  title: string;
  bodyMarkdown: string;
  mood: ChronicleMood;
  keyMoments: ChronicleKeyMoment[];
  tagline: string;
  createdAt: string;
}
