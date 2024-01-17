/**
 * @module components/DateLocaleString
 */
import Typography from '@mui/material/Typography'

type DateLocaleStringProps = {
  date: Date
}

/**
 * A component that renders a date cell formatted as a locale date string.
 * @param {Object} props - The input props for the component.
 * @param {Date} props.date - The date to format.
 * @returns {string} The formatted date inside a MUI Typography component.
 */
const DateLocaleString: React.FC<DateLocaleStringProps> = ({
  date,
}): JSX.Element => (
  <Typography variant="caption">{date.toLocaleDateString('en-US')}</Typography>
)

export default DateLocaleString
