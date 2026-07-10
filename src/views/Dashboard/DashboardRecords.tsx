import * as React from 'react'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { alpha, useTheme, type Theme } from '@mui/material/styles'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import CreateForm from '@/components/crud/CreateForm'
import type { FormField } from '@/types'
import type { DashboardRecord, DashboardStatusTone } from './dashboard.types'
import { dashboardRecords } from './dashboardData'

export interface DashboardRecordsProps {
  initialRecords?: DashboardRecord[]
  searchQuery?: string
}

const recordSchema: FormField[] = [
  {
    name: 'name',
    label: 'Record',
    type: 'text',
    required: true,
    component: TextField,
  },
  {
    name: 'owner',
    label: 'Owner',
    type: 'text',
    required: true,
    component: TextField,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'text',
    required: true,
    component: TextField,
  },
]

const recordIcons = {
  route: AccountTreeOutlinedIcon,
  auth: LockOutlinedIcon,
  upload: CloudUploadOutlinedIcon,
} as const

const normalizeRecordValue = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const createRecordId = (
  name: string,
  existingRecords: DashboardRecord[],
): string => {
  const slug =
    name
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'record'
  const existingIds = new Set(existingRecords.map(({ id }) => id))
  let candidate = slug
  let suffix = 2

  while (existingIds.has(candidate)) {
    candidate = `${slug}-${suffix}`
    suffix += 1
  }

  return candidate
}

export const filterDashboardRecords = (
  records: DashboardRecord[],
  query = '',
): DashboardRecord[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return records

  return records.filter((record) =>
    [record.name, record.owner, record.status, record.updated].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  )
}

export const getStatusTone = (status: string): DashboardStatusTone => {
  const normalized = status.trim().toLocaleLowerCase()
  if (normalized === 'ready') return 'ready'
  if (normalized === 'configured') return 'configured'
  return 'example'
}

const statusColor = (tone: DashboardStatusTone, theme: Theme) => {
  if (tone === 'ready') return theme.workspace.success
  if (tone === 'configured') return theme.workspace.primary
  return theme.workspace.violet
}

const RecordIcon = ({ record }: { record: DashboardRecord }) => {
  const Icon = recordIcons[record.icon]
  const tone = getStatusTone(record.status)

  return (
    <Box
      aria-hidden="true"
      sx={(theme) => {
        const color = statusColor(tone, theme)
        return {
          alignItems: 'center',
          bgcolor: alpha(color, 0.1),
          borderRadius: 2,
          color,
          display: 'flex',
          flex: '0 0 auto',
          height: 36,
          justifyContent: 'center',
          width: 36,
        }
      }}
    >
      <Icon fontSize="small" />
    </Box>
  )
}

const StatusChip = ({ status }: { status: string }) => {
  const tone = getStatusTone(status)

  return (
    <Chip
      label={status}
      size="small"
      sx={(theme) => {
        const color = statusColor(tone, theme)
        return {
          bgcolor: alpha(color, 0.1),
          color,
          fontWeight: 700,
        }
      }}
    />
  )
}

interface RecordMobileCardProps {
  record: DashboardRecord
  onOpenActions: (anchor: HTMLButtonElement, record: DashboardRecord) => void
}

const RecordMobileCard = ({ record, onOpenActions }: RecordMobileCardProps) => (
  <Paper
    elevation={0}
    sx={(theme) => ({
      border: `1px solid ${theme.workspace.border}`,
      borderRadius: 3,
      p: 1.5,
    })}
  >
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <RecordIcon record={record} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 700 }} variant="body2">
          {record.name}
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {record.owner} · {record.updated}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <StatusChip status={record.status} />
        </Box>
      </Box>
      <IconButton
        aria-label={`Open actions for ${record.name}`}
        onClick={(event) => onOpenActions(event.currentTarget, record)}
        size="small"
      >
        <MoreHorizIcon />
      </IconButton>
    </Stack>
  </Paper>
)

const EmptyState = ({ searchQuery }: { searchQuery: string }) => {
  const normalizedQuery = searchQuery.trim()

  return (
    <Box
      role="status"
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        minHeight: 120,
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography color="text.secondary" variant="body2">
        {normalizedQuery
          ? `No records match “${normalizedQuery}”.`
          : 'No records yet.'}
      </Typography>
    </Box>
  )
}

export const DashboardRecords = ({
  initialRecords = dashboardRecords,
  searchQuery = '',
}: DashboardRecordsProps): JSX.Element => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [currentRecords, setCurrentRecords] = React.useState(initialRecords)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)
  const [activeRecord, setActiveRecord] =
    React.useState<DashboardRecord | null>(null)
  const filteredRecords = React.useMemo(
    () => filterDashboardRecords(currentRecords, searchQuery),
    [currentRecords, searchQuery],
  )

  const closeMenu = () => {
    setMenuAnchor(null)
    setActiveRecord(null)
  }

  const openMenu = (anchor: HTMLButtonElement, record: DashboardRecord) => {
    setMenuAnchor(anchor)
    setActiveRecord(record)
  }

  const deleteRecord = (id: string) => {
    setCurrentRecords((existingRecords) =>
      existingRecords.filter((record) => record.id !== id),
    )
    closeMenu()
  }

  const createRecord = (data: unknown) => {
    const fields =
      data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
    const name = normalizeRecordValue(fields.name)
    const owner = normalizeRecordValue(fields.owner)
    const status = normalizeRecordValue(fields.status)

    if (!name || !owner || !status) return

    setCurrentRecords((existingRecords) => [
      ...existingRecords,
      {
        id: createRecordId(name, existingRecords),
        name,
        owner,
        status,
        updated: 'Just now',
        icon: 'route',
      },
    ])
    setCreateOpen(false)
  }

  const columns = React.useMemo<GridColDef<DashboardRecord>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Record',
        flex: 1.5,
        minWidth: 190,
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', height: '100%' }}
          >
            <RecordIcon record={row} />
            <Typography noWrap sx={{ fontWeight: 700 }} variant="body2">
              {row.name}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'owner',
        headerName: 'Owner',
        flex: 1,
        minWidth: 110,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 125,
        renderCell: ({ row }) => (
          <Stack sx={{ height: '100%', justifyContent: 'center' }}>
            <StatusChip status={row.status} />
          </Stack>
        ),
      },
      {
        field: 'updated',
        headerName: 'Updated',
        flex: 1,
        minWidth: 110,
      },
      {
        field: 'actions',
        headerName: '',
        align: 'center',
        disableColumnMenu: true,
        filterable: false,
        hideable: false,
        sortable: false,
        width: 64,
        renderCell: ({ row }) => (
          <IconButton
            aria-label={`Open actions for ${row.name}`}
            onClick={(event) => openMenu(event.currentTarget, row)}
            size="small"
          >
            <MoreHorizIcon />
          </IconButton>
        ),
      },
    ],
    [],
  )

  const noRowsOverlay = React.useMemo(
    () =>
      function NoRowsOverlay() {
        return <EmptyState searchQuery={searchQuery} />
      },
    [searchQuery],
  )
  const recordCount = `${filteredRecords.length} ${
    filteredRecords.length === 1 ? 'record' : 'records'
  }`

  return (
    <Paper
      component="section"
      elevation={0}
      sx={(currentTheme) => ({
        border: `1px solid ${currentTheme.workspace.border}`,
        borderRadius: `${currentTheme.workspace.cardRadius}px`,
        boxShadow: currentTheme.workspace.cardShadow,
        overflow: 'hidden',
      })}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
            <Typography component="h2" sx={{ fontWeight: 750 }} variant="h6">
              All records
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {recordCount}
            </Typography>
          </Stack>
          <Typography color="text.secondary" variant="caption">
            Last synced just now
          </Typography>
        </Box>
        {!isMobile ? (
          <Button
            onClick={() => setCreateOpen(true)}
            startIcon={<AddOutlinedIcon />}
            variant="contained"
          >
            New record
          </Button>
        ) : null}
      </Stack>

      {isMobile ? (
        <Box sx={{ px: 1.5, pb: 2 }}>
          {filteredRecords.length ? (
            <Stack
              aria-label="Example records"
              component="ul"
              spacing={1}
              sx={{ m: 0, p: 0 }}
            >
              {filteredRecords.map((record) => (
                <Box component="li" key={record.id} sx={{ listStyle: 'none' }}>
                  <RecordMobileCard onOpenActions={openMenu} record={record} />
                </Box>
              ))}
            </Stack>
          ) : (
            <EmptyState searchQuery={searchQuery} />
          )}
        </Box>
      ) : (
        <Box sx={{ height: 460, width: '100%' }}>
          <DataGrid<DashboardRecord>
            columns={columns}
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[10]}
            rowHeight={54}
            rows={filteredRecords}
            slots={{ noRowsOverlay }}
          />
        </Box>
      )}

      {isMobile ? (
        <Fab
          aria-label="New record"
          color="primary"
          onClick={() => setCreateOpen(true)}
          size="medium"
          sx={(currentTheme) => ({
            bottom: `calc(${currentTheme.workspace.mobileNavHeight}px + 28px)`,
            position: 'fixed',
            right: 20,
            zIndex: currentTheme.zIndex.speedDial,
          })}
        >
          <AddOutlinedIcon />
        </Fab>
      ) : null}

      <Menu
        anchorEl={menuAnchor}
        onClose={closeMenu}
        open={Boolean(menuAnchor)}
      >
        {activeRecord ? (
          <MenuItem
            aria-label={`Delete ${activeRecord.name}`}
            onClick={() => deleteRecord(activeRecord.id)}
          >
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            Delete record
          </MenuItem>
        ) : null}
      </Menu>

      {createOpen ? (
        <CreateForm
          onClose={() => setCreateOpen(false)}
          onSubmit={createRecord}
          open={createOpen}
          schema={recordSchema}
          submitLabel="Create record"
          title="Create record"
        />
      ) : null}
    </Paper>
  )
}
