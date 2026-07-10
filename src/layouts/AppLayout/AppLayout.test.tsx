import type { PropsWithChildren } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider } from '@mui/material/styles'
import AppLayout from '@/layouts/AppLayout/AppLayout'
import { AlertProvider } from '@/hooks/useAlert'
import theme from '@/theme/theme'

jest.mock('@mui/material/useMediaQuery')

const mockedUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>

const RouterAndAlertWrapper = ({ children }: PropsWithChildren) => (
  <MemoryRouter initialEntries={['/app']}>
    <AlertProvider>
      <Routes>
        <Route path="/app" element={children}>
          <Route index element={<div data-testid="outlet-fixture" />} />
        </Route>
      </Routes>
    </AlertProvider>
  </MemoryRouter>
)

beforeEach(() => {
  mockedUseMediaQuery.mockReset()
})

test('renders the compact mobile shell without a side rail', () => {
  mockedUseMediaQuery.mockReturnValue(true)
  render(
    <ThemeProvider theme={theme}>
      <AppLayout />
    </ThemeProvider>,
    { wrapper: RouterAndAlertWrapper },
  )

  expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  expect(
    screen.getByRole('navigation', { name: 'Mobile dashboard' }),
  ).toBeVisible()
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
})

test('renders the rail and searchable header above the mobile breakpoint', () => {
  mockedUseMediaQuery.mockReturnValue(false)
  render(
    <ThemeProvider theme={theme}>
      <AppLayout />
    </ThemeProvider>,
    { wrapper: RouterAndAlertWrapper },
  )

  expect(screen.getByRole('complementary')).toBeVisible()
  expect(
    screen.getByRole('searchbox', { name: 'Search dashboard' }),
  ).toBeVisible()
  expect(
    screen.queryByRole('navigation', { name: 'Mobile dashboard' }),
  ).not.toBeInTheDocument()
})

test('shows feedback for unavailable shell actions', async () => {
  const user = userEvent.setup()
  mockedUseMediaQuery.mockReturnValue(false)
  render(
    <ThemeProvider theme={theme}>
      <AppLayout />
    </ThemeProvider>,
    { wrapper: RouterAndAlertWrapper },
  )

  await user.click(screen.getByRole('button', { name: 'Notifications' }))

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Notifications are not configured in this template.',
  )
})
