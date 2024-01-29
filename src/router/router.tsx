/**
 * Component that renders all routes in the application.
 * @module router/router
 * @see {@link dashboard/main} for usage.
 */
import { createBrowserRouter } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import authLoader from '@/router/authLoader'
import { RouteIds, Routes } from '@/router/constants'
import configureCognito from '@/utils/configureCognito'
import AppLayout from '@/layouts/AppLayout/AppLayout'
import Home from '@/pages/Home/Home'
import SignIn from '@/pages/SignIn/SignIn'
import SignOut from '@/pages/SignOut/SignOut'
import Dashboard from '@/pages/Dashboard/Dashboard'
import dashboardLoader from '@/pages/Dashboard/Dashboard.loader'
import RootProvider from '@/Root'
import NavigateToHome from '@/components/react-router/NavigateToHome'
import BlankLayout from '@/layouts/BlankLayout'
import path from 'path'

/**
 * The hash router for the application that defines routes
 *  and specifies the loaders for routes with dynamic data.
 * @type {React.ComponentType} router - The browser router
 * @see {@link https://reactrouter.com/web/api/BrowserRouter BrowserRouter}
 * @see {@link https://reactrouter.com/en/main/route/loader loader}
 */
const router = createBrowserRouter([
  {
    id: RouteIds.ROOT,
    path: '/',
    element: <RootProvider />,
    errorElement: <ErrorBoundary />,
    loader: configureCognito,
    children: [
      {
        id: RouteIds.PUBLIC,
        element: <BlankLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            index: true,
            id: RouteIds.HOME,
            path: Routes.HOME,
            element: <Home />,
            errorElement: <ErrorBoundary />,
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
    ],
  },
  {
    path: '*',
    element: <NavigateToHome />,
  },
])

export default router
