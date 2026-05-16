import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  shortcuts: {
    'btn-primary': 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors',
    'btn-secondary': 'px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600',
    'card': 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all',
    'input-area': 'w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all',
  }
})
