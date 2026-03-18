/**
 * Generic React error boundary component.
 * @module components/ErrorBoundary
 */
import { useNavigate, useRouteError } from 'react-router-dom'
import { isRouteErrorResponse } from 'react-router-dom'
import { useEffect } from 'react'
import Container from '@mui/material/Container'
import { Routes } from '@/router/constants'
import {
  GENERIC_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
  UNAUTHORIZED_ACCESS_MESSAGE,
} from '@/locales/en'
import Typography from '@mui/material/Typography'

const ErrorMessageMap = new Map<number, string>([
  [400, GENERIC_ERROR_MESSAGE],
  [401, SESSION_EXPIRED_MESSAGE],
  [403, UNAUTHORIZED_ACCESS_MESSAGE],
  [404, NOT_FOUND_ERROR_MESSAGE],
])

const useErrorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) {
    return (
      ErrorMessageMap.get((error.status || 400) ?? 0) ?? GENERIC_ERROR_MESSAGE
    )
  }

  return GENERIC_ERROR_MESSAGE
}

const useErrorTitle = (error: unknown): string => {
  if (isRouteErrorResponse(error) && error.status && error.statusText) {
    return `${error.status} ${error.statusText}`
  }

  return `Unknown Error`
}

/**
 * A generic React error boundary component.
 * @returns {JSX.Element}
 */
const ErrorBoundary: React.FC = (): JSX.Element => {
  const navigate = useNavigate()
  const error = useRouteError()
  const isUnauthorizedRouteError =
    isRouteErrorResponse(error) && error.status === 401
  const title = useErrorTitle(error)
  const message = useErrorMessage(error)
  const details = isRouteErrorResponse(error)
    ? error.data
    : error instanceof Error
      ? error.message
      : null

  useEffect(() => {
    if (!isUnauthorizedRouteError) {
      return undefined
    }

    const timeoutId = window.setTimeout(
      () => navigate(Routes.AUTH_LOGOUT),
      5000,
    )

    return () => window.clearTimeout(timeoutId)
  }, [isUnauthorizedRouteError, navigate])

  return (
    <Container sx={{ m: 3 }}>
      <Typography variant="h2">{title}</Typography>
      {details && <Typography variant="h3">{details}</Typography>}
      <p aria-label="error-message">
        <strong>{message}</strong>
      </p>
    </Container>
  )
}

export default ErrorBoundary
