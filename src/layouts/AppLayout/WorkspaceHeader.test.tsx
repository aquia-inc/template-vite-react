import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import WorkspaceHeader from '@/layouts/AppLayout/WorkspaceHeader'
import theme from '@/theme/theme'

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>{children}</MemoryRouter>
  </ThemeProvider>
)

test('renders desktop search controls and sends user input', async () => {
  const user = userEvent.setup()
  const onSearchChange = jest.fn()
  const onUnavailable = jest.fn()

  render(
    <WorkspaceHeader
      isMobile={false}
      searchQuery=""
      onSearchChange={onSearchChange}
      onUnavailable={onUnavailable}
    />,
    { wrapper: Wrapper },
  )

  const search = screen.getByRole('searchbox', { name: 'Search dashboard' })
  expect(search).toHaveAttribute('placeholder', 'Search records')
  expect(screen.getByText('⌘ K')).toBeVisible()

  await user.type(search, 'audit')
  expect(onSearchChange).toHaveBeenLastCalledWith('t')

  await user.click(screen.getByRole('button', { name: 'Notifications' }))
  expect(onUnavailable).toHaveBeenCalledWith('Notifications')
})

test('focuses dashboard search with the command palette shortcut', () => {
  render(
    <WorkspaceHeader
      isMobile={false}
      searchQuery=""
      onSearchChange={jest.fn()}
      onUnavailable={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

  fireEvent.keyDown(window, { key: 'k', metaKey: true })

  expect(
    screen.getByRole('searchbox', { name: 'Search dashboard' }),
  ).toHaveFocus()
})

test('keeps the title and auth control while hiding desktop actions on mobile', () => {
  render(
    <WorkspaceHeader
      isMobile
      searchQuery=""
      onSearchChange={jest.fn()}
      onUnavailable={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  expect(screen.queryByText('Workspace')).not.toBeInTheDocument()
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Notifications' }),
  ).not.toBeInTheDocument()
})
