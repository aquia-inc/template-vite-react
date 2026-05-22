// List.tsx
import * as React from 'react'
import { DataGrid, GridColDef, GridRowId, GridRowModel } from '@mui/x-data-grid'
import { FormField } from '@/types'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import toTitleCase from '@/utils/toTitleCase'

export interface ListProps {
  items: GridRowModel[]
  schema: FormField[]
  deleteItem: (id: string) => void
  emptyLabel?: string
}

const List: React.FC<ListProps> = ({
  items,
  schema,
  deleteItem,
  emptyLabel = 'No records yet',
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
        const rowLabel =
          typeof params.row.name === 'string' ? params.row.name : params.id

        return (
          <IconButton
            aria-label={`Delete ${rowLabel}`}
            color="primary"
            onClick={() => handleDelete(params.id)}
          >
            <DeleteIcon />
          </IconButton>
        )
      },
    },
  ]

  const NoRowsOverlay = React.useMemo(
    () =>
      function ListNoRowsOverlay() {
        return (
          <Box
            role="status"
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              {emptyLabel}
            </Typography>
          </Box>
        )
      },
    [emptyLabel],
  )

  return (
    <DataGrid
      // getRowId={(row: FormField) => row.name}
      rows={items}
      columns={columns}
      pagination
      slots={{ noRowsOverlay: NoRowsOverlay }}
    />
  )
}

export default List
