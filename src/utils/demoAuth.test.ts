import {
  clearDemoAuthSession,
  createDemoAuthState,
  getDemoAuthSession,
  saveDemoAuthSession,
} from '@/utils/demoAuth'

beforeEach(() => {
  window.sessionStorage.clear()
})

test('creates a deterministic demo auth state from an email address', () => {
  expect(createDemoAuthState('reviewer@example.com')).toEqual({
    jwtToken: 'demo-auth-token',
    username: 'reviewer',
    email: 'reviewer@example.com',
  })
})

test('persists and clears a demo auth session', () => {
  const state = createDemoAuthState('reviewer@example.com')

  saveDemoAuthSession(state)
  expect(getDemoAuthSession()).toEqual(state)

  clearDemoAuthSession()
  expect(getDemoAuthSession()).toBeNull()
})

test('clears invalid JSON demo session data', () => {
  window.sessionStorage.setItem(
    'template-vite-react:demo-auth-session',
    'invalid-json',
  )

  expect(getDemoAuthSession()).toBeNull()
  expect(
    window.sessionStorage.getItem('template-vite-react:demo-auth-session'),
  ).toBeNull()
})

test('clears invalid demo session shapes', () => {
  window.sessionStorage.setItem(
    'template-vite-react:demo-auth-session',
    JSON.stringify({ jwtToken: 'demo-auth-token' }),
  )

  expect(getDemoAuthSession()).toBeNull()
  expect(
    window.sessionStorage.getItem('template-vite-react:demo-auth-session'),
  ).toBeNull()
})
