import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SvgIcon from '@mui/material/SvgIcon'
import AppDrawerButton from '@/components/AppDrawerButton'

const mockProps = {
  label: 'Test Button',
  to: '/test',
  icon: (
    <SvgIcon titleAccess="Test icon">
      <path d="M0 0h24v24H0z" fill="none" />
    </SvgIcon>
  ),
}

const renderButton = (open = true) => {
  render(
    <BrowserRouter>
      <AppDrawerButton {...mockProps} open={open} />
    </BrowserRouter>,
  )
}

test('renders the button with the given label', () => {
  renderButton()

  const link = screen.getByRole('link', { name: /Test Button/i })
  expect(link).toBeInTheDocument()
  expect(screen.getByText(/Test Button/i)).toBeInTheDocument()
})

test('renders the icon', () => {
  renderButton()

  const icon = screen.getByTitle(/test icon/i)
  expect(icon).toBeInTheDocument()
})

test('navigates to the given URL when the button is clicked', () => {
  renderButton()

  const link = screen.getByRole('link', { name: /Test Button/i })
  expect(link).toHaveAttribute('href', '/test')
})

test('preserves an accessible name while collapsed without rendering the label text', () => {
  renderButton(false)

  const link = screen.getByRole('link', { name: /Test Button/i })
  expect(link).toBeInTheDocument()
  expect(screen.queryByText(/Test Button/i)).not.toBeInTheDocument()
})
