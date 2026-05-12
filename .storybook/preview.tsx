import type { Decorator } from '@storybook/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from '../src/theme/theme'

export const decorators: Decorator[] = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  ),
]
