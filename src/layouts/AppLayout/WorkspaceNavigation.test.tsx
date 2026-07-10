import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import WorkspaceNavigation from '@/layouts/AppLayout/WorkspaceNavigation'
import theme from '@/theme/theme'

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

test('renders the desktop rail and navigates between dashboard sections', async () => {
  const user = userEvent.setup()
  const onNavigate = jest.fn()
  const onUnavailable = jest.fn()

  render(
    <WorkspaceNavigation
      activeSection="overview"
      isMobile={false}
      onNavigate={onNavigate}
      onUnavailable={onUnavailable}
    />,
    { wrapper: Wrapper },
  )

  expect(screen.getByRole('complementary')).toHaveAccessibleName(
    'Workspace navigation',
  )
  expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await user.click(screen.getByRole('button', { name: 'Records' }))
  expect(onNavigate).toHaveBeenCalledWith('records')

  await user.click(screen.getByRole('button', { name: 'Settings' }))
  expect(onUnavailable).toHaveBeenCalledWith('Settings')
})

test('renders the compact mobile actions and reports profile as unavailable', async () => {
  const user = userEvent.setup()
  const onNavigate = jest.fn()
  const onUnavailable = jest.fn()

  render(
    <WorkspaceNavigation
      activeSection="activity"
      isMobile
      onNavigate={onNavigate}
      onUnavailable={onUnavailable}
    />,
    { wrapper: Wrapper },
  )

  const navigation = screen.getByRole('navigation', {
    name: 'Mobile dashboard',
  })
  expect(navigation).toBeVisible()
  expect(screen.getByRole('button', { name: 'Home' })).toHaveClass(
    'Mui-selected',
  )
  expect(
    screen.queryByRole('button', { name: 'Activity' }),
  ).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Upload' }))
  expect(onNavigate).toHaveBeenCalledWith('upload')

  await user.click(screen.getByRole('button', { name: 'Profile' }))
  expect(onUnavailable).toHaveBeenCalledWith('Profile')
})
