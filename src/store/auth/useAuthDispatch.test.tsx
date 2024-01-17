import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import AuthDispatchContext from '@/store/auth/AuthDispatchContext'
import useAuthDispatch from '@/store/auth/useAuthDispatch'

test('throws an error when used outside AuthProvider', () => {
  const { result } = renderHook(() => useAuthDispatch())
  waitFor(() => {
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      new Error('useAuthDispatch must be used within an AuthProvider')
    )
  })
})

test('returns the context value from AuthDispatchContext', () => {
  const mockDispatch = jest.fn()
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthDispatchContext.Provider value={mockDispatch}>
      {children}
    </AuthDispatchContext.Provider>
  )
  const { result } = renderHook(() => useAuthDispatch(), { wrapper })
  expect(result.current).toBe(mockDispatch)
})
