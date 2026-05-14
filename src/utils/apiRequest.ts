/**
 * Factory to create a function that will make a request to the API
 * @module utils/apiRequest
 */
import CONFIG from '@/utils/config'
import getJWT from '@/utils/getJWT'
import sanitizeUrl from '@/utils/sanitizeUrl'

export type ApiRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiTokenResolver = () => Promise<string> | string

export type ApiRequestOptions<TBody = unknown> = {
  body?: TBody
  getToken?: ApiTokenResolver
  headers?: HeadersInit
  jwtToken?: string
  method?: ApiRequestMethod
  path: string
  signal?: AbortSignal
}

type ApiRequestErrorOptions = {
  body?: unknown
  cause?: unknown
  message: string
  path: string
  status: number
  statusText: string
}

export class ApiRequestError extends Error {
  readonly body?: unknown
  readonly path: string
  readonly status: number
  readonly statusText: string

  constructor({
    body,
    cause,
    message,
    path,
    status,
    statusText,
  }: ApiRequestErrorOptions) {
    super(message)
    this.name = 'ApiRequestError'
    this.body = body
    this.path = path
    this.status = status
    this.statusText = statusText

    if (cause !== undefined) {
      ;(this as Error & { cause?: unknown }).cause = cause
    }
  }
}

export const isApiRequestAbortError = (
  error: unknown,
): error is ApiRequestError => {
  return error instanceof ApiRequestError && error.statusText === 'AbortError'
}

const isAbortError = (error: unknown) => {
  return (
    error instanceof Error &&
    (error.name === 'AbortError' || error.message === 'Aborted')
  )
}

const getResponseErrorMessage = (status: number, body: unknown) => {
  if (body && typeof body === 'object') {
    const { detail, error, message } = body as Record<string, unknown>
    const bodyMessage = message ?? error ?? detail

    if (typeof bodyMessage === 'string' && bodyMessage.trim()) {
      return bodyMessage
    }
  }

  return `Request failed with status ${status}`
}

const resolveToken = async <TBody>({
  getToken,
  jwtToken,
  path,
}: Pick<ApiRequestOptions<TBody>, 'getToken' | 'jwtToken' | 'path'>) => {
  try {
    const token = jwtToken ?? (await (getToken ?? getJWT)())

    if (!token) {
      throw new Error('No JWT token provided')
    }

    return token
  } catch (cause) {
    throw new ApiRequestError({
      cause,
      message: 'Unable to resolve JWT token',
      path,
      status: 401,
      statusText: 'Unauthorized',
    })
  }
}

const parseResponseBody = async <TResponse>(
  response: Response,
  path: string,
  strictJson: boolean,
): Promise<TResponse | string | undefined> => {
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()

  if (text.trim() === '') {
    return undefined
  }

  try {
    return JSON.parse(text) as TResponse
  } catch (cause) {
    if (!strictJson) {
      return text
    }

    throw new ApiRequestError({
      body: text,
      cause,
      message: 'Invalid JSON response',
      path,
      status: response.status,
      statusText: response.statusText,
    })
  }
}

const fetchResponse = async (
  url: URL,
  init: RequestInit,
  path: string,
): Promise<Response> => {
  try {
    return await fetch(url.toString(), init)
  } catch (cause) {
    if (isAbortError(cause)) {
      throw new ApiRequestError({
        cause,
        message: 'Request aborted',
        path,
        status: 0,
        statusText: 'AbortError',
      })
    }

    throw new ApiRequestError({
      cause,
      message: 'Request failed before receiving a response',
      path,
      status: 0,
      statusText: 'Network Error',
    })
  }
}

/**
 * Make a request to the API.
 * @param {[Object]} body Optional request body.
 * @param {string} jwtToken Optional explicit Cognito JWT Token.
 * @param {Function} getToken Optional token resolver, defaults to getJWT.
 * @param {HeadersInit} headers Optional request headers.
 * @param {[string='GET']} method Optional HTTP method, defaults to 'GET'.
 * @param {string} path The path to the API endpoint.
 * @param {[AbortSignal]} signal Optional AbortSignal to cancel the request.
 * @returns {Promise<TResponse | undefined>} Parsed JSON response body, or undefined for 204/empty bodies.
 */
const apiRequest = async <TResponse, TBody = unknown>({
  body: bodyParam,
  getToken,
  headers: headersParam,
  jwtToken,
  method = 'GET',
  path,
  signal = new AbortController().signal,
}: ApiRequestOptions<TBody>): Promise<TResponse | undefined> => {
  const token = await resolveToken({ getToken, jwtToken, path })
  const url = sanitizeUrl(`${CONFIG.API_URL}/v1/${path}`)

  const headers = new Headers(headersParam)
  headers.set('Authorization', `${token}`)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const body = bodyParam === undefined ? null : JSON.stringify(bodyParam)

  const response = await fetchResponse(
    url,
    {
      body,
      headers: Object.fromEntries(headers.entries()),
      method,
      signal,
    },
    path,
  )

  const responseBody = await parseResponseBody<TResponse>(
    response,
    path,
    response.ok,
  )

  if (!response.ok) {
    throw new ApiRequestError({
      body: responseBody,
      message: getResponseErrorMessage(response.status, responseBody),
      path,
      status: response.status,
      statusText: response.statusText,
    })
  }

  return responseBody as TResponse | undefined
}

export default apiRequest
