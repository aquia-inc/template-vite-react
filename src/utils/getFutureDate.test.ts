import getFutureDate from '@/utils/getFutureDate'

const input = '2023-01-01T00:00:00.000Z'

test('returns a formatted timestamp of a future date', () => {
  const result = getFutureDate(0, new Date(input))
  expect(result).toEqual('2023-01-01T00:00:00.000Z')
})

test('adds the number of days to the date', () => {
  const result = getFutureDate(1, new Date(input))
  expect(result).toEqual('2023-01-02T00:00:00.000Z')
})
