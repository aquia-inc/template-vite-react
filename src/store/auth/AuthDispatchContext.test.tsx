import { PropsWithChildren, useContext } from 'react'
import { renderHook } from '@testing-library/react'
import AuthDispatchContext from '@/store/auth/AuthDispatchContext'
import { AuthActionParams } from '@/store/auth/types'

test('provides the dispatch function to consumers', () => {
  const dispatch = jest.fn((value: AuthActionParams) => value)
  const wrapper = ({ children }: PropsWithChildren): JSX.Element => (
    <AuthDispatchContext.Provider value={dispatch}>
      {children}
    </AuthDispatchContext.Provider>
  )

  const { result } = renderHook(() => useContext(AuthDispatchContext), {
    wrapper,
  })

  expect(result.current).toBe(dispatch)
})
