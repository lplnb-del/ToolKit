<template>
  <div class="border-t pt-6" style="border-color: var(--border-primary);">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">历史记录</h3>
      <el-button text type="danger" size="small" @click="$emit('clear')">
        <el-icon class="mr-1">
          <Delete />
        </el-icon>
        清空历史
      </el-button>
    </div>

    <div class="space-y-2 max-h-48 overflow-y-auto">
      <div v-for="item in history" :key="item.id"
        class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        style="background-color: var(--bg-secondary);" @click="$emit('useItem', item)">
        <div class="flex items-center gap-3 min-w-0">
          <el-icon class="text-gray-400 flex-shrink-0">
            <Clock />
          </el-icon>
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate font-mono max-w-[300px]">
            {{ formatInput(item.input) }}
          </span>
        </div>
        <span class="text-xs text-gray-400 flex-shrink-0 ml-4">
          {{ formatTime(item.timestamp) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, Clock } from '@element-plus/icons-vue'
import type { HistoryItem } from '@/composables/useHistory'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  history: HistoryItem[]
  formatTime: (timestamp: number) => string
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  'useItem': [item: HistoryItem]
  'clear': []
}>()

/**
 * 格式化输入显示
 * 处理字符串、数字等各种类型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatInput(input: any): string {
  if (typeof input === 'string') {
    return input
  }
  if (typeof input === 'number') {
    return `生成 ${input} 个`
  }
  if (typeof input === 'object') {
    return JSON.stringify(input)
  }
  return String(input)
}
</script>
