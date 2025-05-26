/**
 * State loader for react-router data routes that require user's all teams.
 * @module views/Dashboard/Dashboard.loader
 * @see {@link dashboard/Routes}
 */
import { Auth } from 'aws-amplify'

// @ts-ignore
const dashboardLoader = async () => {
  const userInfo = await Auth.currentUserInfo()
  return {
    username: userInfo.username,
  }
}

export default dashboardLoader
