/**
 * A component that renders a backdrop with a circular progress
 *  indicator when `loading = true` and null when `loading = false`.
 * @module components/mui/BackdropLoadingCircular
 */
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

type BackdropLoadingCircularProps = {
  loading: boolean
}

/**
 * A component that renders a backdrop with a circular progress
 *  indicator when `loading = true` and null when `loading = false`.
 * @param {BackdropLoadingCircularProps} props - Input props for the component.
 * @param {boolean} props.loading - Whether to show the loading indicator
 * @returns {JSX.Element} A circular loading indicator component
 */
const BackdropLoadingCircular: React.FC<BackdropLoadingCircularProps> = ({
  loading,
}): React.ReactNode => {
  const { breakpoints } = useTheme()
  const hidden = useMediaQuery(breakpoints.down('md'))

  if (!loading) return null

  return (
    <Backdrop
      open={loading}
      role="presentation"
      style={{
        marginTop: 0,
      }}
      sx={(theme) => ({
        borderRadius: hidden ? theme.spacing(2) : 0,
      })}
    >
      <CircularProgress data-testid="circular-progress" />
    </Backdrop>
  )
}

export default BackdropLoadingCircular
