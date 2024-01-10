import sanitizeUrl from '@/utils/sanitizeUrl'

test('removes double slashes from the URL', () => {
  const url = 'http://example.com//path//to//resource'
  const sanitizedUrl = sanitizeUrl(url)
  expect(sanitizedUrl.toString()).toBe('http://example.com/path/to/resource')
})

test('does not modify URLs without double slashes', () => {
  const url = 'http://example.com/path/to/resource'
  const sanitizedUrl = sanitizeUrl(url)
  expect(sanitizedUrl.toString()).toBe(url)
})
