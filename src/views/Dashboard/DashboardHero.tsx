import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { readinessItems } from './dashboardData'
import { dashboardLabelColors } from './dashboardLabelColors'
import type { ReadinessItem } from './dashboard.types'

export interface DashboardHeroProps {
  username: string
}

interface ReadinessCardProps {
  items: ReadinessItem[]
  value: number
}

const StatusDot = () => (
  <Box
    aria-hidden="true"
    component="span"
    sx={{
      bgcolor: (theme) => theme.workspace.success,
      borderRadius: '50%',
      boxShadow: (theme) => `0 0 0 4px ${alpha(theme.workspace.success, 0.14)}`,
      height: 8,
      width: 8,
    }}
  />
)

const ReadinessCard = ({ items, value }: ReadinessCardProps) => (
  <Paper
    elevation={0}
    sx={{
      alignItems: 'center',
      alignSelf: 'stretch',
      bgcolor: (theme) => alpha(theme.palette.common.white, 0.9),
      border: (theme) => `1px solid ${theme.workspace.border}`,
      borderRadius: (theme) => `${theme.workspace.cardRadius}px`,
      boxShadow: (theme) => theme.workspace.cardShadow,
      display: 'flex',
      justifyContent: 'center',
      minHeight: { xs: 210, sm: 248 },
      p: { xs: 2.5, sm: 3 },
      position: 'relative',
    }}
  >
    <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
        }}
      >
        <CircularProgress
          aria-hidden="true"
          size={132}
          sx={{ color: (theme) => alpha(theme.workspace.primary, 0.12) }}
          thickness={3.5}
          value={100}
          variant="determinate"
        />
        <CircularProgress
          aria-label="Template readiness"
          size={132}
          sx={{
            color: (theme) => theme.workspace.primary,
            left: 0,
            position: 'absolute',
            top: 0,
          }}
          thickness={3.5}
          value={value}
          variant="determinate"
        />
        <Stack
          spacing={0}
          sx={{
            alignItems: 'center',
            inset: 0,
            justifyContent: 'center',
            position: 'absolute',
          }}
        >
          <Typography
            component="span"
            sx={{
              color: (theme) => theme.workspace.text,
              fontSize: '1.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 750,
              lineHeight: 1.1,
            }}
          >
            {value}%
          </Typography>
          <Typography
            component="span"
            sx={{
              color: (theme) => theme.workspace.textMuted,
              fontSize: '0.6875rem',
              fontWeight: 750,
              letterSpacing: '0.12em',
            }}
          >
            READY
          </Typography>
        </Stack>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{ flexWrap: 'wrap', justifyContent: 'center', rowGap: 1 }}
      >
        {items.map((item) => {
          const colors = dashboardLabelColors[item.tone]

          return (
            <Chip
              key={item.label}
              label={item.label}
              size="small"
              sx={{
                bgcolor: colors.background,
                color: colors.foreground,
                fontWeight: 700,
              }}
            />
          )
        })}
      </Stack>
    </Stack>
  </Paper>
)

export const DashboardHero = ({ username }: DashboardHeroProps) => {
  const displayName = username || 'developer'

  return (
    <Paper
      aria-labelledby="dashboard-welcome"
      component="section"
      elevation={0}
      id="overview"
      sx={{
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.workspace.primary, 0.1)} 0%, ${alpha(theme.workspace.violet, 0.06)} 48%, ${alpha(theme.palette.common.white, 0.96)} 100%)`,
        border: (theme) => `1px solid ${alpha(theme.workspace.primary, 0.16)}`,
        borderRadius: (theme) => `${theme.workspace.heroRadius}px`,
        overflow: 'hidden',
        p: { xs: 2.5, sm: 3.5, lg: 5 },
        position: 'relative',
        scrollMarginTop: { xs: 88, sm: 104 },
        '&::before, &::after': {
          border: (theme) =>
            `1px solid ${alpha(theme.workspace.primary, 0.12)}`,
          borderRadius: '50%',
          content: '""',
          pointerEvents: 'none',
          position: 'absolute',
        },
        '&::before': {
          height: 280,
          right: -84,
          top: -132,
          width: 280,
        },
        '&::after': {
          bottom: -180,
          height: 360,
          left: '34%',
          width: 360,
        },
      }}
    >
      <Grid
        sx={{
          alignItems: 'center',
          display: 'grid',
          gap: { xs: 3, sm: 4, lg: 6 },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'minmax(0, 1fr) 320px',
          },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          <Chip
            icon={<AutoAwesomeOutlinedIcon />}
            label="Protected workspace"
            size="small"
            sx={{
              alignSelf: 'flex-start',
              bgcolor: dashboardLabelColors.primary.background,
              color: dashboardLabelColors.primary.foreground,
              fontWeight: 700,
              '& .MuiChip-icon': {
                color: 'inherit',
              },
            }}
          />
          <Typography
            component="h1"
            id="dashboard-welcome"
            variant="h3"
            sx={{
              color: (theme) => theme.workspace.text,
              fontSize: { xs: '2rem', sm: '2.5rem', lg: '3rem' },
              fontWeight: 750,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
            }}
          >
            Welcome User{' '}
            <Box
              component="span"
              sx={{ color: (theme) => theme.workspace.primary }}
            >
              <Box aria-hidden="true" component="span">
                ●{' '}
              </Box>
              {displayName}
            </Box>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.7, maxWidth: 690 }}
          >
            This authenticated dashboard is a polished starting point for
            product workflows, reusable layouts, structured data, uploads, and
            forms—without disturbing the underlying auth mechanics.
          </Typography>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              alignItems: 'center',
              color: (theme) => theme.workspace.textMuted,
              display: { xs: 'none', sm: 'flex' },
              flexWrap: 'wrap',
              pt: 0.5,
              rowGap: 1,
            }}
          >
            <StatusDot />
            <Typography color="inherit" variant="body2">
              All systems ready
            </Typography>
            <Box
              aria-hidden="true"
              component="span"
              sx={{
                bgcolor: (theme) => theme.workspace.border,
                height: 16,
                mx: 0.5,
                width: '1px',
              }}
            />
            <AccessTimeOutlinedIcon aria-hidden="true" fontSize="small" />
            <Typography color="inherit" variant="body2">
              Updated moments ago
            </Typography>
          </Stack>
        </Stack>

        <ReadinessCard items={readinessItems} value={78} />
      </Grid>
    </Paper>
  )
}
