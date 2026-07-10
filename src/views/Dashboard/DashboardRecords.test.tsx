import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import { dashboardRecords } from './dashboardData'
import {
  DashboardRecords,
  filterDashboardRecords,
  getStatusTone,
} from './DashboardRecords'

jest.mock('@mui/material/useMediaQuery')

const mockedUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

beforeEach(() => {
  mockedUseMediaQuery.mockReset()
  mockedUseMediaQuery.mockReturnValue(false)
})

test('filters records by name, owner, status, and updated label', () => {
  expect(filterDashboardRecords(dashboardRecords, 'upload')).toHaveLength(1)
  expect(filterDashboardRecords(dashboardRecords, 'platform')).toHaveLength(1)
  expect(filterDashboardRecords(dashboardRecords, 'configured')[0].name).toBe(
    'Auth loader',
  )
  expect(filterDashboardRecords(dashboardRecords, '1 hr')).toHaveLength(1)
})

test('returns all records for a blank normalized query', () => {
  expect(filterDashboardRecords(dashboardRecords, '   ')).toBe(dashboardRecords)
})

test('derives a fallback tone without changing arbitrary status text', () => {
  expect(getStatusTone('Ready')).toBe('ready')
  expect(getStatusTone(' Configured ')).toBe('configured')
  expect(getStatusTone('Draft')).toBe('example')
})

test('renders seeded dashboard records and filtered count', () => {
  render(<DashboardRecords />, { wrapper: Wrapper })

  expect(screen.getByText('Route map')).toBeInTheDocument()
  expect(screen.getByText('Auth loader')).toBeInTheDocument()
  expect(screen.getByText('Upload flow')).toBeInTheDocument()
  expect(screen.getByText('3 records')).toBeInTheDocument()
})

test('deletes a record through its overflow menu', async () => {
  const user = userEvent.setup()
  render(<DashboardRecords />, { wrapper: Wrapper })

  await user.click(
    screen.getByRole('button', { name: 'Open actions for Route map' }),
  )
  await user.click(screen.getByRole('menuitem', { name: 'Delete Route map' }))

  await waitFor(() => {
    expect(screen.queryByText('Route map')).not.toBeInTheDocument()
  })
  expect(screen.getByText('2 records')).toBeInTheDocument()
})

test('creates a dashboard record from the modal form', async () => {
  const user = userEvent.setup()
  render(<DashboardRecords />, { wrapper: Wrapper })

  await user.click(screen.getByRole('button', { name: 'New record' }))
  const dialog = screen.getByRole('dialog', { name: 'Create record' })
  await user.type(
    within(dialog).getByRole('textbox', { name: /^record/i }),
    'Policy checklist',
  )
  await user.type(
    within(dialog).getByRole('textbox', { name: /^owner/i }),
    'Operations',
  )
  await user.type(
    within(dialog).getByRole('textbox', { name: /^status/i }),
    'Draft',
  )
  fireEvent.click(within(dialog).getByRole('button', { name: 'Create record' }))

  expect(await screen.findByText('Policy checklist')).toBeInTheDocument()
  expect(screen.getByText('Draft')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}, 10_000)

test('shows the search-aware empty state', () => {
  render(<DashboardRecords searchQuery="no matching record" />, {
    wrapper: Wrapper,
  })

  expect(screen.getByRole('status')).toHaveTextContent(
    'No records match “no matching record”.',
  )
  expect(screen.getByText('0 records')).toBeInTheDocument()
})

test('shows the unfiltered empty state when there are no rows', () => {
  render(<DashboardRecords initialRecords={[]} />, { wrapper: Wrapper })

  expect(screen.getByRole('status')).toHaveTextContent('No records yet.')
})

test('uses record cards on mobile', () => {
  mockedUseMediaQuery.mockReturnValue(true)
  render(<DashboardRecords />, { wrapper: Wrapper })

  expect(screen.getByRole('list', { name: 'Example records' })).toBeVisible()
  expect(screen.getAllByRole('listitem')).toHaveLength(dashboardRecords.length)
  expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'New record' })).toBeVisible()
})
