/**
 * State loader for react-router data routes that require user's all teams.
 * @module views/Dashboard/Dashboard.loader
 * @see {@link dashboard/Routes}
 */
import { getCurrentUser } from 'aws-amplify/auth'
import CONFIG from '@/utils/config'
import { getDemoAuthSession } from '@/utils/demoAuth'

const dashboardLoader = async (): Promise<{ username: string }> => {
  if (CONFIG.DEMO_AUTH_ENABLED) {
    return {
      username: getDemoAuthSession()?.username ?? '',
    }
  }

  const userInfo = await getCurrentUser()

  return {
    username: userInfo?.username ?? '',
  }
}

export default dashboardLoader
