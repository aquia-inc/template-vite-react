import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardRecords } from './DashboardRecords'
import { dashboardRecords } from './dashboardData'

type Story = StoryObj<typeof DashboardRecords>

export default {
  title: 'Pages/Dashboard/Records',
  component: DashboardRecords,
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <DashboardRecords
      key={JSON.stringify([
        args.initialRecords ?? 'default',
        args.searchQuery ?? '',
      ])}
      {...args}
    />
  ),
} as Meta<typeof DashboardRecords>

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

export const Desktop: Story = {
  args: { initialRecords: dashboardRecords },
  parameters: viewport('Desktop', 1600, 1000),
}

export const Tablet: Story = {
  args: { initialRecords: dashboardRecords },
  parameters: viewport('Tablet', 1024, 1366),
}

export const Mobile: Story = {
  args: { initialRecords: dashboardRecords },
  parameters: viewport('Mobile', 430, 932),
}

export const Filtered: Story = {
  args: {
    initialRecords: dashboardRecords,
    searchQuery: 'configured',
  },
  parameters: viewport('Desktop', 1600, 1000),
}

export const Empty: Story = {
  args: { initialRecords: [] },
  parameters: viewport('Desktop', 1600, 1000),
}
