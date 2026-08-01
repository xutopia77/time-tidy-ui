import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

function getBuildInfo() {
  const versionFile = resolve(__dirname, '../VERSION')
  const version = readFileSync(versionFile, 'utf-8').trim()
  const now = new Date()
  const updateDate = now.toISOString().split('T')[0]
  const buildNumber = updateDate.replace(/-/g, '') + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
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
