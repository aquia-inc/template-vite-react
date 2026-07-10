import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import theme from '@/theme/theme'
import { DashboardContent } from './Dashboard'

jest.mock('@mui/material/useMediaQuery')

const mockedUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

beforeEach(() => {
  mockedUseMediaQuery.mockReset()
  mockedUseMediaQuery.mockReturnValue(false)
})

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

test('exposes the records region as a local navigation target', () => {
  render(<DashboardContent username="reviewer" searchQuery="" />, {
    wrapper: Wrapper,
  })

  expect(
    screen.getByRole('region', { name: 'Example records' }),
  ).toHaveAttribute('id', 'records')
})

test('keeps activity mounted but hides its region from the mobile accessibility tree', () => {
  mockedUseMediaQuery.mockReturnValue(true)

  const { container } = render(
    <DashboardContent username="reviewer" searchQuery="" />,
    {
      wrapper: Wrapper,
    },
  )

  expect(
    screen.queryByRole('region', { name: 'Template activity' }),
  ).not.toBeInTheDocument()
  expect(
    container.querySelector('[role="region"][aria-label="Template activity"]'),
  ).toHaveAttribute('aria-hidden', 'true')
  expect(screen.getByText('Template activity')).toBeInTheDocument()
})
