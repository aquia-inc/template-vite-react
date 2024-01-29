/**
 * @module pages/Home/Home
 */
import { Container, Typography, Link, Box } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import Header from '@/components/Header'

/**
 * The component to render the home page.
 * @returns {JSX.Element} the body content for the Home page
 */
const Home = () => (
  <>
    <Header />
    <Box mt={4}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to template-vite-react
        </Typography>
        <Box
          display="inline-flex"
          alignItems="start"
          justifyContent="start"
          mb={2}
        >
          <Link
            href="https://github.com/aquia-inc/template-vite-react"
            color="inherit"
            aria-label="GitHub repository"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
          >
            <GitHubIcon fontSize="large" />
            <Typography variant="body1" ml={1}>
              View on GitHub
            </Typography>
          </Link>
        </Box>
        <Typography variant="body1" mt={2}>
          This is the home page of your React application using Material-UI.
        </Typography>
      </Container>
    </Box>
  </>
)

export default Home
