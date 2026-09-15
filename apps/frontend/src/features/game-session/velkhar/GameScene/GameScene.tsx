'use client'

import { useState, type ReactNode } from 'react'

import { GameLink } from '@/components/ui/game-link'
import { DialogueChoice } from '@/components/ui/grimoire/DialogueChoice/DialogueChoice'
import { GameSceneLayout } from '@/components/ui/grimoire/GameSceneLayout/GameSceneLayout'
import { NarrativeComposer } from '@/components/ui/grimoire/NarrativeComposer/NarrativeComposer'

import { GameHud, type GameHudLabels, type GameHudProps } from '../GameHud/GameHud'

import type { SurvivalStats } from '@grimoire/shared'

/** The free-text box under the choices. */
export interface GameSceneComposer {
  label: string
  placeholder: string
  actionLabel: string
  /** Character cap. Keep it aligned with the live session's own limit. */
  maxLength: number
}

/**
 * One playable turn, already translated.
 *
 * Copy arrives resolved rather than as message keys: `useTranslations()` only
 * accepts a literal namespace, so a component resolving its own keys would be
 * welded to one catalogue. Passing strings lets any caller — a scripted preview
 * or a live run whose copy comes from the server — mount the same scene.
 */
export interface GameSceneTurn {
  /** Place name shown in the top bar. */
  location: string
  /** Short qualifier under the location, also the accessible name. */
  label: string
  heading: string
  narrative: string
  choices: readonly string[]
  /** Shown once the player has chosen or written something. */
  response: string
  continueLabel: string
  continueHref: string
  composer: GameSceneComposer
  survival: SurvivalStats
  hudLabels: GameHudLabels
}

export interface GameSceneProps {
  /** The turn to play. */
  turn: GameSceneTurn
  /** Backdrop behind the layout — the caller owns its artwork. */
  background: ReactNode
  className?: string
  /** Class applied to the HUD, so a route can style its own footer. */
  hudClassName?: string
  /** Per-gauge classes, forwarded to the HUD. */
  gaugeClassNames?: GameHudProps['gaugeClassNames']
}

/**
 * One playable turn: top bar, narrative, choices, free composer and HUD.
 *
 * Built on `GameSceneLayout`, the same frame the live session uses, and fed the
 * same shapes — `SurvivalStats` for the gauges, a character-capped composer. It
 * owns no copy, no artwork and no destination, so a preview and a real run can
 * mount it side by side without either forking the other.
 */
export function GameScene({
  turn,
  background,
  className,
  hudClassName,
  gaugeClassNames,
}: GameSceneProps) {
  const { location, label, heading, narrative, choices, response, composer, survival, hudLabels } =
    turn
  const [action, setAction] = useState('')
  const [selected, setSelected] = useState<number>()
  const [resolved, setResolved] = useState(false)

  return (
    <GameSceneLayout
      className={className}
      aria-label={label}
      top={
        <div className="game-scene__location">
          {location}
          <small>{label}</small>
        </div>
      }
      background={background}
      scene={<span className="game-scene__marker" aria-hidden="true" />}
      reader={
        <div className="game-scene__reader">
          <h3>{heading}</h3>
          <p>{narrative}</p>
          <div className="game-scene__choices">
            {choices.map((choice, index) => (
              <DialogueChoice
                key={choice}
                number={index + 1}
                selected={selected === index}
                onClick={() => {
                  setSelected(index)
                  setResolved(true)
                }}
              >
                {choice}
              </DialogueChoice>
            ))}
          </div>
          <NarrativeComposer
            aria-label={composer.label}
            heading={composer.label}
            placeholder={composer.placeholder}
            actionLabel={composer.actionLabel}
            value={action}
            maxLength={composer.maxLength}
            onChange={(event) => setAction(event.target.value)}
            actionDisabled={!action.trim()}
            onAction={() => setResolved(true)}
          />
          <div role="status" className="game-scene__response">
            {resolved ? (
              <>
                <p>{response}</p>
                <GameLink variant="landing" href={turn.continueHref}>
                  {turn.continueLabel}
                </GameLink>
              </>
            ) : null}
          </div>
        </div>
      }
      bottom={
        <GameHud
          survival={survival}
          labels={hudLabels}
          className={hudClassName}
          gaugeClassNames={gaugeClassNames}
        />
      }
    />
  )
}
