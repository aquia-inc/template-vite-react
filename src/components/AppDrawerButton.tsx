/**
 * @module components/AppDrawerButton
 */
import { Link as RouterLink } from 'react-router-dom'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

type AppDrawerButtonProps = {
  icon?: React.ReactNode
  label: string
  open: boolean
  to: string
}

/**
 * A single menu button in the list inside of the AppDrawer.
 * @param {AppDrawerButtonProps} props The input props for the component.
 * @param {[React.ReactNode]} props.icon The optional SVG icon to display next to the label.
 * @param {string} props.label The text label for menu button.
 * @param {string} props.to The URL path that the menu button should link to.
 * @returns {JSX.Element} The menu button list item.
 */
const AppDrawerButton: React.FC<AppDrawerButtonProps> = ({
  icon,
  label,
  open,
  to,
}): JSX.Element => (
  <ListItemButton
    aria-label={label}
    component={RouterLink}
    sx={{
      minHeight: 48,
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
    }}
    title={!open ? label : undefined}
    to={to}
  >
    {icon && (
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : 0,
          justifyContent: 'center',
        }}
      >
        {icon}
      </ListItemIcon>
    )}
    {open && <ListItemText primary={label} />}
  </ListItemButton>
)

export default AppDrawerButton
