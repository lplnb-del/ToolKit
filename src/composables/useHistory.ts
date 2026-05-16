/**
 * 历史记录管理组合式函数
 * 管理工具操作历史记录
 */

import { ref, onMounted } from 'vue'

const STORAGE_KEY_PREFIX = 'toolkit-history-'
const MAX_HISTORY_ITEMS = 20

export interface HistoryItem {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any
  output: string
  timestamp: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

/**
 * 创建历史记录管理器
 * @param toolId 工具唯一标识
 */
export function useHistory(toolId: string) {
  const history = ref<HistoryItem[]>([])
  const storageKey = `${STORAGE_KEY_PREFIX}${toolId}`

  /**
   * 加载历史记录
   */
  function loadHistory() {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        history.value = JSON.parse(saved)
      }
    } catch (err) {
      console.error('加载历史记录失败:', err)
      history.value = []
    }
  }

  /**
   * 保存历史记录
   */
  function saveHistory() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history.value))
    } catch (err) {
      console.error('保存历史记录失败:', err)
    }
  }

  /**
   * 添加历史记录
   * @param input 输入内容（可以是字符串、数字、对象等）
   * @param output 输出内容
   * @param metadata 额外元数据
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addHistory(input: any, output: string, metadata?: Record<string, any>) {
    // 处理输入：如果是字符串则截断，否则转换为字符串
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let processedInput: any
    if (typeof input === 'string') {
      processedInput = input.slice(0, 1000) // 限制输入长度
    } else {
      processedInput = input
    }

    // 处理输出：确保是字符串再截断
    let processedOutput: string
    if (typeof output === 'string') {
      processedOutput = output.slice(0, 1000) // 限制输出长度
    } else {
      processedOutput = String(output).slice(0, 1000)
    }

    const item: HistoryItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      input: processedInput,
      output: processedOutput,
      timestamp: Date.now(),
      metadata,
    }

    // 添加到开头，限制数量
    history.value.unshift(item)
    if (history.value.length > MAX_HISTORY_ITEMS) {
      history.value = history.value.slice(0, MAX_HISTORY_ITEMS)
    }

    saveHistory()
  }

  /**
   * 删除历史记录
   */
  function removeHistory(id: string) {
    history.value = history.value.filter(item => item.id !== id)
    saveHistory()
  }

  /**
   * 清空历史记录
   */
  function clearHistory() {
    history.value = []
    localStorage.removeItem(storageKey)
  }

  /**
   * 格式化时间显示
   */
  function formatTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp

    // 小于 1 分钟
    if (diff < 60000) {
      return '刚刚'
    }

    // 小于 1 小时
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} 分钟前`
    }

    // 小于 24 小时
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} 小时前`
    }

    // 大于 24 小时
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  onMounted(() => {
    loadHistory()
  })

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory,
    formatTime,
  }
}
