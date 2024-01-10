/**
 * Custom implementation of MuiChip.
 * @module components/mui/Chip
 */
import MuiChip, { ChipProps } from '@mui/material/Chip'
import useBgColor, { UseBgColorType } from '@/hooks/useBgColor'

type InputProps = ChipProps & { skin?: 'light' }

/**
 * A chip component that renders a colored chip.
 * @param {InputProps} props - These are the Chip component properties.
 * @param {Color} [props.skin] The chip color.
 * @returns {JSX.Element} A styled chip component.
 */
const Chip: React.FC<InputProps> = (props): JSX.Element => {
  const { sx, skin, color } = props

  const bgColors = useBgColor()

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
  }

  return (
    <MuiChip
      role="status"
      {...props}
      variant="filled"
      {...(skin === 'light' && { className: 'MuiChip-light' })}
      sx={skin === 'light' && color ? Object.assign(colors[color], sx) : sx}
    />
  )
}

export default Chip
