import type { HTMLAttributes, ReactNode } from 'react'

import './game-scene-layout.css'

export interface GameSceneLayoutProps extends HTMLAttributes<HTMLElement> {
  background?: ReactNode
  top?: ReactNode
  scene: ReactNode
  reader?: ReactNode
  bottom?: ReactNode
}

export function GameSceneLayout({
  background,
  bottom,
  className = '',
  reader,
  scene,
  top,
  ...props
}: GameSceneLayoutProps) {
  return (
    <section className={`game-scene-layout ${className}`} {...props}>
      {top ? <div className="game-scene-layout__top">{top}</div> : null}
      <div className="game-scene-layout__body">
        <div className="game-scene-layout__scene">
          {background ? (
            <div className="game-scene-layout__background" aria-hidden="true">
              {background}
            </div>
          ) : null}
          <div className="game-scene-layout__scene-content">{scene}</div>
        </div>
        {reader ? <aside className="game-scene-layout__reader">{reader}</aside> : null}
      </div>
      {bottom ? <div className="game-scene-layout__bottom">{bottom}</div> : null}
    </section>
  )
}
