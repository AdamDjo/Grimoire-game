import { forwardRef } from 'react'

import { GameInput } from '../GameInput/GameInput'

import type { GameInputProps } from '../GameInput/GameInput'

export type GameSearchInputProps = Omit<GameInputProps, 'leadingIcon' | 'type'>

export const GameSearchInput = forwardRef<HTMLInputElement, GameSearchInputProps>(
  function GameSearchInput(props, ref) {
    const searchIcon = (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.4 15.4 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )

    return <GameInput ref={ref} type="search" leadingIcon={searchIcon} {...props} />
  }
)

GameSearchInput.displayName = 'GameSearchInput'
