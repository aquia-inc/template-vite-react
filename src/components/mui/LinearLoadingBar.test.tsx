import { render } from '@testing-library/react'
import LinearLoadingBar from '@/components/mui/LinearLoadingBar'

test('renders correctly', () => {
  const { getByRole } = render(<LinearLoadingBar />)
  expect(getByRole('progressbar')).toBeInTheDocument()
})
