/**
 * 最近使用状态管理
 * 管理用户最近使用的工具
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'toolkit-recent'
const MAX_RECENT_ITEMS = 20

export interface RecentItem {
  toolId: string
  timestamp: number
}

export const useRecentStore = defineStore('recent', () => {
  // 状态
  const recentItems = ref<RecentItem[]>([])

  // 计算属性
  const recentCount = computed(() => recentItems.value.length)
  const recentToolIds = computed(() => recentItems.value.map(item => item.toolId))

  // 从本地存储加载
  function loadRecent() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        recentItems.value = JSON.parse(saved)
      }
    } catch (err) {
      console.error('加载最近使用失败:', err)
      recentItems.value = []
    }
  }

  // 保存到本地存储
  function saveRecent() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentItems.value))
    } catch (err) {
      console.error('保存最近使用失败:', err)
    }
  }

  // 添加最近使用
  function addRecent(toolId: string) {
    // 移除已存在的相同项
    recentItems.value = recentItems.value.filter(item => item.toolId !== toolId)

    // 添加到开头
    recentItems.value.unshift({
      toolId,
      timestamp: Date.now(),
    })

    // 限制数量
    if (recentItems.value.length > MAX_RECENT_ITEMS) {
      recentItems.value = recentItems.value.slice(0, MAX_RECENT_ITEMS)
    }

    saveRecent()
  }

  // 移除最近使用
  function removeRecent(toolId: string) {
    recentItems.value = recentItems.value.filter(item => item.toolId !== toolId)
    saveRecent()
  }

  // 清空最近使用
  function clearRecent() {
    recentItems.value = []
    saveRecent()
  }

  // 格式化时间
  function formatTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
      return '刚刚'
    }
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} 分钟前`
    }
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} 小时前`
    }
    if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)} 天前`
    }

    const date = new Date(timestamp)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 初始化
  loadRecent()

  return {
    recentItems,
    recentCount,
    recentToolIds,
    addRecent,
    removeRecent,
    clearRecent,
    formatTime,
  }
})
