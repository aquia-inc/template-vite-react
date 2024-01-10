/**
 * Component that renders the react-router Navigate component to
 *  redirect the user to the login page at the `/login` route.
 * @module components/react-router/NavigateToSignIn
 *
 * @see {@link dashboard/Routes} for usage.
 * @see {@link https://reactrouter.com/web/api/Navigate} for documentation.
 */
import { Navigate } from 'react-router-dom'
import { Routes } from '@/router/constants'

/**
 * Component that renders the Navigate component to redirect to the login page.
 * @returns {JSX.Element}
 */
const NavigateToSignIn: React.FC = (): JSX.Element => (
  <Navigate to={Routes.AUTH_LOGIN} replace={true} />
)

export default NavigateToSignIn
