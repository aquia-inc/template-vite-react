import { Navigate } from 'react-router-dom'
import { Routes } from '@/router/constants'

const NavigateToHome: React.FC = (): JSX.Element => (
  <Navigate to={Routes.HOME} replace={true} />
)

export default NavigateToHome
