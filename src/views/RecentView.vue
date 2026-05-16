<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">最近使用</h1>
      <p class="text-gray-600 dark:text-gray-400">
        共 {{ recentItems.length }} 个工具
      </p>
    </div>

    <div v-if="recentItems.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <ToolCard v-for="tool in recentTools" :key="tool.id" :tool="tool" :is-favorite="isFavorite(tool.id)"
          @toggle-favorite="toggleFavorite" />
      </div>

      <!-- 历史列表 -->
      <div class="card rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white">使用历史</h3>
          <el-button type="danger" text @click="clearRecent">
            <el-icon class="mr-1">
              <Delete />
            </el-icon>
            清空历史
          </el-button>
        </div>
        <div class="space-y-2">
          <div v-for="item in recentItems" :key="item.toolId + item.timestamp"
            class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-3">
              <el-icon class="text-gray-400">
                <Clock />
              </el-icon>
              <span class="text-gray-700 dark:text-gray-300">{{ getToolName(item.toolId) }}</span>
            </div>
            <span class="text-sm text-gray-400">{{ formatTime(item.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else description="暂无使用记录" class="py-20">
      <template #description>
        <p class="text-gray-500 dark:text-gray-400 mb-4">暂无使用记录</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">使用过的工具会显示在这里</p>
      </template>
      <router-link to="/">
        <el-button type="primary">开始使用</el-button>
      </router-link>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Delete } from '@element-plus/icons-vue'
import ToolCard from '@/components/common/ToolCard.vue'
import { getTool } from '@/tools'
import type { ToolDefinition } from '@/tools/types'
import { useFavoritesStore } from '@/stores/favorites'
import { useRecentStore } from '@/stores/recent'

const favoritesStore = useFavoritesStore()
const recentStore = useRecentStore()

// 最近使用的工具
const recentTools = computed(() => {
  return recentStore.recentToolIds
    .map(id => getTool(id))
    .filter((tool): tool is ToolDefinition => tool !== undefined)
})

const recentItems = computed(() => recentStore.recentItems)

const isFavorite = (toolId: string) => favoritesStore.isFavorite(toolId)
const toggleFavorite = (toolId: string) => favoritesStore.toggleFavorite(toolId)
const clearRecent = () => recentStore.clearRecent()
const formatTime = (timestamp: number) => recentStore.formatTime(timestamp)

function getToolName(toolId: string): string {
  const tool = getTool(toolId)
  return tool?.name || toolId
}
</script>
