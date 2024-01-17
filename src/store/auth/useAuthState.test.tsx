import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import AuthStateContext from '@/store/auth/AuthStateContext'
import useAuthState from '@/store/auth/useAuthState'

test('throws an error when used outside AuthProvider', () => {
  const { result } = renderHook(() => useAuthState())
  waitFor(() => {
    expect(result.current.error).toBeDefined()
    expect(result.current.error).toEqual(
      new Error('useAuthState must be used within an AuthProvider')
    )
  })
})

test('returns the context value from AuthStateContext', () => {
  const mockState = { jwtToken: 'test' }
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthStateContext.Provider value={mockState}>
      {children}
    </AuthStateContext.Provider>
  )
  const { result } = renderHook(() => useAuthState(), { wrapper })
  expect(result.current).toBe(mockState)
})
