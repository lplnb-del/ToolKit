/**
 * 剪贴板操作组合式函数
 * 提供复制文本到剪贴板功能
 */

import { ref } from 'vue'

const isSupported = ref(true)
const copied = ref(false)

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @param timeout 提示显示时间（毫秒）
 */
async function copy(text: string, timeout = 2000): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // 降级方案：使用 textarea
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.cssText = 'position: fixed; left: -9999px; opacity: 0;'
      document.body.appendChild(textarea)
      textarea.select()

      const success = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (!success) {
        throw new Error('execCommand failed')
      }
    }

    // 显示复制成功提示
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, timeout)

    return true
  } catch (err) {
    console.error('复制失败:', err)
    isSupported.value = false
    return false
  }
}

/**
 * 从剪贴板读取文本
 */
async function read(): Promise<string | null> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText()
    }
    return null
  } catch (err) {
    console.error('读取剪贴板失败:', err)
    return null
  }
}

export function useClipboard() {
  return {
    isSupported,
    copied,
    copy,
    read,
  }
}
