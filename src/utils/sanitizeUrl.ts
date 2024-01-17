/**
 * Sanitizes a URL by removing any double slashes.
 * @module utils/sanitizeUrl
 * @param {string} url The URL to sanitize as a string.
 * @returns {URL} The sanitized URL.
 */
const sanitizeUrl = (url: string): URL => {
  const { origin, pathname, search, hash } = new URL(url)
  const sanitizedPath = pathname.replace(/\/{2,}/g, '/')
  return new URL(`${origin}${sanitizedPath}${search}${hash}`)
}

export default sanitizeUrl
