import { createContext } from 'react'
import AuthDispatchContext from '@/store/auth/AuthDispatchContext'
import { AuthActionParams } from '@/store/auth/types'

test('creates a context with the provided value', () => {
  const context = createContext((value: AuthActionParams) => value)

  expect(context).toBeDefined()
  expect(context).not.toBeNull()
  expect(typeof context.Provider).toBe('object')
  expect(typeof AuthDispatchContext.Provider).toBe('object')
})
