import formatBytes from '@/utils/formatBytes'

test('returns 0 Bytes if input is 0', () => {
  expect(formatBytes(0)).toBe('0 Bytes')
})

test('formats bytes to KB', () => {
  expect(formatBytes(1024)).toBe('1 KB')
})

test('formats bytes to MB', () => {
  expect(formatBytes(1048576)).toBe('1 MB')
})

test('formats bytes to GB', () => {
  expect(formatBytes(1073741824)).toBe('1 GB')
})

test('formats bytes to TB', () => {
  expect(formatBytes(1099511627776)).toBe('1 TB')
})

test('formats bytes to PB', () => {
  expect(formatBytes(1125899906842624)).toBe('1 PB')
})

test('formats bytes to EB', () => {
  expect(formatBytes(1152921504606846976)).toBe('1 EB')
})

test('returns decimal values if specified', () => {
  expect(formatBytes(1500, 2)).toBe('1.46 KB')
  expect(formatBytes(1500000, 2)).toBe('1.43 MB')
})

test('returns 0 decimal places if negative decimal is provided', () => {
  expect(formatBytes(1500, -2)).toBe('1 KB')
})
