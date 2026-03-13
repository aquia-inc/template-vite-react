import { Auth } from 'aws-amplify'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { appRoutes } from '@/router/router'

const createSession = (jwtToken = '123456') => ({
  getAccessToken: () => ({
    getJwtToken: () => jwtToken,
  }),
  isValid: () => true,
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
  ;(Auth.currentUserInfo as jest.Mock).mockResolvedValue({
    username: 'developer',
  })
})

test('unauthenticated visit to / renders the home page', async () => {
  ;(Auth.currentSession as jest.Mock).mockRejectedValue(new Error('No session'))
  ;(Auth.currentAuthenticatedUser as jest.Mock).mockRejectedValue(
    new Error('No user'),
  )

  renderRoute('/')

  expect(
    await screen.findByRole('heading', {
      name: /start from a working react foundation instead of an empty repo/i,
    }),
  ).toBeInTheDocument()
})

test('authenticated visit to / redirects to /app', async () => {
  ;(Auth.currentSession as jest.Mock).mockResolvedValue(createSession())
  ;(Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue({
    username: 'developer',
  })

  renderRoute('/')

  expect(await screen.findByTestId('appbar-title')).toHaveTextContent(
    'Dashboard',
  )
  expect(await screen.findByText(/Welcome User/i)).toBeInTheDocument()
})

test('unauthenticated visit to /app redirects to login', async () => {
  ;(Auth.currentSession as jest.Mock).mockRejectedValue(new Error('No session'))
  ;(Auth.currentAuthenticatedUser as jest.Mock).mockRejectedValue(
    new Error('No user'),
  )

  renderRoute('/app')

  expect(
    await screen.findByText(/Please sign-in to your account/i),
  ).toBeInTheDocument()
})

test('unknown routes fall back to the home page', async () => {
  ;(Auth.currentSession as jest.Mock).mockRejectedValue(new Error('No session'))
  ;(Auth.currentAuthenticatedUser as jest.Mock).mockRejectedValue(
    new Error('No user'),
  )

  renderRoute('/missing')

  expect(
    await screen.findByRole('heading', {
      name: /start from a working react foundation instead of an empty repo/i,
    }),
  ).toBeInTheDocument()
})
