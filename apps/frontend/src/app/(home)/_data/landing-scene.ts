import type { SurvivalStats } from '@grimoire/shared'

/** The scripted gauges of the landing's turn — mid-run, already worn. */
export const LANDING_SURVIVAL: SurvivalStats = {
  hp: 3,
  maxHp: 5,
  energy: 60,
  hunger: 40,
  thirst: 40,
  calamine: 2,
  isDying: false,
  neglectStreak: 0,
  empriseCharges: 0,
}

/** Matches `VelkharSession`'s composer cap, so the preview teaches the real limit. */
export const COMPOSER_MAX_LENGTH = 500
