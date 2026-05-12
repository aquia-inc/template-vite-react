import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { appRoutes } from '@/router/router'

jest.mock('@/utils/config', () => {
  const { createAppConfig } = jest.requireActual('@/utils/appConfig')

  return {
    __esModule: true,
    default: createAppConfig({
      VITE_AWS_REGION: 'us-east-1',
      VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
      VITE_COGNITO_REDIRECT_SIGN_IN: 'https://localhost:3000/auth/login',
      VITE_COGNITO_REDIRECT_SIGN_OUT: 'https://localhost:3000/auth/logout',
      VITE_USER_POOL_CLIENT_ID: '1234567890123456789012',
      VITE_USER_POOL_ID: 'us-east-1_123456789',
    }),
  }
})

const createSession = (jwtToken = '123456') => ({
  tokens: {
    accessToken: {
      toString: () => jwtToken,
    },
  },
})

const renderRoute = (initialEntry: string) => {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialEntry],
  })

  return {
    router,
    ...render(<RouterProvider router={router} />),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getCurrentUser as jest.Mock).mockResolvedValue({
    username: 'developer',
  })
})

test('unauthenticated visit to / renders the home page', async () => {
  ;(fetchAuthSession as jest.Mock).mockRejectedValue(new Error('No session'))
  ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('No user'))

  renderRoute('/')

  expect(
    await screen.findByRole('heading', {
      name: /start from a working react foundation instead of an empty repo/i,
    }),
  ).toBeInTheDocument()
})

test('authenticated visit to / redirects to /app', async () => {
  ;(fetchAuthSession as jest.Mock).mockResolvedValue(createSession())
  ;(getCurrentUser as jest.Mock).mockResolvedValue({
    username: 'developer',
  })

  renderRoute('/')

  expect(await screen.findByTestId('appbar-title')).toHaveTextContent(
    'Dashboard',
  )
  expect(await screen.findByText(/Welcome User/i)).toBeInTheDocument()
})

test('unauthenticated visit to /app redirects to login', async () => {
  ;(fetchAuthSession as jest.Mock).mockRejectedValue(new Error('No session'))
  ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('No user'))

  renderRoute('/app')

  expect(
    await screen.findByText(/Please sign-in to your account/i),
  ).toBeInTheDocument()
})

test('unknown routes fall back to the home page', async () => {
  ;(fetchAuthSession as jest.Mock).mockRejectedValue(new Error('No session'))
  ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('No user'))

  renderRoute('/missing')

  expect(
    await screen.findByRole('heading', {
      name: /start from a working react foundation instead of an empty repo/i,
    }),
  ).toBeInTheDocument()
})
