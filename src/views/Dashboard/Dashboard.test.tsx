import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardRecords } from './Dashboard'

test('renders seeded dashboard records', () => {
  render(<DashboardRecords />)

  expect(screen.getByText('Route map')).toBeInTheDocument()
  expect(screen.getByText('Auth loader')).toBeInTheDocument()
  expect(screen.getByText('Upload flow')).toBeInTheDocument()
})

test('creates a dashboard record from the modal form', async () => {
  const user = userEvent.setup()

  render(<DashboardRecords />)

  await user.click(screen.getByRole('button', { name: /new record/i }))
  const dialog = screen.getByRole('dialog', { name: /create record/i })
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
  fireEvent.click(
    within(dialog).getByRole('button', { name: /create record/i }),
  )

  expect(await screen.findByText('Policy checklist')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('deletes a dashboard record', async () => {
  const user = userEvent.setup()

  render(<DashboardRecords />)

  const routeMapRow = screen.getByRole('row', { name: /route map/i })
  await user.click(within(routeMapRow).getByRole('button', { name: /delete/i }))

  await waitFor(() => {
    expect(screen.queryByText('Route map')).not.toBeInTheDocument()
  })
})

test('shows the records empty state when there are no rows', () => {
  render(<DashboardRecords initialRecords={[]} />)

  expect(screen.getByText('No records yet')).toBeInTheDocument()
})
