import getDaysSince from '@/utils/getDaysSince'

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

test('returns 0 for the current date', () => {
  const now = new Date()
  expect(getDaysSince(now)).toBe(0)
})

test('returns the correct number of days since a past date', () => {
  const pastDate = new Date(Date.now() - 5 * ONE_DAY_IN_MS)
  expect(getDaysSince(pastDate)).toBe(5)
})

test('handles dates in the future', () => {
  const futureDate = new Date(Date.now() + 5 * ONE_DAY_IN_MS)
  expect(getDaysSince(futureDate)).toBe(-5)
})

test('handles invalid date objects', () => {
  const invalidDate = new Date('invalid date')
  expect(() => getDaysSince(invalidDate)).toThrow()
})
