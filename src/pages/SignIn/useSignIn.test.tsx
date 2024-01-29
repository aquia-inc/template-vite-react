import { Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom'
import { renderHook, act, waitFor } from '@testing-library/react'
import loginUser from '@/actions/loginUser'
import useAlert from '@/hooks/useAlert'
import useAuthDispatch from '@/store/auth/useAuthDispatch'
import useSignIn from '@/pages/SignIn/useSignIn'
import AuthError from '@/errors/AuthError'

jest.mock('@/actions/loginUser')
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))
jest.mock('@/hooks/useAlert')
jest.mock('@/store/auth/useAuthDispatch')
jest.mock('@/store/auth/useAuthState')
;(useAuthDispatch as jest.Mock).mockReturnValue(jest.fn())
;(useNavigate as jest.Mock).mockReturnValue(jest.fn())
const setAlertMock = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useAlert as jest.Mock).mockReturnValue({ setAlert: setAlertMock })
})

test('handles form submission', async () => {
  ;(loginUser as jest.Mock).mockResolvedValueOnce({})
  const { result } = renderHook(useSignIn)
  await act(async () => {
    result.current.handleSubmit()
  })
  waitFor(() => {
    expect(result.current.loading).toBe(false)
    expect(loginUser).toHaveBeenCalledWith(expect.any(Function), {
      email: 'test@test.com',
      password: 'password',
    })
  })
})

test('handles federated sign in', async () => {
  ;(Auth.federatedSignIn as jest.Mock).mockResolvedValueOnce({})
  const { result } = renderHook(useSignIn)
  await act(async () => {
    await result.current.handleFederatedSignIn()
  })
  waitFor(() => {
    expect(Auth.federatedSignIn).toHaveBeenCalledWith({ provider: 'COGNITO' })
  })
})

test('toggles password visibility', async () => {
  const { result } = renderHook(useSignIn)
  await act(() => {
    result.current.setShowPassword(true)
  })
  waitFor(() => {
    expect(result.current.showPassword).toBe(true)
  })
})

test('handles form submission error', async () => {
  ;(loginUser as jest.Mock).mockRejectedValueOnce(
    new AuthError({ status: 400, message: 'Invalid credentials' })
  )
  const { result } = renderHook(useSignIn)
  await act(async () => {
    result.current.handleSubmit()
  })
  waitFor(() => {
    expect(result.current.loading).toBe(false)
    expect(setAlertMock).toHaveBeenCalledWith({
      message: 'There was an error logging in. Please try again.',
      severity: 'error',
    })
  })
})

test('handles federated sign in error', async () => {
  ;(Auth.federatedSignIn as jest.Mock).mockRejectedValueOnce(
    new AuthError({ status: 401, message: 'Unauthorized federated sign in' })
  )
  const { result } = renderHook(useSignIn)
  await act(async () => {
    await result.current.handleFederatedSignIn()
  })
  waitFor(() => {
    expect(setAlertMock).toHaveBeenCalledWith({
      message: 'There was an error with the identity provider.',
      severity: 'error',
    })
  })
})
