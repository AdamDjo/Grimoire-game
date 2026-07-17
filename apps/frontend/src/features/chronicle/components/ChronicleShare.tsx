'use client'

import { useEffect, useState } from 'react'

interface ChronicleShareProps {
  title: string
}

export function ChronicleShare({ title }: ChronicleShareProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const shareText = `Ma Chronique de Velkhar — ${title}`
  const encodedUrl = encodeURIComponent(currentUrl)
  const encodedText = encodeURIComponent(shareText)

  useEffect(() => setCurrentUrl(window.location.href), [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="chronicle-share" aria-label="Partager cette Chronique">
      <span>Partager la trace</span>
      <button type="button" onClick={() => void copyLink()}>
        {copied ? 'Lien copié' : 'Copier le lien'}
      </button>
      <a
        href={`https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`}
        rel="noreferrer"
        target="_blank"
      >
        X
      </a>
      <a
        href={`https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`}
        rel="noreferrer"
        target="_blank"
      >
        Bluesky
      </a>
      <a
        href={`mailto:rgpd@grimoire.game?subject=${encodeURIComponent(`Signalement de Chronique — ${title}`)}`}
      >
        Signaler
      </a>
    </div>
  )
}
