import { StoryObj } from '@storybook/react'
import UserAvatar from '@/components/UserAvatar'

type Story = StoryObj<typeof UserAvatar>

export default {
  title: 'Components/UserAvatar',
  component: UserAvatar,
  argTypes: {
    avatarSrc: { control: 'text' },
    email: { control: 'text' },
    name: { control: 'text' },
  },
}

export const Default: Story = {}
