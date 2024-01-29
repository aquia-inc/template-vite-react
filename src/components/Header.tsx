/**
 * @module components/Header
 */
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AppBar from '@/components/AppBar'
import AuthButton from '@/components/HeaderAuthButton'
import { PUBLIC_APP_NAME } from '@/locales/en'

const Header: React.FC = (): JSX.Element => {
  const theme = useTheme()

  return (
    <AppBar position="static" role="banner">
      <Toolbar role="toolbar">
        <Typography
          component="div"
          sx={{ flexGrow: 1 }}
          variant="h6"
          color={theme.palette.common.white}
        >
          {PUBLIC_APP_NAME}
        </Typography>
        <AuthButton />
      </Toolbar>
    </AppBar>
  )
}
export default Header
