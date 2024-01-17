/**
 * @module layouts/BlankLayout
 */
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

const BlankLayoutWrapper = styled(Box)<BoxProps>({
  height: '100%',
})

/**
 * Layout component renders a basic wrapper container for other components.
 * @param {BlankLayoutProps} props The props for the BlankLayout component.
 * @param {React.ReactNode} props.children The child elements to render.
 * @returns {JSX.Element} The BlankLayout component.
 */
const BlankLayout: React.FC<React.PropsWithChildren> = ({
  children,
}): JSX.Element => (
  <BlankLayoutWrapper className="layout-wrapper">
    <Box
      className="app-content"
      sx={{
        minHeight: '100%',
        overflowX: 'hidden',
        position: 'relative',
        marginRight: '10%',
      }}
    >
      {children}
    </Box>
  </BlankLayoutWrapper>
)

export default BlankLayout
