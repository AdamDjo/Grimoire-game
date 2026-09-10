'use client'

import { useCrossingMotion } from './use-crossing-motion'

import type { RefObject } from 'react'

interface CrossingMotionRuntimeProps {
  root: RefObject<HTMLDivElement | null>
  paused: boolean
}

/** Loads the cinematic runtime after the initial content has painted. */
export function CrossingMotionRuntime({ root, paused }: CrossingMotionRuntimeProps) {
  useCrossingMotion(root, paused)
  return null
}
