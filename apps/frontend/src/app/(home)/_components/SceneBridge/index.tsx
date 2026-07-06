import { FrameSequenceCanvas } from './FrameSequenceCanvas'

interface SceneBridgeProps {
  bridgeLength?: number
  fallbackSrc: string
  frameCount?: number
  frameDir: string
  id: string
  label: string
  nextBackgroundSrc: string
  tone: 'gold' | 'ember'
}

export function SceneBridge({
  bridgeLength = 145,
  fallbackSrc,
  frameCount = 0,
  frameDir,
  id,
  label,
  nextBackgroundSrc,
  tone,
}: SceneBridgeProps) {
  return (
    <section
      className={`scene-bridge scene-bridge--${tone}`}
      id={id}
      aria-label={label}
      data-bridge-length={bridgeLength}
      data-motion="bridge"
    >
      <FrameSequenceCanvas fallbackSrc={fallbackSrc} frameCount={frameCount} frameDir={frameDir} />
      <div
        className="scene-bridge__next"
        data-bridge-next
        style={{ backgroundImage: `url(${nextBackgroundSrc})` }}
      />
      <div className="scene-bridge__glow" data-bridge-glow aria-hidden="true" />
      <div className="media-vignette" aria-hidden="true" />
    </section>
  )
}
