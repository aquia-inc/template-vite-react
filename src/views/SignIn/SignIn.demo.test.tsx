import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SignIn from '@/views/SignIn/SignIn'

jest.mock('@/utils/config', () => {
  const { createAppConfig } = jest.requireActual('@/utils/appConfig')

  return {
    __esModule: true,
    default: createAppConfig({
      VITE_DEMO_AUTH_ENABLED: 'true',
      VITE_AWS_REGION: '',
      VITE_COGNITO_DOMAIN: '',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_IDP_ENABLED: 'true',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
  }
})

test('clearly indicates demo auth mode on the sign-in page', () => {
  render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>,
  )

  expect(
    screen.getByText(
      /demo auth mode is enabled\. any valid email and password will open the demo app\./i,
    ),
  ).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /login with idp/i })).toBeNull()
})
