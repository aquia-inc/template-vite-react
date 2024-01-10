import { render, screen } from '@testing-library/react'
import Copyright from '@/components/Copyright'
import { COPYRIGHT_LABEL, ORG_NAME, ORG_URL } from '@/constants'

beforeEach(() => {
  render(<Copyright />)
})

test('renders the copyright statement', () => {
  const copyrightStatement = screen.getByText(
    new RegExp(`${COPYRIGHT_LABEL}`, 'i')
  )
  expect(copyrightStatement).toBeInTheDocument()
})

test('renders the current year', () => {
  const currentYear = new Date().getFullYear().toString()
  const yearElement = screen.getByText(new RegExp(currentYear, 'i'))
  expect(yearElement).toBeInTheDocument()
})

test('renders a link to the CMS website', async () => {
  const linkElement = screen.getByRole('link', {
    name: ORG_NAME,
  })
  expect(linkElement).toHaveAttribute('href', ORG_URL)
})
