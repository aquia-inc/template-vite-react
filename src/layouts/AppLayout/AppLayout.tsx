import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AlertMessage from '@/components/AlertMessage'
import { useAlert } from '@/hooks/useAlert'
import WorkspaceHeader from '@/layouts/AppLayout/WorkspaceHeader'
import WorkspaceNavigation from '@/layouts/AppLayout/WorkspaceNavigation'
import type {
  AppLayoutOutletContext,
  DashboardSectionId,
} from '@/layouts/AppLayout/types'

const unavailableMessages = {
  Notifications: 'Notifications are not configured in this template.',
  Profile: 'Profile is not configured in this template.',
  Settings: 'Settings are not configured in this template.',
} as const

const AppLayout: React.FC = (): JSX.Element => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { setAlert } = useAlert()
  const [activeSection, setActiveSection] =
    useState<DashboardSectionId>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const navigateToSection = useCallback((section: DashboardSectionId) => {
    setActiveSection(section)
    document.getElementById(section)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }, [])

  const showUnavailable = useCallback(
    (feature: 'Notifications' | 'Profile' | 'Settings') => {
      setAlert({
        severity: 'info',
        message: unavailableMessages[feature],
      })
    },
    [setAlert],
  )

  const outletContext: AppLayoutOutletContext = { searchQuery }

  return (
    <>
      <CssBaseline />
      <Box
        data-testid="app"
        sx={{
          minWidth: 0,
          minHeight: '100dvh',
          overflowX: 'clip',
          bgcolor: (theme) => theme.workspace.canvas,
        }}
      >
        <AlertMessage />
        <WorkspaceNavigation
          activeSection={activeSection}
          isMobile={isMobile}
          onNavigate={navigateToSection}
          onUnavailable={showUnavailable}
        />
        <WorkspaceHeader
          isMobile={isMobile}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUnavailable={showUnavailable}
        />
        <Box
          component="main"
          sx={{
            minWidth: 0,
            ml: (theme) => (isMobile ? 0 : `${theme.workspace.railWidth}px`),
            px: (theme) =>
              `${
                isMobile ? theme.workspace.gutter.xs : theme.workspace.gutter.sm
              }px`,
            pt: 6,
            pb: (theme) =>
              isMobile ? `${theme.workspace.mobileNavHeight + 32}px` : 8,
          }}
        >
          <Outlet context={outletContext} />
        </Box>
      </Box>
    </>
  )
}

export default AppLayout
