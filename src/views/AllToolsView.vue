<template>
  <div class="animate-fade-in">
    <!-- 面包屑 -->
    <el-breadcrumb class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>全部工具</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">全部工具</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">共 {{ totalCount }} 个工具</p>
    </div>

    <!-- 按分类分组显示 -->
    <div v-for="category in categoriesWithTools" :key="category.id" class="mb-10">
      <!-- 分类标题 -->
      <div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: category.color + '20' }">
          <svg v-if="category.id === 'developer'" viewBox="0 0 24 24" width="1.25em" height="1.25em"
            :style="{ color: category.color }">
            <path fill="currentColor"
              d="M9.4 16.6 4.2-4.2-1.4 1.4L6 19.8l7.6-7.6 1.4 1.4-4.2 4.2zM13 2h6c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm6 16V4h-6v14z"/>
          </svg>
          <el-icon v-else :style="{ color: category.color }" :size="20">
            <component :is="category.icon || 'Folder'" />
          </el-icon>
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ category.name }}</h2>
        <span class="ml-auto px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          {{ getToolsByCategory(category.id).length }} 个工具
        </span>
      </div>

      <!-- 工具卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ToolCard
          v-for="tool in getToolsByCategory(category.id)"
          :key="tool.id"
          :tool="tool"
          :is-favorite="isFavorite(tool.id)"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>

    <el-empty v-if="totalCount === 0" description="暂无工具" class="py-20" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ToolCard from '@/components/common/ToolCard.vue'
import { categories, getAllTools, getToolsByCategory } from '@/tools'
import type { ToolCategory } from '@/tools/types'
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()

const totalCount = computed(() => getAllTools().length)

// 只返回有工具的分类
const categoriesWithTools = computed(() => {
  return categories.filter(cat => getToolsByCategory(cat.id as ToolCategory).length > 0)
})

const isFavorite = (toolId: string) => favoritesStore.isFavorite(toolId)
const toggleFavorite = (toolId: string) => favoritesStore.toggleFavorite(toolId)
</script>
