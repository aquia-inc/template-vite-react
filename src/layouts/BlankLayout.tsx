/**
 * @module layouts/BlankLayout
 */
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { Outlet } from 'react-router-dom'

const BlankLayoutWrapper = styled(Box)<BoxProps>({
  height: '100%',
})

/**
 * Layout component renders a basic wrapper container for other components.
 * @param {BlankLayoutProps} props The props for the BlankLayout component.
 * @param {React.ReactNode} props.children The child elements to render.
 * @returns {JSX.Element} The BlankLayout component.
 */
const BlankLayout: React.FC = (): JSX.Element => (
  <BlankLayoutWrapper component="div" className="layout-wrapper">
    <Box
      className="app-content"
      sx={{
        minHeight: '100%',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <Outlet />
    </Box>
  </BlankLayoutWrapper>
)

export default BlankLayout
