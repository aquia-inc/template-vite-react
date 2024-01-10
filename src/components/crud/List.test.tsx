import { render, fireEvent, waitFor, act } from '@testing-library/react'
import List from '@/components/crud/List'
import TextField from '@mui/material/TextField'

const items = [
  { id: '1', name: 'Item 1', note: 'Note 1' },
  { id: '2', name: 'Item 2', note: 'Note 2' },
]

const schema = [
  { type: 'text', component: TextField, name: 'name', label: 'Item Name' },
  { type: 'text', component: TextField, name: 'note', label: 'Item Note' },
]

const deleteItemMock = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders all items', () => {
  const { getByText, getAllByRole, getByRole } = render(
    <List items={items} schema={schema} deleteItem={deleteItemMock} />
  )
  const grid = getByRole('grid')
  const rows = getAllByRole('row')
  const headerRow = getAllByRole('columnheader')

  expect(grid).toContainElement(getByText(items[0].name))
  expect(grid).toContainElement(getByText(items[1].name))
  expect(grid).toContainElement(getByText(schema[0].label))
  expect(grid).toContainElement(getByText(schema[1].label))
  expect(getByText('Item 1')).toBeInTheDocument()
  expect(rows.length).toBe(items.length + 1)
  expect(headerRow.length).toBe(schema.length + 1)
})

test('renders a column title from either the field label or name in title-case', () => {
  const { getAllByRole, getByText } = render(
    <List
      items={items}
      schema={[
        { type: 'text', component: TextField, name: 'name' },
        {
          type: 'text',
          component: TextField,
          name: 'note',
          label: 'item note',
        },
      ]}
      deleteItem={deleteItemMock}
    />
  )

  const rows = getAllByRole('row')[0]

  expect(rows).toContainElement(getByText('Name'))
  expect(rows).toContainElement(getByText('Item Note'))
})

test('deletes an item when delete button is clicked', async () => {
  const { getAllByLabelText } = render(
    <List items={items} schema={schema} deleteItem={deleteItemMock} />
  )

  const deleteButtons = getAllByLabelText('delete')

  await act(() => {
    fireEvent.click(deleteButtons[0])
  })

  waitFor(() => {
    expect(deleteItemMock).toHaveBeenCalledTimes(1)
    expect(deleteItemMock).toHaveBeenCalledWith(items[0].id)
  })
})
