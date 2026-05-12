/**
 * Component that renders all routes in the application.
 * @module router/router
 * @see {@link dashboard/main} for usage.
 */
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import authLoader from '@/router/authLoader'
import homeLoader from '@/router/homeLoader'
import { RouteIds, Routes } from '@/router/constants'
import configureCognito from '@/utils/configureCognito'
import AppLayout from '@/layouts/AppLayout/AppLayout'
import SignIn from '@/views/SignIn/SignIn'
import SignOut from '@/views/SignOut/SignOut'
import Dashboard from '@/views/Dashboard/Dashboard'
import dashboardLoader from '@/views/Dashboard/Dashboard.loader'
import Home from '@/views/Home/Home'
import RootProvider from '@/Root'
import NavigateToHome from '@/components/react-router/NavigateToHome'
import { getRouterBasename } from '@/utils/publicBasePath'

/**
 * The hash router for the application that defines routes
 *  and specifies the loaders for routes with dynamic data.
 * @type {React.ComponentType} router - The browser router
 * @see {@link https://reactrouter.com/web/api/BrowserRouter BrowserRouter}
 * @see {@link https://reactrouter.com/en/main/route/loader loader}
 */
export const appRoutes: RouteObject[] = [
  {
    id: RouteIds.ROOT,
    path: Routes.ROOT,
    element: <RootProvider />,
    errorElement: <ErrorBoundary />,
    loader: configureCognito,
    children: [
      {
        index: true,
        id: RouteIds.HOME,
        element: <Home />,
        errorElement: <ErrorBoundary />,
        loader: homeLoader,
      },
      {
        id: RouteIds.AUTH,
        path: Routes.AUTH,
        errorElement: <ErrorBoundary />,
        children: [
          {
            id: RouteIds.LOGIN,
            path: RouteIds.LOGIN,
            element: <SignIn />,
            errorElement: <ErrorBoundary />,
          },
          {
            id: RouteIds.LOGOUT,
            path: RouteIds.LOGOUT,
            element: <SignOut />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: Routes.DASHBOARD,
        id: RouteIds.PROTECTED,
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        loader: authLoader,
        children: [
          {
            index: true,
            id: RouteIds.DASHBOARD,
            element: <Dashboard />,
            errorElement: <ErrorBoundary />,
            loader: dashboardLoader,
          },
        ],
      },
      {
        path: '*',
        element: <NavigateToHome />,
      },
    ],
  },
]

const router = createBrowserRouter(appRoutes, {
  basename: getRouterBasename(import.meta.env.VITE_PUBLIC_BASE_PATH),
})

export default router
