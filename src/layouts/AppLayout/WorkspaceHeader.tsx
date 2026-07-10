import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import HeaderAuthButton from '@/components/HeaderAuthButton'
import { DASHBOARD_TITLE } from '@/locales/en'

export interface WorkspaceHeaderProps {
  isMobile: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onUnavailable: (feature: 'Notifications') => void
}

const WorkspaceHeader = ({
  isMobile,
  searchQuery,
  onSearchChange,
  onUnavailable,
}: WorkspaceHeaderProps): JSX.Element => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        minHeight: (theme) =>
          isMobile ? theme.workspace.mobileHeaderHeight : 80,
        ml: (theme) => (isMobile ? 0 : `${theme.workspace.railWidth}px`),
        px: (theme) =>
          `${isMobile ? theme.workspace.gutter.xs : theme.workspace.gutter.sm}px`,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        bgcolor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: (theme) => `1px solid ${theme.workspace.border}`,
      }}
    >
      <Box sx={{ minWidth: 0, mr: 'auto' }}>
        {!isMobile && (
          <Typography
            component="p"
            sx={{
              color: (theme) => theme.workspace.textMuted,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              lineHeight: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Workspace
          </Typography>
        )}
        <Typography
          component="h1"
          data-testid="appbar-title"
          sx={{
            color: (theme) => theme.workspace.text,
            fontSize: isMobile ? 20 : 24,
            fontWeight: 750,
            lineHeight: 1.2,
          }}
        >
          {DASHBOARD_TITLE}
        </Typography>
      </Box>

      {!isMobile && (
        <>
          <Box
            sx={{
              width: 'min(38vw, 420px)',
              minWidth: 240,
              height: 44,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: (theme) => theme.workspace.canvasCool,
              border: (theme) => `1px solid ${theme.workspace.border}`,
              borderRadius: 3,
              '&:focus-within': {
                borderColor: (theme) => theme.workspace.primary,
                boxShadow: (theme) => `0 0 0 2px ${theme.workspace.primary}24`,
              },
            }}
          >
            <SearchOutlinedIcon
              aria-hidden="true"
              sx={{ color: (theme) => theme.workspace.textMuted }}
            />
            <InputBase
              inputRef={searchInputRef}
              type="search"
              placeholder="Search records"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              slotProps={{
                input: {
                  role: 'searchbox',
                  'aria-label': 'Search dashboard',
                },
              }}
              sx={{
                flex: 1,
                minWidth: 0,
                color: (theme) => theme.workspace.text,
              }}
            />
            <Box
              component="span"
              sx={{
                flexShrink: 0,
                px: 1.5,
                py: 0.5,
                color: (theme) => theme.workspace.textMuted,
                bgcolor: 'common.white',
                border: (theme) => `1px solid ${theme.workspace.border}`,
                borderRadius: 1.5,
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              ⌘ K
            </Box>
          </Box>
          <IconButton
            aria-label="Notifications"
            onClick={() => onUnavailable('Notifications')}
            sx={{
              width: 44,
              height: 44,
              color: (theme) => theme.workspace.text,
              border: (theme) => `1px solid ${theme.workspace.border}`,
              borderRadius: 3,
              '&:focus-visible': {
                outline: (theme) => `2px solid ${theme.workspace.primary}`,
                outlineOffset: 2,
              },
            }}
          >
            <NotificationsNoneOutlinedIcon />
          </IconButton>
        </>
      )}

      <Stack direction="row" sx={{ flexShrink: 0 }}>
        <HeaderAuthButton />
      </Stack>
    </Box>
  )
}

export default WorkspaceHeader
