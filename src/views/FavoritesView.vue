<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">我的收藏</h1>
      <p class="text-gray-600 dark:text-gray-400">
        共收藏 {{ favoriteTools.length }} 个工具
      </p>
    </div>

    <div v-if="favoriteTools.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <ToolCard v-for="tool in favoriteTools" :key="tool.id" :tool="tool" :is-favorite="true"
        @toggle-favorite="toggleFavorite" />
    </div>

    <el-empty v-else description="暂无收藏的工具" class="py-20">
      <template #description>
        <p class="text-gray-500 dark:text-gray-400 mb-4">暂无收藏的工具</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">点击工具卡片上的星标即可收藏</p>
      </template>
      <router-link to="/">
        <el-button type="primary">浏览工具</el-button>
      </router-link>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ToolCard from '@/components/common/ToolCard.vue'
import { getAllTools } from '@/tools'
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()

// 收藏的工具
const favoriteTools = computed(() => {
  const allTools = getAllTools()
  return allTools.filter(tool => favoritesStore.isFavorite(tool.id))
})

const toggleFavorite = (toolId: string) => {
  favoritesStore.toggleFavorite(toolId)
}
</script>
