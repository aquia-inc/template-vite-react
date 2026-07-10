import type { ReactNode } from 'react'
import Avatar from '@mui/material/Avatar'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import type { SxProps, Theme } from '@mui/material/styles'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import type {
  DashboardSectionId,
  WorkspaceNavigationProps,
} from '@/layouts/AppLayout/types'

const navigationItems: Array<{
  id: DashboardSectionId
  label: string
  icon: ReactNode
}> = [
  { id: 'overview', label: 'Home', icon: <DashboardOutlinedIcon /> },
  { id: 'records', label: 'Records', icon: <StorageOutlinedIcon /> },
  { id: 'upload', label: 'Upload', icon: <FileUploadOutlinedIcon /> },
  { id: 'activity', label: 'Activity', icon: <BarChartOutlinedIcon /> },
]

const WorkspaceMark = (): JSX.Element => (
  <Box
    aria-hidden="true"
    sx={{
      width: 40,
      height: 40,
      display: 'grid',
      placeItems: 'center',
      color: (theme) => theme.workspace.navigation,
      bgcolor: 'common.white',
      borderRadius: 3,
    }}
  >
    <GridViewRoundedIcon />
  </Box>
)

const railButtonSx = (active: boolean): SxProps<Theme> => ({
  position: 'relative',
  width: 44,
  height: 44,
  color: 'common.white',
  bgcolor: active ? (theme) => theme.workspace.navigationActive : 'transparent',
  borderRadius: 3,
  '&:hover': {
    bgcolor: active
      ? (theme) => theme.workspace.navigationActive
      : 'rgba(255, 255, 255, 0.12)',
  },
  '&:focus-visible': {
    outline: '2px solid white',
    outlineOffset: 2,
  },
  '&::before': active
    ? {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: -14,
        width: 2,
        height: 24,
        bgcolor: 'common.white',
        borderRadius: '0 2px 2px 0',
        transform: 'translateY(-50%)',
      }
    : undefined,
})

const WorkspaceNavigation = ({
  activeSection,
  isMobile,
  onNavigate,
  onUnavailable,
}: WorkspaceNavigationProps): JSX.Element => {
  if (isMobile) {
    return (
      <BottomNavigation
        component="nav"
        aria-label="Mobile dashboard"
        value={activeSection === 'activity' ? 'overview' : activeSection}
        onChange={(_, value: DashboardSectionId | 'profile') => {
          if (value === 'profile') onUnavailable('Profile')
          else onNavigate(value)
        }}
        sx={{
          position: 'fixed',
          inset: 'auto 10px max(10px, env(safe-area-inset-bottom)) 10px',
          zIndex: (theme) => theme.zIndex.appBar,
          height: (theme) => theme.workspace.mobileNavHeight,
          bgcolor: 'common.white',
          border: (theme) => `1px solid ${theme.workspace.border}`,
          borderRadius: 4,
          boxShadow: (theme) => theme.workspace.cardShadow,
          overflow: 'hidden',
        }}
      >
        {navigationItems.slice(0, 3).map((item) => (
          <BottomNavigationAction
            key={item.id}
            value={item.id}
            label={item.label}
            icon={item.icon}
          />
        ))}
        <BottomNavigationAction
          value="profile"
          label="Profile"
          icon={<PersonOutlineIcon />}
        />
      </BottomNavigation>
    )
  }

  return (
    <Box
      component="aside"
      aria-label="Workspace navigation"
      sx={{
        position: 'fixed',
        inset: 0,
        right: 'auto',
        width: (theme) => theme.workspace.railWidth,
        bgcolor: (theme) => theme.workspace.navigation,
        color: 'common.white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <WorkspaceMark />
      <Stack
        component="nav"
        aria-label="Dashboard sections"
        spacing={1.5}
        sx={{ mt: 4 }}
      >
        {navigationItems.map((item) => (
          <Tooltip title={item.label} placement="right" key={item.id}>
            <IconButton
              aria-label={item.label}
              aria-current={activeSection === item.id ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
              sx={railButtonSx(activeSection === item.id)}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
      <Stack spacing={1.5} sx={{ mt: 'auto', alignItems: 'center' }}>
        <IconButton
          aria-label="Settings"
          onClick={() => onUnavailable('Settings')}
          sx={{
            width: 44,
            height: 44,
            color: 'common.white',
            '&:focus-visible': {
              outline: '2px solid white',
              outlineOffset: 2,
            },
          }}
        >
          <SettingsOutlinedIcon />
        </IconButton>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: (theme) => theme.workspace.navigationActive,
          }}
        >
          UR
        </Avatar>
      </Stack>
    </Box>
  )
}

export default WorkspaceNavigation
