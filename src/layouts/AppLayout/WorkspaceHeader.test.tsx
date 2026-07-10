import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider } from '@mui/material/styles'
import WorkspaceHeader from '@/layouts/AppLayout/WorkspaceHeader'
import theme from '@/theme/theme'

jest.mock('@mui/material/useMediaQuery')

const mockedUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>{children}</MemoryRouter>
  </ThemeProvider>
)

const StatefulWorkspaceHeader = ({
  onUnavailable,
}: {
  onUnavailable: (feature: 'Notifications') => void
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <WorkspaceHeader
      isMobile={false}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onUnavailable={onUnavailable}
    />
  )
}

beforeEach(() => {
  mockedUseMediaQuery.mockReset()
  mockedUseMediaQuery.mockReturnValue(false)
})

test('renders desktop search controls and preserves the full query', async () => {
  const user = userEvent.setup()
  const onUnavailable = jest.fn()

  render(<StatefulWorkspaceHeader onUnavailable={onUnavailable} />, {
    wrapper: Wrapper,
  })

  const search = screen.getByRole('searchbox', { name: 'Search dashboard' })
  expect(search).toHaveAttribute('placeholder', 'Search records')
  expect(screen.getByText('⌘ K')).toBeVisible()

  await user.type(search, 'audit')
  expect(search).toHaveValue('audit')

  await user.click(screen.getByRole('button', { name: 'Notifications' }))
  expect(onUnavailable).toHaveBeenCalledWith('Notifications')
})

test.each([
  ['Meta', { metaKey: true }],
  ['Control', { ctrlKey: true }],
])('focuses dashboard search with the %s+K shortcut', (_, modifier) => {
  render(
    <WorkspaceHeader
      isMobile={false}
      searchQuery=""
      onSearchChange={jest.fn()}
      onUnavailable={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

  fireEvent.keyDown(window, { key: 'k', ...modifier })

  expect(
    screen.getByRole('searchbox', { name: 'Search dashboard' }),
  ).toHaveFocus()
})

test('does not cancel the search shortcut when search is not mounted', () => {
  render(
    <WorkspaceHeader
      isMobile
      searchQuery=""
      onSearchChange={jest.fn()}
      onUnavailable={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

  const shortcutEvent = new KeyboardEvent('keydown', {
    key: 'k',
    metaKey: true,
    cancelable: true,
  })
  fireEvent(window, shortcutEvent)

  expect(shortcutEvent.defaultPrevented).toBe(false)
})

test('keeps search flexible in the compact desktop header', () => {
  mockedUseMediaQuery.mockReturnValue(true)
  render(
    <WorkspaceHeader
      isMobile={false}
      searchQuery=""
      onSearchChange={jest.fn()}
      onUnavailable={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

  const header = screen.getByRole('banner')
  const search = screen.getByRole('searchbox', { name: 'Search dashboard' })
  const searchContainer = search.parentElement?.parentElement

  expect(header).toHaveStyle({ gap: '6px' })
  expect(searchContainer).toHaveStyle('flex: 1 1 180px; min-width: 0;')
  expect(
    window.getComputedStyle(screen.getByRole('button', { name: /login/i }))
      .minHeight,
  ).toBe('44px')
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

  expect(screen.getByTestId('appbar-title')).toHaveTextContent('Dashboard')
  expect(
    screen.queryByRole('heading', { name: 'Dashboard' }),
  ).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  expect(screen.queryByText('Workspace')).not.toBeInTheDocument()
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Notifications' }),
  ).not.toBeInTheDocument()
})
