import getInitials from '@/utils/getInitials'

test('returns initials from the full name', () => {
  expect(getInitials({ name: 'John Doe' })).toEqual('JD')
})

test('handles names with more than two words', () => {
  expect(getInitials({ name: 'John Jacob Doe' })).toEqual('JD')
})

test('handles names with only one word', () => {
  expect(getInitials({ name: 'John' })).toEqual('J')
})

test('handles names with special characters', () => {
  expect(getInitials({ name: 'Jöhn Døe' })).toEqual('JD')
})

test('returns initials from the name if the email is not provided', () => {
  expect(getInitials({ name: 'John Doe' })).toEqual('JD')
})

test('returns initials from the email if the name is not provided', () => {
  expect(getInitials({ email: 'john.doe@example.com' })).toEqual('JD')
})

test('returns initials from the email if the name is a single character', () => {
  expect(getInitials({ name: 'J', email: 'john.doe@example.com' })).toEqual(
    'JD'
  )
})

test('returns initials from the first two characters of the email if there is no period in the email', () => {
  expect(getInitials({ email: 'john@example.com' })).toEqual('JO')
})
