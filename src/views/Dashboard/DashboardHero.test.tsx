import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import { getElementContrastRatio } from './contrast.test-utils'
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

test.each(['Protected workspace', 'Routes', 'MUI', 'Storybook'])(
  'keeps the %s tag at normal-text contrast',
  (label) => {
    render(<DashboardHero username="reviewer" />, { wrapper: Wrapper })

    const chip = screen.getByText(label).closest('.MuiChip-root')
    expect(chip).not.toBeNull()
    expect(getElementContrastRatio(chip as Element)).toBeGreaterThanOrEqual(4.5)
  },
)
