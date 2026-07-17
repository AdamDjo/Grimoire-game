import type { ChronicleEndReason, ChronicleKeyMoment, ChronicleMood } from '@grimoire/shared'

export type ChronicleAvailability = 'loading' | 'ready' | 'too-short' | 'unavailable' | 'error'

/** Public-safe projection. Identity and ownership fields never reach the reading UI. */
export interface ChronicleView {
  bodyMarkdown: string
  createdAt: string
  endReason: ChronicleEndReason
  illustrationUrl?: string
  keyMoments: ChronicleKeyMoment[]
  mood: ChronicleMood
  slug?: string
  tagline: string
  title: string
}

export interface PublicChroniclePayload extends ChronicleView {
  published: boolean
}
