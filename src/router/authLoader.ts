/**
 * Auth state loader for react-router data routes.
 * @module router/authLoader
 * @see {@link dashboard/Routes}
 */
import getJWT from '@/utils/getJWT'

const authLoader = async (): Promise<{ jwtToken: string }> => ({
  jwtToken: await getJWT(),
})

export default authLoader
