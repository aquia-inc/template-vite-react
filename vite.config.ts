import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { normalizePublicBasePath } from './src/utils/publicBasePath'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: normalizePublicBasePath(env.VITE_PUBLIC_BASE_PATH),
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [react(), visualizer() as PluginOption],
    server: {
      watch: {
        ignored: ['**/coverage/**'],
      },
    },
    appType: 'spa',
  }
})
