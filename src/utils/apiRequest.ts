/**
 * Factory to create a function that will make a request to the API
 * @module utils/apiRequest
 */
import CONFIG from '@/utils/config'
import sanitizeUrl from '@/utils/sanitizeUrl'

/**
 * Make a request to the API.
 * @param {[Object]} body Optional request body.
 * @param {string} jwtToken The Cognito JWT Token.
 * @param {[string='GET']} method Optional HTTP method, defaults to 'GET'.
 * @param {string} path The path to the API endpoint.
 * @param {[AbortSignal]} signal Optional AbortSignal to cancel the request.
 * @returns {Promise<Response>} Promise that resolves to the API response.
 */
const apiRequest = async ({
  body: bodyParam,
  jwtToken,
  method = 'GET',
  path,
  signal = new AbortController().signal,
}: {
  body?: Record<string, unknown>
  jwtToken: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  signal?: AbortSignal
}): Promise<Response> => {
  // ensure a jwtToken was provided, otherwise throw an error
  if (!jwtToken || typeof jwtToken === 'undefined') {
    throw new Error('No JWT token provided')
  }

  // create the url object with the path
  const url = sanitizeUrl(`${CONFIG.API_URL}/v1/${path}`)

  // create the headers object
  const headers = new Headers()
  headers.append('Authorization', `${jwtToken}`)
  headers.append('Content-Type', 'application/json')

  const body = bodyParam ? JSON.stringify(bodyParam) : null

  // return a promise for the fetch request
  return fetch(url, {
    // ensure a body exists and if so, stringify it
    body,
    // assign the configured headers to the request
    headers: Object.fromEntries(headers.entries()),
    method,
    signal,
  })
}

export default apiRequest
