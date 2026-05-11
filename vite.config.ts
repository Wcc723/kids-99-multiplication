import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// GitHub Pages project page 的 base path
// 若 GitHub repo 名稱不同於此值，請同步更新（例如改名為 child-99-multiplication → '/child-99-multiplication/'）
const REPO_BASE = '/2026-child-99-multiplication/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : '/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
