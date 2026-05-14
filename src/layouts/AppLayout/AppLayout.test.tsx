import { BrowserRouter } from 'react-router-dom'
import { render, screen, fireEvent, within } from '@testing-library/react'
import AppLayout from '@/layouts/AppLayout/AppLayout'
import { DASHBOARD_TITLE } from '@/locales/en'
import { RouteNames } from '@/router/constants'

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
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'false')
  expect(
    screen.getByRole('button', { name: /open drawer/i }),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('app-drawer')).queryByText(RouteNames.DASHBOARD),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('app-drawer')).getByRole('link', {
      name: RouteNames.DASHBOARD,
    }),
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /open drawer/i }))
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'true')
  expect(
    within(screen.getByTestId('app-drawer')).getByText(RouteNames.DASHBOARD),
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /close drawer/i }))
  expect(screen.getByTestId('app-drawer')).toHaveAttribute('data-open', 'false')
})
