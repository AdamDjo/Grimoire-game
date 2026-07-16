import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AUBERGE_INTRO_STORAGE_KEY, AubergeIntro, hasSeenAubergeIntro } from './AubergeIntro'

describe('AubergeIntro', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.localStorage.clear()
    window.sessionStorage.clear()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('affiche une cinématique plein écran avec un skip différé', () => {
    render(<AubergeIntro onComplete={vi.fn()} />)

    expect(
      screen.getByRole('dialog', { name: 'Introduction à l’Auberge de L’Aveugle' })
    ).toBeInTheDocument()
    expect(screen.getByText('L’Auberge de L’Aveugle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Passer/ })).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    expect(screen.getByRole('button', { name: /Passer/ })).toBeEnabled()
  })

  it('mémorise le visionnage et termine après le fondu de sortie', () => {
    const onComplete = vi.fn()
    render(<AubergeIntro onComplete={onComplete} />)

    act(() => {
      vi.advanceTimersByTime(1_000)
    })
    fireEvent.click(screen.getByRole('button', { name: /Passer/ }))

    expect(hasSeenAubergeIntro()).toBe(true)
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('termine naturellement à la fin de la vidéo', () => {
    const onComplete = vi.fn()
    const { container } = render(<AubergeIntro onComplete={onComplete} />)

    fireEvent.ended(container.querySelector('video')!)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(window.sessionStorage.getItem(AUBERGE_INTRO_STORAGE_KEY)).toBe('seen')
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('permet une prévisualisation sans modifier le visionnage enregistré', () => {
    const onComplete = vi.fn()
    const { container } = render(<AubergeIntro onComplete={onComplete} preview />)

    fireEvent.ended(container.querySelector('video')!)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(window.sessionStorage.getItem(AUBERGE_INTRO_STORAGE_KEY)).toBeNull()
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('active le son uniquement après une action du joueur', () => {
    render(<AubergeIntro onComplete={vi.fn()} />)

    const soundButton = screen.getByRole('button', { name: 'Activer le son' })
    fireEvent.click(soundButton)

    expect(screen.getByRole('button', { name: 'Couper le son' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })
})
