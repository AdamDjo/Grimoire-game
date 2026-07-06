import './media-layer.css'

interface MediaLayerProps {
  videoSrc?: string
  poster: string
  fallbackSrc: string
  className?: string
}

export function MediaLayer({ videoSrc, poster, fallbackSrc, className = '' }: MediaLayerProps) {
  return (
    <div className={`media-layer ${className}`} aria-hidden="true">
      {videoSrc ? (
        <video
          className="media-layer__video"
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
      <div className="media-layer__fallback" style={{ backgroundImage: `url(${fallbackSrc})` }} />
      <div className="media-vignette" />
    </div>
  )
}
