import { AuthActions } from '@/actions/actionTypes'

/**
 * @typedef {Object} AuthState - Parameters for the login hook.
 * @property {string} jwtToken - The user's jwtToken
 * @property {Error} error - An error object
 */
export type AuthState = {
  jwtToken?: string
  username?: string
  email?: string
  identityId?: string
  credentials?: {
    accessKeyId: string
    secretAccessKey: string
    sessionToken?: string
    expiration?: Date
  }
  error?: Error | null
}

export type AuthProviderProps = {
  children: React.ReactNode
}

export interface AuthActionParams {
  type: AuthActions
  payload?: AuthState
  error?: Error | null
}
