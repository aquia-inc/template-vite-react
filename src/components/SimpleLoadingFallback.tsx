/**
 * @module components/SimpleLoadingFallback
 */
import Container from '@mui/material/Container'

const Fallback: React.FC = (): JSX.Element => (
  <Container data-testid="simple-loading-fallback">Loading...</Container>
)

export default Fallback
