/**
 * State loader for react-router data routes that require user's all teams.
 * @module views/Dashboard/Dashboard.loader
 * @see {@link dashboard/Routes}
 */
import { Auth } from 'aws-amplify'

type DashboardUserInfo = {
  username?: string | null
}

const dashboardLoader = async (): Promise<{ username: string }> => {
  const userInfo = (await Auth.currentUserInfo()) as DashboardUserInfo | null

  return {
    username: userInfo?.username ?? '',
  }
}

export default dashboardLoader
