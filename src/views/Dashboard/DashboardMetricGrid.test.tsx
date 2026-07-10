import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import { dashboardMetrics } from './dashboardData'
import { DashboardMetricGrid } from './DashboardMetricGrid'

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

test('renders the three seeded readiness metrics', () => {
  render(<DashboardMetricGrid metrics={dashboardMetrics} />, {
    wrapper: Wrapper,
  })

  expect(screen.getByText('Routes wired')).toBeVisible()
  expect(screen.getByText('6')).toBeVisible()
  expect(screen.getByText('Reusable primitives')).toBeVisible()
  expect(screen.getByText('18')).toBeVisible()
  expect(screen.getByText('Quality gates')).toBeVisible()
  expect(screen.getByText('5')).toBeVisible()
})
