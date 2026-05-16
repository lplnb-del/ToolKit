<template>
  <div class="animate-fade-in">
    <!-- 欢迎区域 -->
    <div class="mb-10 text-center py-10">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        开发者工具集合
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        纯静态、开源的在线工具网站，所有数据处理在本地完成，保护您的隐私安全
      </p>
    </div>

    <!-- 搜索栏（移动端显示） -->
    <div class="lg:hidden mb-8">
      <el-input v-model="searchQuery" placeholder="搜索工具..." clearable :prefix-icon="Search" size="large" />
    </div>

    <!-- 热门工具 -->
    <section v-if="!searchQuery" class="mb-10">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">热门工具</h2>
        <router-link to="/category/encoder" class="text-blue-500 hover:text-blue-600 text-sm font-medium">
          查看全部
        </router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ToolCard v-for="tool in popularTools" :key="tool.id" :tool="tool" :is-favorite="isFavorite(tool.id)"
          @toggle-favorite="toggleFavorite" />
      </div>
    </section>

    <!-- 最近使用 -->
    <section v-if="!searchQuery && recentTools.length > 0" class="mb-10">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">最近使用</h2>
        <router-link to="/recent" class="text-blue-500 hover:text-blue-600 text-sm font-medium">
          查看全部
        </router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ToolCard v-for="tool in recentTools" :key="tool.id" :tool="tool" :is-favorite="isFavorite(tool.id)"
          @toggle-favorite="toggleFavorite" />
      </div>
    </section>

    <!-- 搜索结果 -->
    <section v-if="searchQuery">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          搜索结果: {{ searchQuery }}
        </h2>
        <span class="text-gray-500 dark:text-gray-400 text-sm">
          找到 {{ searchResults.length }} 个工具
        </span>
      </div>
      <div v-if="searchResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ToolCard v-for="tool in searchResults" :key="tool.id" :tool="tool" :is-favorite="isFavorite(tool.id)"
          @toggle-favorite="toggleFavorite" />
      </div>
      <el-empty v-else description="未找到相关工具" class="py-20" />
    </section>

    <!-- 分类导航 -->
    <section v-if="!searchQuery" class="mb-10">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">按分类浏览</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <router-link v-for="category in categories" :key="category.id" :to="`/category/${category.id}`"
          class="card p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
          <!-- 统一使用 SVG 图标确保大小一致 -->
          <div class="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
            :style="{ backgroundColor: category.color + '20' }">
            <!-- 编码加密 - 锁 -->
            <svg v-if="category.id === 'encoder'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <!-- 开发辅助 - 代码 -->
            <svg v-else-if="category.id === 'developer'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            <!-- CSS 设计 - 画笔 -->
            <svg v-else-if="category.id === 'css'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96a.996.996 0 000-1.41z"/>
            </svg>
            <!-- 生成工具 - 魔法棒 -->
            <svg v-else-if="category.id === 'generator'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-8.66 10.78l2.44-2.44-1.54-1.54-2.44 2.44L9.83 8.36 8.29 9.9l2.44 2.44L8 13.07V16h2.93l.76-.76 2.44 2.44 1.54-1.54-2.44-2.44.76-.76H16v-2.93l-2.66-2.66z"/>
            </svg>
            <!-- 格式化 - 文档 -->
            <svg v-else-if="category.id === 'formatter'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <!-- 数据处理 - 图表 -->
            <svg v-else-if="category.id === 'data'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <!-- 图片工具 - 图片 -->
            <svg v-else-if="category.id === 'image'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <!-- 网络工具 - 网络 -->
            <svg v-else-if="category.id === 'network'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <!-- 计算换算 - 计算器 -->
            <svg v-else-if="category.id === 'calculator'" viewBox="0 0 24 24" width="2.5em" height="2.5em" :style="{ color: category.color }">
              <path fill="currentColor" d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h10V4H7zm2 2h6v2H9V6zm0 4h6v2H9v-2zm0 4h6v2H9v-2z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2">{{ category.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ category.description }}</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import ToolCard from '@/components/common/ToolCard.vue'
import { categories, getPopularTools, searchTools, getTool } from '@/tools'
import type { ToolDefinition } from '@/tools/types'
import { useFavoritesStore } from '@/stores/favorites'
import { useRecentStore } from '@/stores/recent'

const favoritesStore = useFavoritesStore()
const recentStore = useRecentStore()

const searchQuery = ref('')

// 热门工具
const popularTools = computed(() => getPopularTools(6))

// 最近使用的工具
const recentTools = computed(() => {
  return recentStore.recentToolIds
    .map(id => getTool(id))
    .filter((tool): tool is ToolDefinition => tool !== undefined)
    .slice(0, 6)
})

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  return searchTools(searchQuery.value)
})

// 收藏相关
const isFavorite = (toolId: string) => favoritesStore.isFavorite(toolId)
const toggleFavorite = (toolId: string) => favoritesStore.toggleFavorite(toolId)

// 监听搜索（可用于添加搜索统计）
watch(searchQuery, (newVal) => {
  if (newVal) {
    console.log('搜索:', newVal)
  }
})
</script>
