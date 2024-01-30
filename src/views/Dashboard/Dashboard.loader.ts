/**
 * State loader for react-router data routes that require user's all teams.
 * @module views/Dashboard/Dashboard.loader
 * @see {@link dashboard/Routes}
 */
import { Auth } from 'aws-amplify'
import { defer } from 'react-router-dom'

// @ts-ignore
const dashboardLoader = async () => {
  const userInfo = await Auth.currentUserInfo()
  return defer({
    username: userInfo.username,
  })
}

export default dashboardLoader
