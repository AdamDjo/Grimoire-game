import { buildImageSet } from '@/lib/image-set'

import { FrameSequenceCanvas } from '../FrameSequenceCanvas/FrameSequenceCanvas'

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
  return (
    <section
      className={`scene-bridge scene-bridge--${tone} relative overflow-hidden`}
      id={id}
      aria-label={label}
      data-bridge-length={bridgeLength}
      data-motion="bridge"
    >
      <FrameSequenceCanvas
        className="absolute inset-0 h-full w-full"
        fallbackSrc={fallbackSrc}
        fallbackSrcWebp={fallbackSrcWebp}
        frameCount={frameCount}
        frameDir={frameDir}
      />
      <div
        className="scene-bridge__next absolute inset-0"
        data-bridge-next
        style={{ backgroundImage: buildImageSet(nextBackgroundSrc, nextBackgroundSrcWebp) }}
      />
      <div className="scene-bridge__veil absolute inset-0" data-bridge-veil aria-hidden="true" />
      <div className="scene-bridge__smoke absolute inset-0" data-bridge-smoke aria-hidden="true" />
      <div className="scene-bridge__glow absolute inset-0" data-bridge-glow aria-hidden="true" />
      <div className="media-vignette" aria-hidden="true" />
    </section>
  )
}
