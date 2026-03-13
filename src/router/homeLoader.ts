import { redirect } from 'react-router-dom'
import { Routes } from '@/router/constants'
import CONFIG from '@/utils/config'
import getJWT from '@/utils/getJWT'

const homeLoader = async (): Promise<null | Response> => {
  if (!CONFIG.AUTH_ENABLED) {
    return null
  }

  try {
    await getJWT()
    return redirect(Routes.DASHBOARD)
  } catch {
    return null
  }
}

export default homeLoader
