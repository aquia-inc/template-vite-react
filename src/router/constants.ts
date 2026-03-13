export enum RouteIds {
  ROOT = 'root',
  HOME = 'home',
  PROTECTED = 'app',
  DASHBOARD = 'dashboard',
  AUTH = 'auth',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export enum RouteNames {
  HOME = 'Home',
  DASHBOARD = 'Dashboard',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
}

export enum Routes {
  ROOT = '/',
  HOME = ROOT,
  DASHBOARD = `/${RouteIds.PROTECTED}`,
  AUTH = `/${RouteIds.AUTH}/*`,
  AUTH_LOGIN = `/${RouteIds.AUTH}/${RouteIds.LOGIN}`,
  AUTH_LOGOUT = `/${RouteIds.AUTH}/${RouteIds.LOGOUT}`,
}
