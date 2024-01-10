/**
 * @module components/Header
 */
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AppBar from '@/components/AppBar'
import AuthButton from '@/components/HeaderAuthButton'
import { PUBLIC_APP_NAME } from '@/locales/en'

const Header: React.FC = (): JSX.Element => (
  <AppBar position="static" role="banner">
    <Toolbar role="toolbar">
      <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
        {PUBLIC_APP_NAME}
      </Typography>
      <AuthButton />
    </Toolbar>
  </AppBar>
)

export default Header
