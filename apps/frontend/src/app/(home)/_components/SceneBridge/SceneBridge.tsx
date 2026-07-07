import { FrameSequenceCanvas } from './FrameSequenceCanvas'

import './scene-bridge.css'

interface SceneBridgeProps {
  bridgeLength?: number
  fallbackSrc: string
  fallbackSrcWebp?: string
  frameCount?: number
  frameDir: string
  id: string
  label: string
  nextBackgroundSrc: string
  nextBackgroundSrcWebp?: string
  tone: 'gold' | 'ember'
}

export function SceneBridge({
  bridgeLength = 145,
  fallbackSrc,
  fallbackSrcWebp,
  frameCount = 0,
  frameDir,
  id,
  label,
  nextBackgroundSrc,
  nextBackgroundSrcWebp,
  tone,
}: SceneBridgeProps) {
  const nextBackgroundImage = nextBackgroundSrcWebp
    ? `image-set(url(${nextBackgroundSrcWebp}) type('image/webp'), url(${nextBackgroundSrc}) type('image/png'))`
    : `url(${nextBackgroundSrc})`

  return (
    <section
      className={`scene-bridge scene-bridge--${tone}`}
      id={id}
      aria-label={label}
      data-bridge-length={bridgeLength}
      data-motion="bridge"
    >
      <FrameSequenceCanvas
        fallbackSrc={fallbackSrc}
        fallbackSrcWebp={fallbackSrcWebp}
        frameCount={frameCount}
        frameDir={frameDir}
      />
      <div
        className="scene-bridge__next"
        data-bridge-next
        style={{ backgroundImage: nextBackgroundImage }}
      />
      <div className="scene-bridge__veil" data-bridge-veil aria-hidden="true" />
      <div className="scene-bridge__smoke" data-bridge-smoke aria-hidden="true" />
      <div className="scene-bridge__glow" data-bridge-glow aria-hidden="true" />
      <div className="media-vignette" aria-hidden="true" />
    </section>
  )
}
