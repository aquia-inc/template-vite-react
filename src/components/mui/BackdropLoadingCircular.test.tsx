import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import BackdropLoadingCircular from '@/components/mui/BackdropLoadingCircular'

// Mocking useMediaQuery
jest.mock('@mui/material/useMediaQuery')

const theme = createTheme()

test('does not render anything when loading is false', () => {
  render(
    <ThemeProvider theme={theme}>
      <BackdropLoadingCircular loading={false} />
    </ThemeProvider>
  )
  expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument()
})

test('renders a Backdrop with CircularProgress when loading is true', () => {
  render(
    <ThemeProvider theme={theme}>
      <BackdropLoadingCircular loading={true} />
    </ThemeProvider>
  )
  expect(screen.getByTestId('circular-progress')).toBeInTheDocument()
})

test('has border radius 2 when the breakpoint is down', () => {
  ;(useMediaQuery as jest.Mock).mockReturnValue(true)
  render(
    <ThemeProvider theme={theme}>
      <BackdropLoadingCircular loading={true} />
    </ThemeProvider>
  )

  const backdrop = screen.getByRole('presentation', { hidden: true })
  expect(backdrop).toHaveStyle({ borderRadius: '16px' })
})

test('has border radius 0 when the breakpoint is up', () => {
  ;(useMediaQuery as jest.Mock).mockReturnValue(false)
  render(
    <ThemeProvider theme={theme}>
      <BackdropLoadingCircular loading={true} />
    </ThemeProvider>
  )
  const backdrop = screen.getByRole('presentation', { hidden: true })
  expect(backdrop).toHaveStyle({ borderRadius: 0 })
})
