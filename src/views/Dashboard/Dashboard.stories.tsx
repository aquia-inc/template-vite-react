import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardContent } from './Dashboard'

type Story = StoryObj<typeof DashboardContent>

export default {
  title: 'Pages/Dashboard',
  component: DashboardContent,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    username: 'developer',
  },
} as Meta<typeof DashboardContent>

export const Default: Story = {}

export const EmptyUsername: Story = {
  args: {
    username: '',
  },
}
