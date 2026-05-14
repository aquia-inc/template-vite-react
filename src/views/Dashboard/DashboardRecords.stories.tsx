import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardRecords } from './Dashboard'

type Story = StoryObj<typeof DashboardRecords>

export default {
  title: 'Pages/Dashboard/Records',
  component: DashboardRecords,
  parameters: {
    layout: 'padded',
  },
} as Meta<typeof DashboardRecords>

export const Populated: Story = {}

export const Empty: Story = {
  args: {
    initialRecords: [],
  },
}
