/**
 * Auth state loader for react-router data routes.
 * @module router/authLoader
 * @see {@link dashboard/Routes}
 */
import { defer } from 'react-router-dom'
import getJWT from '@/utils/getJWT'

const authLoader = async (): Promise<unknown> =>
  defer({
    jwtToken: getJWT(),
  })

export default authLoader
