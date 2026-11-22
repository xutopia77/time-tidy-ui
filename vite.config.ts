import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

function getBuildInfo() {
  const now = new Date()
  const updateDate = now.toISOString().split('T')[0]
  const buildNumber = updateDate.replace(/-/g, '') + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
  // VERSION file lives at the repo root; fall back to package.json so a
  // standalone frontend-ui clone can still build
  let version = ''
  try {
    version = readFileSync(resolve(__dirname, '../VERSION'), 'utf-8').trim()
  } catch {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8')) as { version?: string }
    version = pkg.version || '0.0.0'
  }
  return { version, updateDate, buildNumber }
}

const buildInfo = getBuildInfo()

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(buildInfo.version),
    __APP_UPDATE_DATE__: JSON.stringify(buildInfo.updateDate),
    __APP_BUILD_NUMBER__: JSON.stringify(buildInfo.buildNumber),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:38080',
        changeOrigin: true,
      },
    },
  },
})
