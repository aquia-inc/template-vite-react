import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { dashboardMetrics } from './dashboardData'
import type { DashboardMetric, DashboardTone } from './dashboard.types'

export interface DashboardMetricGridProps {
  metrics?: DashboardMetric[]
}

interface DashboardMetricCardProps {
  metric: DashboardMetric
}

const metricIcons = {
  route: AccountTreeOutlinedIcon,
  primitives: WidgetsOutlinedIcon,
  quality: FactCheckOutlinedIcon,
} as const

const toneColor =
  (tone: DashboardTone) =>
  (theme: {
    palette: { info: { main: string } }
    workspace: {
      primary: string
      violet: string
      success: string
      warning: string
    }
  }) => (tone === 'info' ? theme.palette.info.main : theme.workspace[tone])

const DashboardMetricCard = ({ metric }: DashboardMetricCardProps) => {
  const MetricIcon = metricIcons[metric.icon]

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        border: `1px solid ${theme.workspace.border}`,
        borderRadius: {
          xs: `${Math.max(theme.workspace.cardRadius - 6, 12)}px`,
          sm: `${theme.workspace.cardRadius}px`,
        },
        boxShadow: theme.workspace.cardShadow,
        minHeight: { xs: 124, sm: 190 },
        minWidth: 0,
        p: { xs: 1.5, sm: 3 },
      })}
    >
      <Stack spacing={{ xs: 1, sm: 2 }} sx={{ height: '100%' }}>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: (theme) => alpha(toneColor(metric.tone)(theme), 0.1),
            borderRadius: { xs: 2, sm: 2.5 },
            color: toneColor(metric.tone),
            display: 'flex',
            height: { xs: 32, sm: 44 },
            justifyContent: 'center',
            width: { xs: 32, sm: 44 },
          }}
        >
          <MetricIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
        </Box>
        <Box>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.6875rem', sm: '0.875rem' },
              fontWeight: 650,
              lineHeight: 1.3,
            }}
          >
            {metric.label}
          </Typography>
          <Typography
            component="p"
            sx={{
              color: (theme) => theme.workspace.text,
              fontSize: { xs: '1.75rem', sm: '2.5rem' },
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 750,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              mt: { xs: 0.5, sm: 1 },
            }}
          >
            {metric.value}
          </Typography>
        </Box>
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.55 }}
        >
          {metric.detail}
        </Typography>
      </Stack>
    </Paper>
  )
}

export const DashboardMetricGrid = ({
  metrics = dashboardMetrics,
}: DashboardMetricGridProps) => (
  <Box
    aria-label="Dashboard metrics"
    component="section"
    sx={{
      display: 'grid',
      gap: { xs: 1, sm: 2 },
      gridTemplateColumns: {
        xs: 'repeat(3, minmax(0, 1fr))',
        sm: 'repeat(2, minmax(0, 1fr))',
        lg: 'repeat(3, minmax(0, 1fr))',
      },
      '& > :last-child': {
        gridColumn: { sm: '1 / -1', lg: 'auto' },
      },
    }}
  >
    {metrics.map((metric) => (
      <DashboardMetricCard key={metric.label} metric={metric} />
    ))}
  </Box>
)
