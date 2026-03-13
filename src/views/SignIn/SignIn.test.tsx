import { JSXElementConstructor, ReactElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import loginUser from '@/actions/loginUser'
import SignIn from '@/views/SignIn/SignIn'
import { Routes } from '@/router/constants'

function setup(
  jsx: ReactElement<
    typeof SignIn,
    string | JSXElementConstructor<typeof SignIn>
  >,
) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))
jest.mock('@/actions/loginUser')

const useNavigateMock = useNavigate as jest.Mock
const navigateMock = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  useNavigateMock.mockReturnValue(navigateMock)
})

test('submits correct form data in the SignIn page', async () => {
  ;(loginUser as jest.Mock).mockResolvedValueOnce({})
  const { user } = setup(<SignIn />)

  await user.type(
    screen.getByRole('textbox', { name: /email/i }),
    'user@example.com',
  )
  await user.type(
    screen.getByLabelText(/password/i, {
      selector: 'input',
    }),
    'password',
  )
  await user.click(screen.getByRole('button', { name: /sign in/i }))

  await waitFor(() => {
    expect(loginUser).toHaveBeenCalledWith(expect.any(Function), {
      email: 'user@example.com',
      password: 'password',
    })
    expect(navigateMock).toHaveBeenCalledWith(Routes.DASHBOARD)
  })
})
