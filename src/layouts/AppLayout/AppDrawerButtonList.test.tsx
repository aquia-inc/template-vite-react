import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { RouteNames, Routes } from '@/router/constants'
import AppDrawerButtonList from '@/layouts/AppLayout/AppDrawerButtonList'

test('renders the list of AppDrawerButton components', () => {
  render(<AppDrawerButtonList />, {
    wrapper: (props) => <BrowserRouter {...props} />,
  })

  const dashboardButton = screen.getByRole('link', {
    name: RouteNames.DASHBOARD,
  })
  expect(dashboardButton).toBeInTheDocument()
  expect(dashboardButton).toHaveAttribute('href', Routes.DASHBOARD)
})
