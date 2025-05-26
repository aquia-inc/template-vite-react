import { render, waitFor } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import useAuthDispatch from '@/store/auth/useAuthDispatch'
import logoutUser from '@/actions/logoutUser'
import { Routes } from '@/router/constants'
import SignOut from '@/views/SignOut/SignOut'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))
jest.mock('@/store/auth/useAuthDispatch')
jest.mock('@/actions/logoutUser')

test('logs out and navigates to login page', async () => {
  const dispatch = jest.fn()
  const navigate = jest.fn()
  ;(useAuthDispatch as jest.Mock).mockReturnValue(dispatch)
  ;(useNavigate as jest.Mock).mockReturnValue(navigate)
  ;(logoutUser as jest.Mock).mockResolvedValue(undefined)

  render(<SignOut />)

  await waitFor(() => {
    expect(logoutUser).toHaveBeenCalledWith(dispatch)
    expect(navigate).toHaveBeenCalledWith(Routes.AUTH_LOGIN)
  })
})
