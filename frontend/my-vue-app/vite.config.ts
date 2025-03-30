import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import postcss from 'postcss'

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer(), postcss()],
    },
  },
  plugins: [vue(), vueDevTools(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})