/**
 * 主题管理组合式函数
 * 提供亮色/暗色主题切换功能
 */

import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'toolkit-theme'

export type Theme = 'light' | 'dark' | 'auto'

const currentTheme = ref<Theme>('auto')
const isDark = ref(false)

/**
 * 获取系统主题偏好
 */
function getSystemTheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 应用主题到 DOM
 */
function applyTheme(dark: boolean) {
  isDark.value = dark
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/**
 * 更新主题
 */
function updateTheme(theme: Theme) {
  currentTheme.value = theme

  if (theme === 'auto') {
    applyTheme(getSystemTheme())
  } else {
    applyTheme(theme === 'dark')
  }

  // 保存到本地存储
  localStorage.setItem(STORAGE_KEY, theme)
}

/**
 * 切换主题
 */
function toggleTheme() {
  const newTheme = isDark.value ? 'light' : 'dark'
  updateTheme(newTheme)
}

/**
 * 初始化主题
 */
function initTheme() {
  // 从本地存储读取
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null

  if (saved && ['light', 'dark', 'auto'].includes(saved)) {
    currentTheme.value = saved
  }

  updateTheme(currentTheme.value)

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (currentTheme.value === 'auto') {
      applyTheme(e.matches)
    }
  })
}

export function useTheme() {
  onMounted(() => {
    initTheme()
  })

  return {
    theme: currentTheme,
    isDark,
    updateTheme,
    toggleTheme,
  }
}
