import './media-layer.css'

interface MediaLayerProps {
  videoSrc?: string
  poster: string
  fallbackSrc: string
  fallbackSrcWebp?: string
  className?: string
}

export function MediaLayer({
  videoSrc,
  poster,
  fallbackSrc,
  fallbackSrcWebp,
  className = '',
}: MediaLayerProps) {
  const fallbackImage = fallbackSrcWebp
    ? `image-set(url(${fallbackSrcWebp}) type('image/webp'), url(${fallbackSrc}) type('image/png'))`
    : `url(${fallbackSrc})`

  return (
    <div className={`media-layer absolute inset-0 -z-[2] bg-void ${className}`} aria-hidden="true">
      {videoSrc ? (
        <video
          className="media-layer__video absolute inset-0 h-full w-full"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
      <div
        className="media-layer__fallback absolute inset-0 h-full w-full"
        style={{ backgroundImage: fallbackImage }}
      />
      <div className="media-vignette absolute inset-0" />
    </div>
  )
}
