import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import { DashboardContent } from './Dashboard'

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

test('composes all adaptive dashboard sections', () => {
  render(<DashboardContent username="reviewer" searchQuery="" />, {
    wrapper: Wrapper,
  })

  expect(
    screen.getByRole('heading', { name: /welcome user reviewer/i }),
  ).toBeVisible()
  expect(
    screen.getByRole('region', { name: 'Dashboard metrics' }),
  ).toBeVisible()
  expect(screen.getByRole('region', { name: 'Example records' })).toBeVisible()
  expect(screen.getByRole('region', { name: 'Upload intake' })).toBeVisible()
  expect(
    screen.getByRole('region', { name: 'Template activity' }),
  ).toBeVisible()
})

test('passes the shell search query to records', () => {
  render(<DashboardContent username="reviewer" searchQuery="platform" />, {
    wrapper: Wrapper,
  })

  expect(screen.getByText('Auth loader')).toBeVisible()
  expect(screen.queryByText('Route map')).not.toBeInTheDocument()
})
