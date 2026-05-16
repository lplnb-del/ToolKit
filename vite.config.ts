import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './',  // 关键配置：使用相对路径，支持任意子路径部署
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('element-plus')) return 'element-plus'
          if (id.includes('crypto-js')) return 'crypto'
          if (id.includes('qrcode') || id.includes('jsqr')) return 'qrcode'
          return null
        }
      }
    }
  }
})
