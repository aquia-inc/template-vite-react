const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

export const normalizePublicBasePath = (value: string | undefined): string => {
  const path = trimSlashes(value?.trim() ?? '')

  return path ? `/${path}/` : '/'
}

export const getRouterBasename = (
  value: string | undefined,
): string | undefined => {
  const normalized = normalizePublicBasePath(value)

  return normalized === '/' ? undefined : normalized.replace(/\/$/, '')
}
