'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface ChronicleShareProps {
  title: string
}

export function ChronicleShare({ title }: ChronicleShareProps) {
  const t = useTranslations('Chronicle')
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const shareText = t('shareText', { title })
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
    <div className="chronicle-share" aria-label={t('shareLabel')}>
      <span>{t('shareTrace')}</span>
      <button type="button" onClick={() => void copyLink()}>
        {copied ? t('copied') : t('copyLink')}
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
        href={`mailto:rgpd@grimoire.game?subject=${encodeURIComponent(t('reportSubject', { title }))}`}
      >
        {t('report')}
      </a>
    </div>
  )
}
