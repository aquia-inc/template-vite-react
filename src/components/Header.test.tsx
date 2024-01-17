import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PUBLIC_APP_NAME } from '@/locales/en'
import Header from '@/components/Header'

beforeEach(() => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  )
})

test('renders the Header', () => {
  const headerElement = screen.getByRole('banner')
  expect(headerElement).toBeInTheDocument()
})

test('renders the AppBar', () => {
  const appBarElement = screen.getByRole('toolbar')
  expect(appBarElement).toBeInTheDocument()
})

test('renders the app title', () => {
  const titleElement = screen.getByText(PUBLIC_APP_NAME)
  expect(titleElement).toBeInTheDocument()
})

test('renders the AuthButton', () => {
  const authButtonElement = screen.getByRole('button')
  expect(authButtonElement).toBeInTheDocument()
})
