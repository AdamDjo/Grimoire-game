import { beforeEach, describe, expect, it, vi } from 'vitest'

import { scrollToAnchor } from './scroll-to-anchor'

const { getByIdMock, scrollToMock } = vi.hoisted(() => ({
  getByIdMock: vi.fn(),
  scrollToMock: vi.fn(),
}))

vi.mock('@/hooks/use-lenis', () => ({
  getLenis: () => ({ scrollTo: scrollToMock }),
}))

vi.mock('@/lib/gsap-init', () => ({
  ScrollTrigger: { getById: getByIdMock },
}))

describe('scrollToAnchor', () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="outro" />'
    getByIdMock.mockReturnValue({ end: 4321 })
    scrollToMock.mockClear()
  })

  it('termine le scroll à la fin du pin GSAP de l’outro', () => {
    expect(scrollToAnchor('#outro')).toBe(true)
    expect(getByIdMock).toHaveBeenCalledWith('landing-outro')
    expect(scrollToMock).toHaveBeenCalledWith(4321, expect.objectContaining({ duration: 1.35 }))
  })
})
