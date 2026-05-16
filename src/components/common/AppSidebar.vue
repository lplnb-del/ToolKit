<template>
  <aside class="w-64 flex-shrink-0 hidden lg:block">
    <nav class="sticky top-24 space-y-1">
      <!-- 主导航 -->
      <router-link v-for="item in mainNavItems" :key="item.path" :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
        :class="isActive(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'">
        <el-icon class="text-xl">
          <component :is="item.icon" />
        </el-icon>
        <span class="font-medium text-base">{{ item.name }}</span>
      </router-link>

      <!-- 分隔线 -->
      <div class="pt-4 pb-2">
        <span class="px-4 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          工具分类
        </span>
      </div>

      <!-- 分类导航 -->
      <router-link v-for="category in categories" :key="category.id" :to="`/category/${category.id}`"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200"
        :class="isCategoryActive(category.id) ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center" :style="{ backgroundColor: category.color + '20' }">
          <!-- 使用 SVG 内联 -->
          <svg v-if="category.id === 'developer'" viewBox="0 0 24 24" width="1.5em" height="1.5em" :style="{ color: category.color }">
            <path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
          <svg v-else-if="category.id === 'calculator'" viewBox="0 0 24 24" width="1.5em" height="1.5em" :style="{ color: category.color }">
            <path fill="currentColor" d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h10V4H7zm2 2h6v2H9V6zm0 4h6v2H9v-2zm0 4h6v2H9v-2z"/>
          </svg>
          <el-icon v-else class="text-xl" :style="{ color: category.color }">
            <component :is="category.icon" />
          </el-icon>
        </div>
        <span class="text-base">{{ category.name }}</span>
        <span class="ml-auto text-sm text-gray-400 dark:text-gray-500">
          {{ category.count }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  Star,
  Clock,
  Grid,
  Lock,
  BrushFilled,
  MagicStick,
  Document,
  DataAnalysis,
  PictureFilled,
  Connection
} from '@element-plus/icons-vue'

const route = useRoute()

// 主导航
const mainNavItems = [
  { name: '首页', path: '/', icon: HomeFilled },
  { name: '收藏', path: '/favorites', icon: Star },
  { name: '最近使用', path: '/recent', icon: Clock },
  { name: '全部工具', path: '/all-tools', icon: Grid },
]

// 工具分类 - 使用正确的图标名称
const categories = [
  { id: 'encoder', name: '编码加密', icon: Lock, color: '#3b82f6', count: 7 },
  { id: 'developer', name: '开发辅助', icon: null, color: '#8b5cf6', count: 8 },
  { id: 'css', name: 'CSS 设计', icon: BrushFilled, color: '#06b6d4', count: 5 },
  { id: 'generator', name: '生成工具', icon: MagicStick, color: '#10b981', count: 4 },
  { id: 'formatter', name: '格式化', icon: Document, color: '#f59e0b', count: 5 },
  { id: 'data', name: '数据处理', icon: DataAnalysis, color: '#ec4899', count: 5 },
  { id: 'image', name: '图片工具', icon: PictureFilled, color: '#f97316', count: 3 },
  { id: 'network', name: '网络工具', icon: Connection, color: '#6366f1', count: 3 },
  { id: 'calculator', name: '计算换算', icon: null, color: '#14b8a6', count: 5 },
]

// 判断路由是否激活
function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// 判断分类是否激活
function isCategoryActive(categoryId: string): boolean {
  return route.params.category === categoryId
}
</script>
