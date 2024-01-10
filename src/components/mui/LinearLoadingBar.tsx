/**
 * Custom implementation of LinearProgress bar from MUI.
 * @module components/mui/LinerLoadingBar
 */
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const LinearIndeterminate: React.FC = (): JSX.Element => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>
)

export default LinearIndeterminate
