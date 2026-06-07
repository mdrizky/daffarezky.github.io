import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import SiteLogo from '../components/SiteLogo'

test('SiteLogo renders correctly', () => {
  render(<SiteLogo />)
  expect(screen.getByText(/Daffa/i)).toBeDefined()
})
