/**
 * @module components/AppDrawer
 */
import { CSSObject, Theme, styled } from '@mui/material/styles'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { MuiDrawerCollapsedWidth, MuiDrawerWidth } from '@/theme/theme'

const openedMixin = (theme: Theme): CSSObject => ({
  width: MuiDrawerWidth,
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedMixin = (theme: Theme): CSSObject => ({
  width: MuiDrawerCollapsedWidth,
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
})

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? MuiDrawerWidth : MuiDrawerCollapsedWidth,
  flexShrink: 0,
  height: '100vh',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  '& .MuiDrawer-paper': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[900],
    height: '100vh',
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    ...(!open ? closedMixin(theme) : openedMixin(theme)),
  },
}))

const AppDrawer = ({
  role = 'navigation',
  variant = 'permanent',
  ...props
}: DrawerProps): JSX.Element => (
  <StyledDrawer role={role} variant={variant} {...props} />
)

export default AppDrawer
