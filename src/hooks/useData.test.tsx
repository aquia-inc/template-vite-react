import { renderHook, act } from '@testing-library/react'
import { DataProvider, useData } from '@/hooks/useData'
import React from 'react'

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DataProvider>{children}</DataProvider>
)

describe('useData', () => {
  test('provides default state and updates', () => {
    const { result } = renderHook(() => useData(), { wrapper })
    act(() => {
      result.current.setData({ data: { foo: 'bar' } })
    })
    expect(result.current.data.data).toEqual({ foo: 'bar' })
  })

  test('accepts initial state', () => {
    const initial = { data: { value: 1 } }
    const customWrapper: React.FC<{ children: React.ReactNode }> = ({
      children,
    }) => <DataProvider initialState={initial}>{children}</DataProvider>
    const { result } = renderHook(() => useData(), { wrapper: customWrapper })
    expect(result.current.data).toEqual(initial)
  })

  test('works without provider', () => {
    const { result } = renderHook(() => useData())
    expect(result.current.data).toHaveProperty('data')
    expect(typeof result.current.setData).toBe('function')
    act(() => {
      result.current.setData({ data: { baz: 'qux' } })
      ;(result.current.data as any).setData?.()
    })
  })
})
