import { act, fireEvent, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextField from '@mui/material/TextField'
import CreateForm from '@/components/crud/CreateForm'

const defaultValues = {
  name: 'Vendor 1',
  address: 'Address 1',
}

const schema = [
  {
    id: 'name',
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    component: TextField,
  },
  {
    id: 'address',
    name: 'address',
    label: 'Address',
    type: 'text',
    required: true,
    component: TextField,
  },
]

let onCloseMock: jest.Mock
let onSubmitMock: jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  onCloseMock = jest.fn()
  onSubmitMock = jest.fn()
})

test('renders the form when open is true', async () => {
  const { getByLabelText } = render(
    <CreateForm
      open={true}
      onClose={onCloseMock}
      onSubmit={onSubmitMock}
      schema={schema}
    />,
  )
  const nameField = getByLabelText(/Name/)
  const addressField = getByLabelText(/Address/)
  expect(nameField).toBeInTheDocument()
  expect(addressField).toBeInTheDocument()
})

test('calls onSubmit with form data when form is submitted', async () => {
  const user = userEvent.setup()
  const { getByLabelText, getByRole } = render(
    <CreateForm
      open={true}
      onClose={onCloseMock}
      onSubmit={onSubmitMock}
      schema={schema}
      submitLabel="Submit"
    />,
  )

  const nameField = getByLabelText(/Name/)
  const addressField = getByLabelText(/Address/)
  const form = getByRole('form')
  const submit = getByRole('button', { name: 'Submit' })

  await user.type(nameField, defaultValues.name)
  await user.type(addressField, defaultValues.address)
  await waitFor(() => {
    expect(submit).toBeEnabled()
  })
  act(() => {
    fireEvent.submit(form)
  })

  await waitFor(() => {
    expect(onSubmitMock).toHaveBeenCalledWith(defaultValues)
  })
})

test('calls onClose when Cancel button is clicked', async () => {
  const { getByText } = render(
    <CreateForm
      open={true}
      onClose={onCloseMock}
      onSubmit={onSubmitMock}
      schema={schema}
    />,
  )

  act(() => {
    fireEvent.click(getByText('Cancel'))
  })

  await waitFor(() => {
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})

test('submits form data only when all required fields are filled and form is not disabled', async () => {
  const { getByRole } = render(
    <CreateForm
      open={true}
      schema={schema}
      onClose={() => {}}
      onSubmit={onSubmitMock}
      FormProps={{
        defaultValues,
        mode: 'onChange',
      }}
      submitLabel="Submit"
    />,
  )

  const form = getByRole('form')
  const submitButton = getByRole('button', { name: 'Submit' })

  await waitFor(() => {
    expect(submitButton).toBeEnabled()
  })

  act(() => {
    fireEvent.submit(form)
  })

  await waitFor(() => {
    expect(onSubmitMock).toHaveBeenCalledTimes(1)
    expect(onSubmitMock).toHaveBeenCalledWith(defaultValues)
  })
})
