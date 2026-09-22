import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AUBERGE_INTRO_STORAGE_KEY, AubergeIntro, hasSeenAubergeIntro } from './AubergeIntro'

vi.mock('@/lib/gsap-init', () => ({
  ScrollTrigger: { refresh: vi.fn() },
  gsap: {},
  useGSAP: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: ({
    alt,
    fill: _fill,
    priority: _priority,
    unoptimized: _unoptimized,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    priority?: boolean
    unoptimized?: boolean
  }) => <img alt={alt} {...props} />,
}))

describe('AubergeIntro', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('ouvre cinq écrans illustrés sans vidéo et raconte la fracture du monde', () => {
    const { container } = render(<AubergeIntro onComplete={vi.fn()} />)

    expect(
      screen.getByRole('dialog', { name: "Introduction to The Blind One's Inn" })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The world broke apart.' })).toBeInTheDocument()
    expect(screen.getByText(/Archons unleashed a magic/)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
    expect(container.querySelectorAll('[data-prologue-chapter]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-prologue-image]')).toHaveLength(5)
    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sound/i })).not.toBeInTheDocument()
  })

  it('avance et revient écran par écran avec les contrôles de la landing', () => {
    const { container } = render(<AubergeIntro onComplete={vi.fn()} />)

    const nextButton = screen.getByRole('button', { name: 'Continue' })
    const previousButton = screen.getByRole('button', { name: 'Previous' })
    expect(nextButton).toHaveClass('game-button--landing')
    expect(previousButton).toHaveClass('game-button--landing-ghost')

    fireEvent.click(nextButton)
    expect(container.querySelector('[data-prologue-chapter="2"]')).toHaveAttribute(
      'aria-current',
      'step'
    )

    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(container.querySelector('[data-prologue-chapter="3"]')).toHaveAttribute(
      'aria-current',
      'step'
    )

    fireEvent.keyDown(window, { key: 'ArrowUp' })
    expect(container.querySelector('[data-prologue-chapter="2"]')).toHaveAttribute(
      'aria-current',
      'step'
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
  })

  it('met à jour la progression lorsque le joueur fait défiler le prologue', () => {
    const { container } = render(<AubergeIntro onComplete={vi.fn()} />)
    const scroller = container.querySelector<HTMLElement>('.auberge-intro__scroller')
    expect(scroller).not.toBeNull()

    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 800 })
    Object.defineProperty(scroller, 'scrollLeft', { configurable: true, value: 1_600 })
    fireEvent.scroll(scroller!)
    act(() => {
      vi.advanceTimersByTime(20)
    })

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
    expect(container.querySelector('[data-prologue-chapter="3"]')).toHaveAttribute(
      'aria-current',
      'step'
    )
  })

  it('transforme la molette verticale en navigation horizontale sans sauter de chapitre', () => {
    const { container } = render(<AubergeIntro onComplete={vi.fn()} />)
    const scroller = container.querySelector<HTMLElement>('.auberge-intro__scroller')
    expect(scroller).not.toBeNull()

    fireEvent.wheel(scroller!, { deltaY: 120 })
    expect(container.querySelector('[data-prologue-chapter="2"]')).toHaveAttribute(
      'aria-current',
      'step'
    )

    fireEvent.wheel(scroller!, { deltaY: 120 })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')

    act(() => {
      vi.advanceTimersByTime(650)
    })
    fireEvent.wheel(scroller!, { deltaY: 120 })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
  })

  it('termine sur le Doigt-Cassé puis mémorise le prologue', () => {
    const onComplete = vi.fn()
    render(<AubergeIntro onComplete={onComplete} />)

    for (let index = 0; index < 4; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    }

    expect(screen.getByRole('heading', { name: 'One door still stands.' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Enter the inn' }))

    expect(hasSeenAubergeIntro()).toBe(true)
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(650)
    })

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('permet de passer immédiatement avec Échap', () => {
    const onComplete = vi.fn()
    render(<AubergeIntro onComplete={onComplete} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(window.sessionStorage.getItem(AUBERGE_INTRO_STORAGE_KEY)).toBe('seen')

    act(() => {
      vi.advanceTimersByTime(650)
    })

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('prévisualise le prologue sans modifier le visionnage enregistré', () => {
    const onComplete = vi.fn()
    render(<AubergeIntro onComplete={onComplete} preview />)

    fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
    act(() => {
      vi.advanceTimersByTime(650)
    })

    expect(window.sessionStorage.getItem(AUBERGE_INTRO_STORAGE_KEY)).toBeNull()
    expect(onComplete).toHaveBeenCalledOnce()
  })
})
