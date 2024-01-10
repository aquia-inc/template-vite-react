import { render, screen } from '@testing-library/react'
import AppBar from '@/components/AppBar'
import { MuiDrawerWidth } from '@/theme/theme'

test('renders the AppBar with closed drawer', () => {
  render(<AppBar open={false} />)
  const appBarElement = screen.getByRole('banner')
  expect(appBarElement).toBeInTheDocument()
  expect(appBarElement).toHaveStyle(`width: 100%`)
})

test('renders the AppBar with opened drawer', () => {
  render(<AppBar open />)
  const appBarElement = screen.getByRole('banner')
  expect(appBarElement).toBeInTheDocument()
  expect(appBarElement).toHaveStyle(`width: calc(100% - ${MuiDrawerWidth}px)`)
})
