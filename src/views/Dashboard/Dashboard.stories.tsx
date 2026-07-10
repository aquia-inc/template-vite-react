import type { Meta, StoryObj } from '@storybook/react-vite'
import Box from '@mui/material/Box'
import { DashboardContent } from './Dashboard'

type Story = StoryObj<typeof DashboardContent>

const viewport = (name: string, width: number, height: number) => ({
  viewport: {
    defaultViewport: name,
    options: {
      [name]: {
        name,
        styles: { height: `${height}px`, width: `${width}px` },
      },
    },
  },
})

export default {
  title: 'Pages/Dashboard',
  component: DashboardContent,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    searchQuery: '',
    username: 'reviewer',
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          bgcolor: (theme) => theme.workspace.canvas,
          minHeight: '100vh',
          p: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Story />
      </Box>
    ),
  ],
} as Meta<typeof DashboardContent>

export const Mobile430: Story = {
  parameters: viewport('Mobile430', 430, 932),
}

export const Tablet1024: Story = {
  parameters: viewport('Tablet1024', 1024, 1366),
}

export const Desktop1600: Story = {
  parameters: viewport('Desktop1600', 1600, 1000),
}
