import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/views/Home/Home'
import { TEMPLATE_GITHUB_URL } from '@/constants'

test('renders the home page content and GitHub link', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', {
      name: /start from a working react foundation instead of an empty repo/i,
    }),
  ).toBeInTheDocument()

  expect(
    screen.getByRole('link', { name: /view github repository/i }),
  ).toHaveAttribute('href', TEMPLATE_GITHUB_URL)

  expect(screen.getByText('yarn dev')).toBeInTheDocument()
  expect(screen.getByText('Project shape at a glance')).toBeInTheDocument()
})
