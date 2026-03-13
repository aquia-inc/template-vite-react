import { Link as RouterLink } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Footer from '@/components/Footer'
import { TEMPLATE_GITHUB_URL } from '@/constants'
import { AUTH_DISABLED_HELP } from '@/locales/en'
import { Routes } from '@/router/constants'
import CONFIG from '@/utils/config'
import { SignInGraphic } from '@/views/SignIn/SignIn.components'

const monoFontFamily =
  'ui-monospace, "Cascadia Mono", "Segoe UI Mono", "Liberation Mono", Menlo, Monaco, Consolas, monospace'

const featureCards = [
  {
    badge: 'Fast',
    title: 'Fast local development',
    description:
      'Vite, React, TypeScript, and SWC are already wired together for a tight edit-refresh loop.',
  },
  {
    badge: 'Route',
    title: 'App-shaped routing',
    description:
      'Public, auth, and protected application routes are separated cleanly with loaders and route constants.',
  },
  {
    badge: 'Auth',
    title: 'Auth scaffold included',
    description:
      'AWS Amplify and Cognito setup live behind environment-driven config and ready-to-extend sign-in flows.',
  },
  {
    badge: 'UI',
    title: 'Reusable UI foundation',
    description:
      'Material UI theme tokens, layouts, shared components, and a Sass entrypoint give the template structure.',
  },
  {
    badge: 'Story',
    title: 'Component-first workflow',
    description:
      'Storybook is configured so teams can build and review interface states without booting the whole app.',
  },
  {
    badge: 'Test',
    title: 'Testing and guardrails',
    description:
      'Jest, Testing Library, ESLint, Prettier, Husky, and release tooling are part of the starting point.',
  },
]

const quickStartSteps = [
  {
    step: '1',
    title: 'Install dependencies',
    description: 'Pull packages with Yarn and prepare the local toolchain.',
    command: 'yarn',
  },
  {
    step: '2',
    title: 'Enable hooks',
    description: 'Install the repository hooks that enforce quality checks.',
    command: 'yarn prepare',
  },
  {
    step: '3',
    title: 'Create local env',
    description:
      'Seed your local environment file from the example included in the repo.',
    command: 'sh ./scripts/post-install.sh',
  },
  {
    step: '4',
    title: 'Start development',
    description:
      'Launch the Vite dev server and start iterating on routes, components, and flows.',
    command: 'yarn dev',
  },
]

const architectureNotes = [
  {
    label: 'Routing',
    value:
      'React Router loaders, route constants, public auth pages, protected app shell.',
  },
  {
    label: 'State and auth',
    value:
      'Context-backed auth state, sign-in actions, logout route, Cognito session helpers.',
  },
  {
    label: 'UI system',
    value:
      'Custom MUI theme, reusable layouts, utility components, and Storybook stories.',
  },
  {
    label: 'Developer workflow',
    value:
      'Build, test, lint, and preview scripts that make the template usable on day one.',
  },
]

const workflowCommands = ['yarn test', 'yarn lint', 'yarn build', 'yarn sb']

const codeSample = [
  '$ yarn',
  '$ yarn prepare',
  '$ sh ./scripts/post-install.sh',
  '$ yarn dev',
  '',
  '# Then shape the template to your product:',
  '- configure env vars in createAppConfig',
  '- replace demo routes and views',
  '- extend auth, data hooks, and Storybook stories',
]

const Home: React.FC = (): JSX.Element => {
  const theme = useTheme()
  const authEnabled = CONFIG.AUTH_ENABLED

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        backgroundImage: `
          radial-gradient(circle at top left, ${alpha(theme.palette.primary.light, 0.2)}, transparent 30%),
          linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 22%)
        `,
      }}
    >
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar,
          backdropFilter: 'blur(18px)',
          backgroundColor: alpha(theme.palette.common.white, 0.78),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ minHeight: 76 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 3,
                  display: 'inline-flex',
                  height: 44,
                  justifyContent: 'center',
                  width: 44,
                }}
              >
                <SignInGraphic />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="primary.main">
                  template-vite-react
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vite React starter for authenticated apps
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button
                component="a"
                href={TEMPLATE_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                color="secondary"
                variant="text"
              >
                GitHub
              </Button>
              {authEnabled ? (
                <Button
                  component={RouterLink}
                  to={Routes.AUTH_LOGIN}
                  variant="contained"
                >
                  Sign In
                </Button>
              ) : (
                <Button variant="contained" disabled>
                  Auth unavailable
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Chip
                label="Developer template"
                color="primary"
                sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
              />
              <Typography variant="h1" component="h1" sx={{ maxWidth: 720 }}>
                Start from a working React foundation instead of an empty repo.
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 680, lineHeight: 1.7 }}
              >
                This template ships with a production-shaped stack: Vite, React,
                TypeScript, MUI, auth scaffolding, Storybook, tests, and
                environment-based configuration that is ready to adapt to real
                application work.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {authEnabled ? (
                  <Button
                    component={RouterLink}
                    to={Routes.AUTH_LOGIN}
                    size="large"
                    variant="contained"
                  >
                    Open sign-in flow
                  </Button>
                ) : (
                  <Button size="large" variant="contained" disabled>
                    Sign-in unavailable
                  </Button>
                )}
                <Button
                  component="a"
                  href={TEMPLATE_GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  size="large"
                  variant="outlined"
                >
                  View GitHub repository
                </Button>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                Use it as a base for dashboards, internal tools, and
                authenticated product surfaces where the boring setup work
                should already be done.
              </Typography>
              {!authEnabled && (
                <Typography
                  variant="body2"
                  color="warning.main"
                  sx={{ maxWidth: 680 }}
                >
                  {AUTH_DISABLED_HELP}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 6,
                color: theme.palette.common.white,
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: `0 28px 70px ${alpha(theme.palette.primary.main, 0.18)}`,
              }}
            >
              <Box
                sx={{
                  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.16)}`,
                  display: 'flex',
                  gap: 1,
                  px: 3,
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#FF6B6B',
                  }}
                />
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#FFD166',
                  }}
                />
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#4CD964',
                  }}
                />
              </Box>
              <Stack spacing={3} sx={{ p: 3.5 }}>
                <Typography variant="h6">Quick start</Typography>
                <Box
                  component="pre"
                  sx={{
                    borderRadius: 4,
                    fontFamily: monoFontFamily,
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    m: 0,
                    overflowX: 'auto',
                    p: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {codeSample.join('\n')}
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {workflowCommands.map((command) => (
                    <Chip
                      key={command}
                      label={command}
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.common.white, 0.28),
                        color: theme.palette.common.white,
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Stack spacing={3} sx={{ mb: 5 }}>
          <Typography variant="h2" component="h2">
            What is already in the box
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 760 }}
          >
            The repository is set up like a real application template, not just
            a hello-world starter. It already includes the pieces teams usually
            stitch together after the first commit.
          </Typography>
        </Stack>
        <Box
          sx={{
            alignItems: 'start',
            display: 'grid',
            columnGap: 3,
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            rowGap: 4,
          }}
        >
          {featureCards.map((feature) => (
            <Paper
              key={feature.title}
              elevation={0}
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.78),
                border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
              }}
            >
              <Chip
                label={feature.badge}
                color="primary"
                size="small"
                sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
              />
              <Typography variant="h6">{feature.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 6,
                height: '100%',
                p: { xs: 3, md: 4 },
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h2" component="h2">
                  How to use this template
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  The repo README already outlines the core setup flow. This
                  page brings that path forward so new contributors understand
                  the shape of the template before they touch product code.
                </Typography>
                <Stack spacing={2}>
                  {quickStartSteps.map(
                    ({ step, title, description, command }) => (
                      <Box
                        key={step}
                        sx={{
                          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                          borderRadius: 4,
                          p: 2.5,
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Chip
                              label={step}
                              color="primary"
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                            <Typography variant="h6">{title}</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {description}
                          </Typography>
                          <Box
                            component="code"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.06),
                              borderRadius: 2,
                              color: 'primary.main',
                              display: 'inline-flex',
                              fontFamily: monoFontFamily,
                              fontSize: '0.95rem',
                              px: 1.5,
                              py: 1,
                              width: 'fit-content',
                            }}
                          >
                            {command}
                          </Box>
                        </Stack>
                      </Box>
                    ),
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 6,
                height: '100%',
                p: { xs: 3, md: 4 },
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h2" component="h2">
                  Project shape at a glance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  The source tree is arranged to support real product work:
                  reusable components and hooks, route loaders, auth state,
                  theming, and utilities already have a place.
                </Typography>

                <Stack spacing={2.5} divider={<Divider flexItem />}>
                  {architectureNotes.map(({ label, value }) => (
                    <Stack
                      key={label}
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ minWidth: 140, color: 'primary.main' }}
                      >
                        {label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Box
                  sx={{
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.secondary.main, 0.08),
                    p: 2.5,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Start with the repo, then tailor the product.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review the source, open Storybook, wire your environment
                    variables, and swap the placeholder routes and views for
                    domain-specific features.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Paper
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.info.main, 0.14)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            borderRadius: 6,
            p: { xs: 3, md: 4 },
          }}
        >
          <Stack spacing={2.5}>
            <Typography variant="h3" component="h2">
              Explore the template in GitHub
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 720 }}
            >
              The repository is the best reference for contribution details, CI
              and release conventions, and the files you will likely reshape
              first as you turn the template into an application.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component="a"
                href={TEMPLATE_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                variant="contained"
              >
                Open GitHub repository
              </Button>
              <Link
                href={TEMPLATE_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ alignSelf: 'center', fontWeight: 600 }}
              >
                {TEMPLATE_GITHUB_URL}
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      <Footer />
    </Box>
  )
}

export default Home
