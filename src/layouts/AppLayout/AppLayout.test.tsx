import { BrowserRouter } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import useMediaQuery from '@mui/material/useMediaQuery'
import AppLayout from '@/layouts/AppLayout/AppLayout'
import { DASHBOARD_TITLE } from '@/locales/en'

jest.mock('@mui/material/useMediaQuery')

const mockedUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>

beforeEach(() => {
  mockedUseMediaQuery.mockReturnValue(false)
})

test('renders the main application layout', () => {
  render(<AppLayout />, { wrapper: (props) => <BrowserRouter {...props} /> })

  expect(screen.getByTestId('appbar-title')).toHaveTextContent(DASHBOARD_TITLE)
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
})

test('toggles the drawer open and closed', async () => {
  render(<AppLayout />, {
    wrapper: (props) => <BrowserRouter {...props} />,
  })

  expect(screen.getByTestId('app-drawer')).toBeVisible()
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'true')

  fireEvent.click(screen.getByRole('button', { name: /close drawer/i }))
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'false')

  fireEvent.click(screen.getByRole('button', { name: /open drawer/i }))
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'true')
})

test('uses a closed temporary drawer without shrinking the app bar on mobile', () => {
  mockedUseMediaQuery.mockReturnValue(true)

  render(<AppLayout />, {
    wrapper: (props) => <BrowserRouter {...props} />,
  })

  const appBar = screen.getByRole('banner')
  const drawer = screen.getByTestId('app-drawer')

  expect(drawer).toHaveAttribute('data-open', 'false')
  expect(drawer).not.toHaveClass('MuiDrawer-docked')
  expect(appBar).toHaveStyle('width: 100%')

  fireEvent.click(screen.getByRole('button', { name: /open drawer/i }))

  expect(drawer).toHaveAttribute('data-open', 'true')
  expect(appBar).toHaveStyle('width: 100%')

  fireEvent.click(screen.getByTestId('close-drawer-button'))
  expect(drawer).toHaveAttribute('data-open', 'false')
})

test('resets the drawer state when crossing the mobile breakpoint', () => {
  let isMobile = false
  mockedUseMediaQuery.mockImplementation(() => isMobile)

  const { rerender } = render(<AppLayout />, {
    wrapper: (props) => <BrowserRouter {...props} />,
  })

  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'true')

  fireEvent.click(screen.getByTestId('close-drawer-button'))
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'false')

  isMobile = true
  rerender(<AppLayout />)
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'false')
  expect(screen.getByTestId('app-drawer')).not.toHaveClass('MuiDrawer-docked')

  fireEvent.click(screen.getByTestId('open-drawer-button'))
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'true')

  isMobile = false
  rerender(<AppLayout />)
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'true')
  expect(screen.getByTestId('app-drawer')).toHaveClass('MuiDrawer-docked')
})
