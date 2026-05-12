import { fetchAuthSession } from 'aws-amplify/auth'
import { AuthErrorStatus } from '@/errors/AuthError'
import getJWT from '@/utils/getJWT'

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns the JWT token when the session is valid', async () => {
  ;(fetchAuthSession as jest.Mock).mockResolvedValue({
    tokens: {
      accessToken: {
        toString: () => '123456',
      },
    },
  })

  await expect(getJWT()).resolves.toBe('123456')
  expect(fetchAuthSession).toHaveBeenCalled()
})

test('returns a 401 Response when the session is invalid', async () => {
  ;(fetchAuthSession as jest.Mock).mockResolvedValue({
    tokens: {
      accessToken: {
        toString: () => '',
      },
    },
  })

  const promise = getJWT()
  await expect(promise).rejects.toBeInstanceOf(Response)
  await expect(promise).rejects.toHaveProperty(
    'status',
    AuthErrorStatus.UNAUTHORIZED,
  )
})
