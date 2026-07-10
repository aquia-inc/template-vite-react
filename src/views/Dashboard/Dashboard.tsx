/**
 * The default view that an authenticated user first sees when they visit the
 * app. It composes the reusable dashboard sections into adaptive layouts.
 * @module views/Dashboard/Dashboard
 */
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useLoaderData, useOutletContext } from 'react-router-dom'
import type { AppLayoutOutletContext } from '@/layouts/AppLayout/types'
import { DashboardHero } from './DashboardHero'
import { DashboardMetricGrid } from './DashboardMetricGrid'
import { DashboardRecords } from './DashboardRecords'
import {
  DashboardActivityPanel,
  DashboardUploadPanel,
} from './DashboardUtilityPanels'

export interface DashboardContentProps {
  username?: string
  searchQuery?: string
}

const DashboardActivityRegion = (): JSX.Element => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      aria-hidden={isMobile || undefined}
      aria-label="Template activity"
      role="region"
      sx={{
        display: isMobile ? 'none' : 'block',
        gridArea: { lg: 'activity' },
        minWidth: 0,
      }}
    >
      <DashboardActivityPanel />
    </Box>
  )
}

export const DashboardContent = ({
  username = '',
  searchQuery = '',
}: DashboardContentProps): JSX.Element => (
  <Box
    sx={{
      display: 'grid',
      gap: { xs: 1.5, sm: 2, lg: 2.5 },
      gridTemplateAreas: {
        xs: `"hero" "metrics" "records" "upload"`,
        sm: `"hero" "metrics" "records" "utilities"`,
        lg: `"hero hero" "metrics metrics" "records upload" "records activity"`,
      },
      gridTemplateColumns: {
        xs: 'minmax(0, 1fr)',
        lg: 'minmax(0, 3fr) minmax(300px, 1fr)',
      },
      minWidth: 0,
    }}
  >
    <Box sx={{ gridArea: 'hero', minWidth: 0 }}>
      <DashboardHero username={username} />
    </Box>
    <Box sx={{ gridArea: 'metrics', minWidth: 0 }}>
      <DashboardMetricGrid />
    </Box>
    <Box
      aria-label="Example records"
      role="region"
      sx={{ gridArea: 'records', minWidth: 0 }}
    >
      <DashboardRecords searchQuery={searchQuery} />
    </Box>
    <Box
      sx={{
        display: { xs: 'block', sm: 'grid', lg: 'contents' },
        gap: 2,
        gridArea: { xs: 'upload', sm: 'utilities', lg: 'auto' },
        gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))' },
        minWidth: 0,
      }}
    >
      <Box
        aria-label="Upload intake"
        role="region"
        sx={{ gridArea: { lg: 'upload' }, minWidth: 0 }}
      >
        <DashboardUploadPanel />
      </Box>
      <DashboardActivityRegion />
    </Box>
  </Box>
)

const DashboardContainer = (): JSX.Element => {
  const { username = '' } = useLoaderData() as { username: string }
  const { searchQuery = '' } = useOutletContext<AppLayoutOutletContext>()

  return <DashboardContent username={username} searchQuery={searchQuery} />
}

export default DashboardContainer
