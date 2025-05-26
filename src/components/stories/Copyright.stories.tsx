import type { StoryObj, Meta } from '@storybook/react'
import Copyright from '@/components/Copyright'

type Story = StoryObj<typeof Copyright>

export default {
  title: 'Components/Copyright',
  component: Copyright,
  argTypes: {
    typographyProps: { control: 'object' },
    sx: { control: 'object' },
  },
} as Meta<typeof Copyright>

export const Default: Story = {}

export const WithTypographyProps: Story = {
  render: () => <Copyright typographyProps={{ color: 'text.primary' }} />,
  parameters: {
    title: 'With typography props',
  },
}
