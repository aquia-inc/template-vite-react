import { BrowserRouter, useLoaderData } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import AppLayout from '@/layouts/AppLayout/AppLayout'
import { DASHBOARD_TITLE } from '@/locales/en'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}))

beforeEach(() => {
  ;(useLoaderData as jest.Mock).mockReturnValue('jwt-token')
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
