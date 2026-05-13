/**
 * The default view that an authenticated user first sees when they visit the
 *  app. It demonstrates the template's protected app shell with realistic
 *  dashboard content and reusable UI primitives.
 * @module views/Dashboard/Dashboard
 */
import * as React from 'react'
import { useLoaderData } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DashboardIcon from '@mui/icons-material/Dashboard'
import List from '@/components/crud/List'
import MultiDropzone from '@/components/MultiDropzone/MultiDropzone'
import type { UploadedFile } from '@/components/MultiDropzone/types'
import type { FormField } from '@/types'

export interface DashboardContentProps {
  username?: string
}

const summaryCards = [
  {
    label: 'Routes wired',
    value: '6',
    detail: 'Public, auth, protected, and fallback routes',
  },
  {
    label: 'Reusable primitives',
    value: '18',
    detail: 'Layout, feedback, form, upload, and MUI wrappers',
  },
  {
    label: 'Quality gates',
    value: '5',
    detail: 'Install, lint, test, build, and Storybook checks',
  },
]

const checklistItems = [
  'Replace demo copy with product workflows',
  'Connect protected routes to your API data',
  'Extend Storybook with domain-specific states',
  'Keep auth behavior isolated behind loaders and providers',
]

const activityItems = [
  {
    label: 'Environment config',
    status: 'Ready to customize',
  },
  {
    label: 'Protected app shell',
    status: 'Mounted at /app',
  },
  {
    label: 'Storybook examples',
    status: 'Component-first workflow',
  },
]

const recordSchema: FormField[] = [
  {
    name: 'name',
    label: 'Record',
    type: 'text',
    component: TextField,
  },
  {
    name: 'owner',
    label: 'Owner',
    type: 'text',
    component: TextField,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'text',
    component: TextField,
  },
]

const records = [
  {
    id: 'route-map',
    name: 'Route map',
    owner: 'Frontend',
    status: 'Ready',
  },
  {
    id: 'auth-loader',
    name: 'Auth loader',
    owner: 'Platform',
    status: 'Configured',
  },
  {
    id: 'upload-flow',
    name: 'Upload flow',
    owner: 'Product',
    status: 'Example',
  },
]

const uploadedFiles: UploadedFile[] = [
  {
    id: 'requirements-json',
    name: 'requirements.json',
    progress: 100,
  },
  {
    id: 'sample-data-csv',
    name: 'sample-data.csv',
    progress: 62,
    showProgressBar: true,
  },
]

const noop = () => undefined

export const DashboardContent: React.FC<DashboardContentProps> = ({
  username = '',
}): JSX.Element => {
  const theme = useTheme()
  const displayName = username || 'developer'

  return (
    <Stack spacing={4} sx={{ pb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
          p: { xs: 3, md: 4 },
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'center' }}
              >
                <DashboardIcon color="primary" />
                <Typography variant="h4" component="h1">
                  Welcome User <code>{displayName}</code>
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                This protected dashboard is a starting point for authenticated
                product workflows. It keeps the template focused on reusable
                layout, data, upload, and form patterns without changing auth
                mechanics.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: theme.palette.common.white,
                border: `1px solid ${theme.palette.divider}`,
                p: 2.5,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle1">Template readiness</Typography>
                <LinearProgress variant="determinate" value={78} />
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Chip color="success" label="Routes" size="small" />
                  <Chip color="primary" label="MUI" size="small" />
                  <Chip color="info" label="Storybook" size="small" />
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {summaryCards.map(({ detail, label, value }) => (
          <Grid key={label} size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                p: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h3" component="p" sx={{ my: 1 }}>
                {value}
              </Typography>
              <Typography variant="body2">{detail}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              p: 3,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h5">Example records</Typography>
                <Typography variant="body2" color="text.secondary">
                  DataGrid-backed list primitive with seeded template data.
                </Typography>
              </Box>
              <Button startIcon={<AddOutlinedIcon />} variant="outlined">
                New record
              </Button>
            </Stack>
            <Box sx={{ height: 330 }}>
              <List items={records} schema={recordSchema} deleteItem={noop} />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                p: 3,
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center' }}
                >
                  <CloudUploadIcon color="primary" />
                  <Box>
                    <Typography variant="h6">Upload intake</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dropzone primitive configured for common JSON input.
                    </Typography>
                  </Box>
                </Stack>
                <MultiDropzone
                  accept={{
                    'application/json': ['.json'],
                  }}
                  isCondensed
                  multiple
                  onFileSelect={noop}
                  onRemoveFile={noop}
                  uploadedFiles={uploadedFiles}
                  uploading={false}
                />
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Next implementation steps
              </Typography>
              <Stack divider={<Divider flexItem />} spacing={1.5}>
                {checklistItems.map((item) => (
                  <Typography key={item} variant="body2">
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          p: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Template activity
        </Typography>
        <Grid container spacing={2}>
          {activityItems.map(({ label, status }) => (
            <Grid key={label} size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="subtitle2">{label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {status}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  )
}

/**
 * Component that renders the contents of the Dashboard view.
 * @returns {JSX.Element} Component that renders the dashboard contents.
 */
const DashboardContainer: React.FC = (): JSX.Element => {
  const { username = '' } = useLoaderData() as { username: string }

  return <DashboardContent username={username} />
}
export default DashboardContainer
