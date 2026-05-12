import {
  getRouterBasename,
  normalizePublicBasePath,
} from '@/utils/publicBasePath'

describe('normalizePublicBasePath', () => {
  test.each([
    [undefined, '/'],
    ['', '/'],
    ['/', '/'],
    ['template-vite-react', '/template-vite-react/'],
    ['/template-vite-react', '/template-vite-react/'],
    ['template-vite-react/', '/template-vite-react/'],
    ['/template-vite-react/', '/template-vite-react/'],
    ['//template-vite-react//', '/template-vite-react/'],
  ])('normalizes %p to %p', (value, expected) => {
    expect(normalizePublicBasePath(value)).toBe(expected)
  })
})

describe('getRouterBasename', () => {
  test.each([
    [undefined, undefined],
    ['', undefined],
    ['/', undefined],
    ['/template-vite-react/', '/template-vite-react'],
    ['template-vite-react', '/template-vite-react'],
  ])('derives %p from %p', (value, expected) => {
    expect(getRouterBasename(value)).toBe(expected)
  })
})
