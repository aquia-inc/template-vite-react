/**
 * Auth state loader for react-router data routes.
 * @module router/authLoader
 * @see {@link dashboard/Routes}
 */
import { redirect } from 'react-router-dom'
import getJWT from '@/utils/getJWT'
import { Routes } from '@/router/constants'
import CONFIG from '@/utils/config'

const authLoader = async (): Promise<Response | { jwtToken: string }> => {
  if (!CONFIG.AUTH_ENABLED) {
    return redirect(Routes.HOME)
  }

  try {
    return {
      jwtToken: await getJWT(),
    }
  } catch {
    return redirect(Routes.AUTH_LOGIN)
  }
}

export default authLoader
