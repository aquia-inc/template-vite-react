import { render } from '@testing-library/react'
import CenteredCardContent from '@/components/mui/CardContent'

test('renders without crashing', () => {
  const { getByTestId } = render(
    <CenteredCardContent data-testid="card-content" />
  )
  expect(getByTestId('card-content')).toBeInTheDocument()
})

test('renders its children', () => {
  const { getByText } = render(
    <CenteredCardContent>
      <div>Test Child</div>
    </CenteredCardContent>
  )
  expect(getByText('Test Child')).toBeTruthy()
})

test('applies the correct styles', () => {
  const { getByText } = render(
    <CenteredCardContent>
      <div>Test Child</div>
    </CenteredCardContent>
  )
  const child = getByText('Test Child')
  const styles = window.getComputedStyle(child.parentNode as Element)
  expect(styles.height).toBe('100%')
  expect(styles.display).toBe('flex')
  expect(styles.flexDirection).toBe('column')
  expect(styles.alignItems).toBe('center')
  expect(styles.justifyContent).toBe('center')
  expect(styles.textAlign).toBe('center')
})
