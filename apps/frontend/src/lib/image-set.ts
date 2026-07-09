const MIME_BY_EXTENSION: Record<string, string> = {
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

function imageMime(src: string) {
  const extension = src.split('.').pop()?.toLowerCase() ?? ''
  return MIME_BY_EXTENSION[extension] ?? 'image/png'
}

export function buildImageSet(src: string, webpSrc?: string) {
  if (!webpSrc) {
    return `url(${src})`
  }

  return `image-set(url(${webpSrc}) type('image/webp'), url(${src}) type('${imageMime(src)}'))`
}
