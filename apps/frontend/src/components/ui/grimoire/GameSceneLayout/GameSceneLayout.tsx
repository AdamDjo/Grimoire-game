import type { HTMLAttributes, ReactNode } from 'react'

import './game-scene-layout.css'

export type GameSceneLayoutVariant = 'centered' | 'sidebar' | 'immersive'

export interface GameSceneLayoutProps extends HTMLAttributes<HTMLElement> {
  background?: ReactNode
  top?: ReactNode
  main: ReactNode
  sidebar?: ReactNode
  bottom?: ReactNode
  variant?: GameSceneLayoutVariant
}

export function GameSceneLayout({
  background,
  bottom,
  className = '',
  main,
  sidebar,
  top,
  variant = 'centered',
  ...props
}: GameSceneLayoutProps) {
  return (
    <section className={`game-scene-layout game-scene-layout--${variant} ${className}`} {...props}>
      {background ? (
        <div className="game-scene-layout__background" aria-hidden="true">
          {background}
        </div>
      ) : null}
      {top ? <div className="game-scene-layout__top">{top}</div> : null}
      <div className="game-scene-layout__body">
        <div className="game-scene-layout__main">{main}</div>
        {sidebar ? <aside className="game-scene-layout__sidebar">{sidebar}</aside> : null}
      </div>
      {bottom ? <div className="game-scene-layout__bottom">{bottom}</div> : null}
    </section>
  )
}
