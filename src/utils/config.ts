/**
 * Set global configuration for the application provided by Vite environment variables
 * @module utils/config
 * @exports CONFIG
 */
import { createAppConfig } from '@/utils/appConfig'

const CONFIG = createAppConfig(import.meta.env)

export default CONFIG
