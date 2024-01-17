import toTitleCase from '@/utils/toTitleCase'

test('converts a lowercase string to proper case', () => {
  expect(toTitleCase('hello world')).toBe('Hello World')
})

test('converts an uppercase string to proper case', () => {
  expect(toTitleCase('HELLO WORLD')).toBe('Hello World')
})

test('converts a mixed case string to proper case', () => {
  expect(toTitleCase('hELlo WOrlD')).toBe('Hello World')
})

test('handles an empty string', () => {
  expect(toTitleCase('')).toBe('')
})

test('handles a string with only whitespace characters', () => {
  expect(toTitleCase('   ')).toBe('   ')
})
