import {
  clearDemoAuthSession,
  createDemoAuthState,
  getDemoAuthSession,
  saveDemoAuthSession,
} from '@/utils/demoAuth'

beforeEach(() => {
  window.localStorage.clear()
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
