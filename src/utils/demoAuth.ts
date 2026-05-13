import { AuthState } from '@/store/auth/types'

const DEMO_AUTH_STORAGE_KEY = 'template-vite-react:demo-auth-session'
const DEMO_AUTH_TOKEN = 'demo-auth-token'
const DEFAULT_DEMO_EMAIL = 'demo@example.com'

const getStorage = (): Storage | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.sessionStorage
}

const isDemoAuthState = (value: unknown): value is AuthState =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as AuthState).jwtToken === 'string' &&
  typeof (value as AuthState).username === 'string' &&
  typeof (value as AuthState).email === 'string'

export const createDemoAuthState = (email = DEFAULT_DEMO_EMAIL): AuthState => {
  const trimmedEmail = email.trim() || DEFAULT_DEMO_EMAIL
  const username = trimmedEmail.split('@')[0] || 'demo'

  return {
    jwtToken: DEMO_AUTH_TOKEN,
    username,
    email: trimmedEmail,
  }
}

export const getDemoAuthSession = (): AuthState | null => {
  const storage = getStorage()
  const rawSession = storage?.getItem(DEMO_AUTH_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    const parsedSession = JSON.parse(rawSession)

    return isDemoAuthState(parsedSession) ? parsedSession : null
  } catch {
    return null
  }
}

export const saveDemoAuthSession = (state: AuthState) => {
  getStorage()?.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(state))
}

export const clearDemoAuthSession = () => {
  getStorage()?.removeItem(DEMO_AUTH_STORAGE_KEY)
}
