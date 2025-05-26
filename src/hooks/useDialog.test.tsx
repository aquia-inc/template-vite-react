import { renderHook, act, screen } from '@testing-library/react'
import DialogProvider, { useDialog } from '@/hooks/useDialog'
import React from 'react'

jest.mock('@mui/material/Dialog', () => (props: any) => (
  <div data-testid="dialog" data-open={String(props.open)}>
    {props.open ? props.children : null}
  </div>
))

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DialogProvider>{children}</DialogProvider>
)

describe('useDialog', () => {
  test('returns default context outside provider', () => {
    const { result } = renderHook(() => useDialog())
    expect(Array.isArray(result.current)).toBe(true)
    // call default openDialog to cover return statement
    expect(() => result.current[0]({ children: <div /> })).not.toThrow()
  })

  test('opens and closes dialog', () => {
    const Child: React.FC<{ foo?: string }> = ({ foo }) => (
      <div data-testid="child" data-foo={foo}>
        child
      </div>
    )
    const { result } = renderHook(() => useDialog(), { wrapper })
    act(() => {
      result.current[0]({ children: <Child />, foo: 'bar' })
    })
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('child')).toHaveAttribute('data-foo', 'bar')

    act(() => {
      result.current[1]()
    })
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
  })

  test('renders non element children', () => {
    const { result } = renderHook(() => useDialog(), { wrapper })
    act(() => {
      result.current[0]({ children: 'text' as any })
    })
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('dialog').textContent).toBe('text')
  })
})
