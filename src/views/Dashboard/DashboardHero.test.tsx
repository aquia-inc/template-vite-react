import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import { DashboardHero } from './DashboardHero'

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

test('renders the protected workspace identity and readiness state', () => {
  render(<DashboardHero username="reviewer" />, { wrapper: Wrapper })

  expect(
    screen.getByRole('heading', { name: /welcome user reviewer/i }),
  ).toBeVisible()
  expect(screen.getByText('78%')).toBeVisible()
  expect(screen.getByText('READY')).toBeVisible()
  expect(screen.getByText('Routes')).toBeVisible()
  expect(screen.getByText('MUI')).toBeVisible()
  expect(screen.getByText('Storybook')).toBeVisible()
})
