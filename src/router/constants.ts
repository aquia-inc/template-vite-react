/**
 * Defines route IDs
 * @enum {string} RouteIds
 */
export enum RouteIds {
  ROOT = 'root',
  PUBLIC = 'public',
  PROTECTED = 'app',
  DASHBOARD = 'dashboard',
  HOME = 'home',
  AUTH = 'auth',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

/**
 * Defines route names of the application
 * @enum {string} RouteNames
 */
export enum RouteNames {
  DASHBOARD = 'Dashboard',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  HOME = 'Home',
}

/**
 * Defines route paths of the application
 * @enum {string} RouteNames
 */
export enum Routes {
  ROOT = '/',
  HOME = '',
  DASHBOARD = `/${RouteIds.PROTECTED}`,
  AUTH = `/${RouteIds.AUTH}/*`,
  AUTH_LOGIN = `/${RouteIds.AUTH}/${RouteIds.LOGIN}`,
  AUTH_LOGOUT = `/${RouteIds.AUTH}/${RouteIds.LOGOUT}`,
}
