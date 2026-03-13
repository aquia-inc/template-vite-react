// List.tsx
import * as React from 'react'
import { DataGrid, GridColDef, GridRowId, GridRowModel } from '@mui/x-data-grid'
import { FormField } from '@/types'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import toTitleCase from '@/utils/toTitleCase'

export interface ListProps {
  items: GridRowModel[]
  schema: FormField[]
  deleteItem: (id: string) => void
}

const List: React.FC<ListProps> = ({
  items,
  schema,
  deleteItem,
}): JSX.Element => {
  const handleDelete = (id: GridRowId) => {
    deleteItem(id as string)
  }

  const columns: GridColDef[] = [
    ...schema.map(
      ({ label, name }: FormField): GridColDef => ({
        field: name,
        flex: 1,
        headerName: toTitleCase(label || name),
      }),
    ),
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      disableColumnMenu: true,
      filterable: false,
      hideable: false,
      hideSortIcons: true,
      sortable: false,
      renderCell: (params) => {
        return (
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => handleDelete(params.id)}
          >
            <DeleteIcon />
          </IconButton>
        )
      },
    },
  ]

  return (
    <DataGrid
      // getRowId={(row: FormField) => row.name}
      rows={items}
      columns={columns}
      pagination
    />
  )
}

export default List
