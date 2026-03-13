/**
 * @module components/AppDrawerButton
 */
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

type AppDrawerButtonProps = {
  icon?: React.ReactNode
  label: string
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
  to,
}): JSX.Element => (
  <Link to={to} component={RouterLink}>
    <ListItemButton sx={{ margin: 'auto', border: '0' }}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <Box component="span" sx={{ display: 'inline-block', width: 12 }} />
      <ListItemText primary={label} />
    </ListItemButton>
  </Link>
)

export default AppDrawerButton
