/**
 * The layout for rendering the authenticated user's layout.
 * @module layouts/AppLayout/AppLayout
 */
import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import AlertMessage from '@/components/AlertMessage'
import AppBar from '@/components/AppBar'
import AppDrawer from '@/components/AppDrawer'
import AuthButton from '@/components/HeaderAuthButton'
import MenuListItems from '@/layouts/AppLayout/AppDrawerButtonList'
import { DASHBOARD_TITLE } from '@/locales/en'

/**
 * The main layout that renders the application layout for authenticated users.
 * If the user is not authenticated, they will be redirected to the login page.
 * @returns {JSX.Element} The main application layout component.
 */
const AppLayout: React.FC = (): JSX.Element => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((previousState) => !previousState)
  }, [])

  return (
    <>
      <CssBaseline />
      <Box
        data-testid="app"
        sx={{
          display: 'flex',
          flexGrow: 1,
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <AlertMessage />

        {/* top nav bar */}
        <AppBar position="fixed" open={drawerOpen} color="secondary">
          <Toolbar>
            {!drawerOpen && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer}
                sx={{ marginRight: '36px' }}
                aria-label="open drawer"
                data-testid="open-drawer-button"
                name="open drawer"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              color="inherit"
              component="span"
              noWrap
              sx={{ flexGrow: 1 }}
              variant="h6"
              data-testid="appbar-title"
            >
              {DASHBOARD_TITLE}
            </Typography>
            <AuthButton />
          </Toolbar>
        </AppBar>

        {/* menu drawer */}
        <AppDrawer
          open={drawerOpen}
          data-open={drawerOpen}
          data-testid="app-drawer"
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              filter: `brightness(80%)`,
            }}
          >
            {drawerOpen && (
              <IconButton
                onClick={toggleDrawer}
                aria-label="close drawer"
                data-testid="close-drawer-button"
                name="close drawer"
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Toolbar>
          <Divider />

          <List component="nav">
            <MenuListItems open={drawerOpen} />
          </List>
        </AppDrawer>
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0,
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <Toolbar />
          <Container
            sx={{
              flexGrow: 1,
              py: (theme) => theme.spacing(4),
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </>
  )
}

export default AppLayout
