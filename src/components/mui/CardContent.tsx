/**
 * A component that renders the MUI CardContent centered within its parent.
 * @module components/mui/CardContent
 */
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'

const CenteredCardContent = styled(CardContent)({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  textAlign: 'center',
})

export default CenteredCardContent
