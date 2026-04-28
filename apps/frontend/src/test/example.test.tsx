import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Test environment', () => {
  it('renders a div', () => {
    render(<div>Hello RPG</div>)
    expect(screen.getByText('Hello RPG')).toBeInTheDocument()
  })
})
