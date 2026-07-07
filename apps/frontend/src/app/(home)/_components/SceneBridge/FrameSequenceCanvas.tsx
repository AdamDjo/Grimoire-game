'use client'

import { useEffect, useRef } from 'react'

import { ScrollTrigger, gsap } from '@/lib/gsap-init'

interface FrameSequenceCanvasProps {
  className?: string
  fallbackSrc: string
  fallbackSrcWebp?: string
  frameCount?: number
  frameDir: string
}

function buildFramePath(frameDir: string, index: number) {
  return `${frameDir}/frame_${String(index).padStart(3, '0')}.webp`
}

export function FrameSequenceCanvas({
  className = '',
  fallbackSrc,
  fallbackSrcWebp,
  frameCount = 0,
  frameDir,
}: FrameSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (frameCount <= 0) {
      return undefined
    }

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
      return undefined
    }

    const sequence = { frame: 0 }
    const images = Array.from({ length: frameCount }, (_, index) => {
      const image = new Image()
      image.src = buildFramePath(frameDir, index + 1)
      return image
    })
    const bridge = canvas.closest<HTMLElement>('[data-motion="bridge"]')
    const bridgeLength = Number(bridge?.dataset.bridgeLength) || 145

    const resize = () => {
      const parent = canvas.parentElement

      if (!parent) {
        return
      }

      const { width, height } = parent.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (image = images[0]) => {
      if (!image?.complete || image.naturalWidth === 0) {
        return
      }

      const { width, height } = canvas.getBoundingClientRect()
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const x = (width - drawWidth) / 2
      const y = (height - drawHeight) / 2

      context.clearRect(0, 0, width, height)
      context.drawImage(image, x, y, drawWidth, drawHeight)
    }

    const drawFrame = () => {
      draw(images[Math.round(sequence.frame)])
    }

    resize()
    images[0].addEventListener('load', drawFrame, { once: true })
    window.addEventListener('resize', resize)

    const tween = gsap.to(sequence, {
      frame: frameCount - 1,
      ease: 'none',
      onUpdate: drawFrame,
      scrollTrigger: {
        trigger: bridge ?? canvas,
        start: 'top top',
        end: `+=${bridgeLength}%`,
        scrub: true,
      },
    })
    ScrollTrigger.refresh()

    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
      window.removeEventListener('resize', resize)
    }
  }, [fallbackSrc, frameCount, frameDir])

  const fallbackImage = fallbackSrcWebp
    ? `image-set(url(${fallbackSrcWebp}) type('image/webp'), url(${fallbackSrc}) type('image/png'))`
    : `url(${fallbackSrc})`

  return (
    <div className={`frame-sequence ${className}`} style={{ backgroundImage: fallbackImage }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  )
}
