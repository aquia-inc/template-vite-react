import { act, render, fireEvent, waitFor } from '@testing-library/react'
import PasswordVisibilityToggle from './PasswordVisibilityToggle'

let setShowPassword: jest.Mock

beforeEach(() => {
  jest.resetAllMocks()
  setShowPassword = jest.fn()
})

test('renders without crashing', () => {
  const { getByRole } = render(
    <PasswordVisibilityToggle
      showPassword={false}
      setShowPassword={setShowPassword}
    />
  )

  expect(getByRole('button')).toBeInTheDocument()
})

test('changes icon when clicked', async () => {
  const { getByRole, rerender } = render(
    <PasswordVisibilityToggle
      showPassword={false}
      setShowPassword={setShowPassword}
    />
  )
  const button = getByRole('button')

  await act(async () => {
    fireEvent.click(button)
  })

  waitFor(() => {
    expect(setShowPassword).toHaveBeenCalledWith(true)
  })

  rerender(
    <PasswordVisibilityToggle
      showPassword={true}
      setShowPassword={setShowPassword}
    />
  )

  await act(async () => {
    fireEvent.click(button)
  })

  waitFor(() => {
    expect(setShowPassword).toHaveBeenCalledWith(false)
  })
})

test('calls setShowPassword with correct argument when clicked', async () => {
  const { getByRole } = render(
    <PasswordVisibilityToggle
      showPassword={false}
      setShowPassword={setShowPassword}
    />
  )
  const button = getByRole('button')

  await act(async () => {
    fireEvent.click(button)
  })

  waitFor(() => {
    expect(setShowPassword).toHaveBeenCalledWith(true)
  })
})

test('prevents default on mouse down', async () => {
  const { getByRole } = render(
    <PasswordVisibilityToggle
      showPassword={false}
      setShowPassword={setShowPassword}
    />
  )
  const button = getByRole('button')
  const preventDefault = jest.fn()

  await act(async () => {
    fireEvent.mouseDown(button, { preventDefault })
  })

  waitFor(() => {
    expect(preventDefault).toHaveBeenCalled()
  })
})
