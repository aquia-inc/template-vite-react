import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import {
  DashboardActivityPanel,
  DashboardUploadPanel,
} from './DashboardUtilityPanels'

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

test('renders upload files and the activity timeline', () => {
  render(
    <>
      <DashboardUploadPanel />
      <DashboardActivityPanel />
    </>,
    { wrapper: Wrapper },
  )

  expect(screen.getByText('requirements.json')).toBeVisible()
  expect(screen.getByText('sample-data.csv')).toBeVisible()
  expect(screen.getByText('Environment config')).toBeVisible()
  expect(screen.getByText('Stable')).toBeVisible()
})

test('offsets the upload and activity anchors below the sticky header', () => {
  render(
    <>
      <DashboardUploadPanel />
      <DashboardActivityPanel />
    </>,
    { wrapper: Wrapper },
  )

  expect(document.getElementById('upload')).toHaveStyle({
    scrollMarginTop: '96px',
  })
  expect(document.getElementById('activity')).toHaveStyle({
    scrollMarginTop: '96px',
  })
})

test('appends selected files and removes every displayed workspace file', async () => {
  const user = userEvent.setup()

  render(<DashboardUploadPanel />, { wrapper: Wrapper })

  const selectedFile = new File(['id,name\n1,Demo'], 'new-data.csv', {
    type: 'text/csv',
  })
  await user.upload(
    screen.getByLabelText('Drag and Drop File Selection'),
    selectedFile,
  )

  expect(screen.getByText('requirements.json')).toBeVisible()
  expect(screen.getByText('sample-data.csv')).toBeVisible()
  expect(screen.getByText('new-data.csv')).toBeVisible()

  await user.click(
    screen.getByRole('button', { name: 'Remove requirements.json' }),
  )
  await user.click(screen.getByRole('button', { name: 'Remove new-data.csv' }))

  expect(screen.queryByText('requirements.json')).not.toBeInTheDocument()
  expect(screen.queryByText('new-data.csv')).not.toBeInTheDocument()
  expect(screen.getByText('sample-data.csv')).toBeVisible()
})
