import { useState } from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { v4 as uuidv4 } from 'uuid'
import MultiDropzone from '@/components/MultiDropzone/MultiDropzone'
import type { UploadedFile } from '@/components/MultiDropzone/types'
import { dashboardActivity } from './dashboardData'

const uploadedFiles: UploadedFile[] = [
  {
    id: 'requirements-json',
    name: 'requirements.json',
    progress: 100,
  },
  {
    id: 'sample-data-csv',
    name: 'sample-data.csv',
    progress: 100,
  },
]

const cardStyles = {
  border: (theme: { workspace: { border: string } }) =>
    `1px solid ${theme.workspace.border}`,
  borderRadius: (theme: { workspace: { cardRadius: number } }) =>
    `${theme.workspace.cardRadius}px`,
  boxShadow: (theme: { workspace: { cardShadow: string } }) =>
    theme.workspace.cardShadow,
  p: { xs: 2, sm: 3 },
} as const

export const DashboardUploadPanel = (): JSX.Element => {
  const [files, setFiles] = useState<UploadedFile[]>(uploadedFiles)

  const selectFiles = (selectedFiles: File[]) => {
    setFiles((currentFiles) => [
      ...currentFiles,
      ...selectedFiles.map((file) => ({
        id: uuidv4(),
        name: file.name,
        progress: 100,
      })),
    ])
  }

  const removeFile = (id: string) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id))
  }

  return (
    <Paper
      component="section"
      elevation={0}
      id="upload"
      sx={{ ...cardStyles, scrollMarginTop: 96 }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            aria-hidden="true"
            sx={(theme) => ({
              alignItems: 'center',
              bgcolor: theme.workspace.canvasCool,
              borderRadius: 2.5,
              color: theme.workspace.primary,
              display: 'flex',
              height: 42,
              justifyContent: 'center',
              width: 42,
            })}
          >
            <CloudUploadOutlinedIcon />
          </Box>
          <Box>
            <Typography component="h2" variant="h6">
              Upload intake
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Drag in structured assets or browse from your workspace.
            </Typography>
          </Box>
        </Stack>
        <MultiDropzone
          appearance="workspace"
          accept={{
            'application/json': ['.json'],
            'text/csv': ['.csv'],
          }}
          multiple
          onFileSelect={selectFiles}
          onRemoveFile={removeFile}
          uploadedFiles={files}
          uploading={false}
        />
      </Stack>
    </Paper>
  )
}

export const DashboardActivityPanel = (): JSX.Element => (
  <Paper
    component="section"
    elevation={0}
    id="activity"
    sx={{ ...cardStyles, display: { xs: 'none', sm: 'block' } }}
  >
    <Typography component="h2" variant="h6">
      Template activity
    </Typography>
    <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
      Signals from the current implementation baseline.
    </Typography>

    <Stack component="ol" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {dashboardActivity.map(({ label, status }, index) => (
        <Box
          component="li"
          key={label}
          sx={{ display: 'grid', gridTemplateColumns: '20px 1fr', pt: 2.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              aria-hidden="true"
              sx={(theme) => ({
                bgcolor: theme.workspace.primary,
                borderRadius: '50%',
                height: 8,
                mt: 0.75,
                width: 8,
                zIndex: 1,
              })}
            />
            {index < dashboardActivity.length - 1 && (
              <Box
                aria-hidden="true"
                sx={(theme) => ({
                  borderLeft: `1px solid ${theme.workspace.border}`,
                  bottom: -10,
                  left: '50%',
                  position: 'absolute',
                  top: 11,
                })}
              />
            )}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700 }} variant="body2">
              {label}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {status}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>

    <Divider sx={{ my: 2.5 }} />
    <Stack
      direction="row"
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Typography color="text.secondary" variant="body2">
        Baseline health
      </Typography>
      <Typography
        sx={(theme) => ({ color: theme.workspace.success, fontWeight: 750 })}
        variant="subtitle2"
      >
        Stable
      </Typography>
    </Stack>
  </Paper>
)
