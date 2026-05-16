<template>
  <div class="animate-fade-in">
    <!-- 面包屑 -->
    <el-breadcrumb class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ categoryInfo?.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 分类标题 -->
    <div class="mb-4">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center"
          :style="{ backgroundColor: categoryInfo?.color + '20' }">
          <el-icon class="text-2xl" :style="{ color: categoryInfo?.color }">
            <component :is="categoryInfo?.icon || 'Folder'" />
          </el-icon>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ categoryInfo?.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ categoryInfo?.description }}</p>
        </div>
      </div>
    </div>

    <!-- 工具列表 -->
    <div v-if="tools.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <ToolCard v-for="tool in tools" :key="tool.id" :tool="tool" :is-favorite="isFavorite(tool.id)"
        @toggle-favorite="toggleFavorite" />
    </div>

    <el-empty v-else description="该分类暂无工具" class="py-20" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToolCard from '@/components/common/ToolCard.vue'
import { categories, getToolsByCategory, type ToolCategory } from '@/tools'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const favoritesStore = useFavoritesStore()

const categoryId = computed(() => route.params.category as ToolCategory)

const categoryInfo = computed(() => {
  return categories.find(c => c.id === categoryId.value)
})

const tools = computed(() => {
  return getToolsByCategory(categoryId.value)
})

const isFavorite = (toolId: string) => favoritesStore.isFavorite(toolId)
const toggleFavorite = (toolId: string) => favoritesStore.toggleFavorite(toolId)
</script>
