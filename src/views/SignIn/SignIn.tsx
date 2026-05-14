/**
 * The view at the /login route that renders the sign in form.
 * @module views/SignIn/SignIn
 */
import React, { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputFormControl from '@/components/forms/InputFormControl'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import PasswordVisibilityToggle from '@/components/PasswordVisibilityToggle'
import SubmitButton from '@/components/forms/SubmitButton'
import BlankLayout from '@/layouts/BlankLayout'
import useSignIn from '@/views/SignIn/useSignIn'
import {
  BoxWrapper,
  CenteredFlexBox,
  LoginIllustrationWrapper,
  RightWrapper,
  SignInGraphic,
  VerticalCenteredFlexBox,
} from '@/views/SignIn/SignIn.components'
import { TContext, TFieldValues } from '@/views/SignIn/SignIn.interfaces'
import {
  AUTH_DISABLED_HELP,
  AUTH_DISABLED_MESSAGE,
  DEMO_AUTH_HELP,
  DEMO_AUTH_MESSAGE,
  PUBLIC_APP_NAME,
  SIGN_IN_CTA,
  SIGN_IN_CTA_IDP,
  SIGN_IN_DIRECTIONS,
  SIGN_IN_EMAIL_PLACEHOLDER,
  SIGN_IN_GREETING,
} from '@/locales/en'
import { Routes } from '@/router/constants'
import CONFIG from '@/utils/config'

const LoadingIcon: React.FC = () => {
  const { loading = false } = useSignIn()
  const { breakpoints } = useTheme()
  const hidden = useMediaQuery(breakpoints.down('md'))

  if (!loading) return null

  return (
    <Backdrop
      open={loading}
      style={{ marginTop: 0 }}
      sx={{
        borderRadius: hidden ? 2 : 0,
        position: 'absolute',
      }}
    >
      <CircularProgress data-testid="linear-indeterminate" />
    </Backdrop>
  )
}

const SignInForm: React.FC = () => {
  const {
    authEnabled,
    control,
    loading,
    handleFederatedSignIn,
    handleSubmit,
    showPassword,
    setShowPassword,
  } = useSignIn()

  return (
    <Stack
      component="form"
      id="login-form"
      role="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      spacing={3}
    >
      {!authEnabled && <Alert severity="warning">{AUTH_DISABLED_HELP}</Alert>}
      {CONFIG.DEMO_AUTH_ENABLED && (
        <Alert severity="info">{DEMO_AUTH_HELP}</Alert>
      )}
      <InputFormControl<TFieldValues, TContext>
        control={control}
        name="email"
        InputProps={{
          autoComplete: 'username',
          disabled: !authEnabled,
          placeholder: SIGN_IN_EMAIL_PLACEHOLDER,
        }}
      />
      <InputFormControl<TFieldValues, TContext>
        control={control}
        name="password"
        InputProps={{
          autoComplete: 'current-password',
          disabled: !authEnabled,
          endAdornment: (
            <PasswordVisibilityToggle
              disabled={!authEnabled}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          ),
          type: showPassword ? 'text' : 'password',
        }}
      />
      <SubmitButton
        disabled={loading || !authEnabled}
        fullWidth
        name="login"
        role="button"
      >
        {SIGN_IN_CTA}
      </SubmitButton>
      <LoadingIcon />
      {CONFIG.COGNITO_AUTH_ENABLED && CONFIG.IDP_ENABLED && (
        <>
          <Typography align="center" variant="subtitle2">
            or...
          </Typography>
          <Button
            disabled={!authEnabled}
            fullWidth
            onClick={handleFederatedSignIn}
            role="button"
            variant="outlined"
          >
            {SIGN_IN_CTA_IDP}
          </Button>
        </>
      )}
    </Stack>
  )
}

/**
 * Component that renders the page containing the sign in form.
 * @returns {JSX.Element} component that renders the the sign in form.
 */
const SignIn = (): JSX.Element => {
  const { breakpoints } = useTheme()
  const hidden = useMediaQuery(breakpoints.down('md'))
  const directions = CONFIG.AUTH_ENABLED
    ? CONFIG.DEMO_AUTH_ENABLED
      ? DEMO_AUTH_MESSAGE
      : SIGN_IN_DIRECTIONS
    : AUTH_DISABLED_MESSAGE

  return (
    <BoxWrapper
      id="box-wrapper"
      sx={{
        height: '100%',
        position: 'relative',
      }}
    >
      {hidden === false && (
        <CenteredFlexBox sx={{ flex: 1, position: 'relative' }}>
          <LoginIllustrationWrapper />
        </CenteredFlexBox>
      )}
      <RightWrapper hidden={hidden}>
        <CenteredFlexBox
          sx={{
            backgroundColor: 'background.paper',
            flexFlow: 'column',
            height: '100%',
            p: 7,
          }}
        >
          {hidden === false && (
            <CenteredFlexBox
              sx={{
                position: 'absolute',
                left: 40,
                top: 30,
              }}
            >
              <SignInGraphic />
              <Typography
                component={RouterLink}
                to={Routes.HOME}
                variant="h6"
                sx={{
                  color: 'inherit',
                  fontSize: '1.5rem !important',
                  lineHeight: 1,
                  ml: 2,
                  textDecoration: 'none',
                }}
              >
                {PUBLIC_APP_NAME}
              </Typography>
            </CenteredFlexBox>
          )}
          <VerticalCenteredFlexBox>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5">{`${SIGN_IN_GREETING} 👋🏻`}</Typography>
              <Typography variant="body2">{directions}</Typography>
            </Box>
            <SignInForm />
          </VerticalCenteredFlexBox>
        </CenteredFlexBox>
      </RightWrapper>
    </BoxWrapper>
  )
}

SignIn.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default SignIn
