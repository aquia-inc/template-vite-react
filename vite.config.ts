import { defineConfig, transformWithEsbuild, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react-swc'
import EnvironmentPlugin from 'vite-plugin-environment'
import { visualizer } from 'rollup-plugin-visualizer'
import sass from 'sass'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
    /* eslint-disable prettier/prettier */
    global: {},
    _global: {},
    /* eslint-enable prettier/prettier */
  },
  resolve: {
    alias: {
      '@': '/src',
      'npm:': '/node_modules/',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
  plugins: [
    react(),
    EnvironmentPlugin('all'),
    visualizer() as PluginOption,
    {
      name: 'load+transform-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null
        }
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
  ],
  server: {
    watch: {
      ignored: ['**/coverage/**'],
    },
  },
  appType: 'spa',
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
