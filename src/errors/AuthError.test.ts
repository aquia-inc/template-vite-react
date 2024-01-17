import AuthError, {
  AuthErrorStatus,
  AuthErrorStatusText,
} from '@/errors/AuthError'

describe('AuthError', () => {
  test('is an instance of "AuthError" and capture the stack trace', () => {
    const error = new AuthError()
    expect(error).toBeInstanceOf(AuthError)
    expect(error.name).toBe('AuthError')
    expect(error.stack).toBeDefined()
  })

  test('creates an error with a default status of 401', () => {
    const error = new AuthError()
    expect(error.status).toBe(AuthErrorStatus.UNAUTHORIZED)
    expect(error.statusText).toBe(AuthErrorStatusText.UNAUTHORIZED)
    expect(error.message).toBe(AuthErrorStatusText.UNAUTHORIZED)
  })

  test('creates a Forbidden error with a status of 403', () => {
    const error = new AuthError({ status: 403 })
    expect(error.status).toBe(AuthErrorStatus.FORBIDDEN)
  })

  test('creates an instance of AuthError with custom message', () => {
    const message = 'Invalid Session'
    const error = new AuthError({ message })
    expect(error.message).toBe(message)
  })

  test('defaults key to UNKNOWN when status code does not match any predefined status codes', () => {
    const error = new AuthError({ status: 999 })
    expect(error.status).toBe(999)
    expect(error.statusText).toBe(AuthErrorStatusText.UNKNOWN)
  })

  test('has a Response object in the response property', () => {
    const error = new AuthError({ status: 401 })
    const response = error.toResponse()
    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(AuthErrorStatus.UNAUTHORIZED)
    expect(response.statusText).toBe(AuthErrorStatusText.UNAUTHORIZED)
  })
})
