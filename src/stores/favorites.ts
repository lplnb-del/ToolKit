/**
 * 收藏状态管理
 * 管理用户收藏的工具
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'toolkit-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  // 状态
  const favorites = ref<string[]>([])

  // 计算属性
  const favoriteCount = computed(() => favorites.value.length)
  const isFavorite = (toolId: string) => favorites.value.includes(toolId)

  // 从本地存储加载
  function loadFavorites() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        favorites.value = JSON.parse(saved)
      }
    } catch (err) {
      console.error('加载收藏失败:', err)
      favorites.value = []
    }
  }

  // 保存到本地存储
  function saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    } catch (err) {
      console.error('保存收藏失败:', err)
    }
  }

  // 添加收藏
  function addFavorite(toolId: string) {
    if (!favorites.value.includes(toolId)) {
      favorites.value.push(toolId)
      saveFavorites()
    }
  }

  // 移除收藏
  function removeFavorite(toolId: string) {
    const index = favorites.value.indexOf(toolId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  // 切换收藏状态
  function toggleFavorite(toolId: string) {
    if (isFavorite(toolId)) {
      removeFavorite(toolId)
    } else {
      addFavorite(toolId)
    }
  }

  // 清空收藏
  function clearFavorites() {
    favorites.value = []
    saveFavorites()
  }

  // 初始化
  loadFavorites()

  return {
    favorites,
    favoriteCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  }
})
