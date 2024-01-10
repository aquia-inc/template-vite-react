import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { COPYRIGHT_LABEL } from '@/constants'
import Footer from '@/components/Footer'
import theme from '@/theme/theme'

const renderWithTheme = () => {
  render(
    <ThemeProvider theme={theme}>
      <Footer />
    </ThemeProvider>
  )
}

test('renders the StickyFooter with light theme', () => {
  renderWithTheme()
  const footerElement = screen.getByRole('contentinfo')
  expect(footerElement).toBeInTheDocument()
  expect(footerElement).toHaveStyle(
    `background-color: ${theme.palette.grey[200]}`
  )
})

test('renders the Copyright component', () => {
  renderWithTheme()
  const copyrightElement = screen.getByText(new RegExp(`${COPYRIGHT_LABEL}`))
  expect(copyrightElement).toBeInTheDocument()
})
