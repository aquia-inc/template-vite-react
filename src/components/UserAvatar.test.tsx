import { render, screen } from '@testing-library/react'
import UserAvatar from '@/components/UserAvatar'
import getInitials from '@/utils/getInitials'

test('renders an avatar image when avatarSrc is provided', () => {
  const avatarSrc = 'https://example.com/avatar.jpg'
  render(
    <UserAvatar
      avatarSrc={avatarSrc}
      email="test@example.com"
      name="Test User"
    />
  )
  const avatar = screen.getByRole('img')
  expect(avatar).toBeInTheDocument()
  expect(avatar).toHaveAttribute('src', avatarSrc)
})

test('renders initials when avatarSrc is not provided but name and email are', () => {
  const name = 'Test User'
  const email = 'test@example.com'
  render(<UserAvatar email={email} name={name} />)
  const avatar = screen.getByTestId('avatar')
  expect(avatar).toBeInTheDocument()
  expect(avatar).not.toHaveAttribute('src')
  expect(avatar.textContent).toBe(getInitials({ name, email }))
})
