import { act, render, screen, waitFor } from '@testing-library/react'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import AuthProvider from '@/store/auth/AuthProvider'
import AuthStateContext from '@/store/auth/AuthStateContext'
import { AuthState } from '@/store/auth/types'
import { createDemoAuthState, saveDemoAuthSession } from '@/utils/demoAuth'

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
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
  }
})

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useMatch: jest.fn(),
  useNavigate: jest.fn(),
}))

const StateSnapshot = () => (
  <AuthStateContext.Consumer>
    {(state: AuthState) => (
      <output data-testid="auth-state">{JSON.stringify(state)}</output>
    )}
  </AuthStateContext.Consumer>
)

beforeEach(() => {
  jest.clearAllMocks()
  window.sessionStorage.clear()
  ;(useLocation as jest.Mock).mockReturnValue({ pathname: '/app' })
  ;(useMatch as jest.Mock).mockReturnValue({ path: '/app' })
  ;(useNavigate as jest.Mock).mockReturnValue(jest.fn())
})

test('initializes auth state from a demo auth session without Amplify calls', async () => {
  const demoState = createDemoAuthState('reviewer@example.com')
  saveDemoAuthSession(demoState)

  await act(async () => {
    render(
      <AuthProvider>
        <StateSnapshot />
      </AuthProvider>,
    )
  })

  await waitFor(() => {
    expect(
      JSON.parse(screen.getByTestId('auth-state').textContent ?? ''),
    ).toEqual({
      ...demoState,
      error: null,
    })
    expect(fetchAuthSession).not.toHaveBeenCalled()
    expect(getCurrentUser).not.toHaveBeenCalled()
  })
})
