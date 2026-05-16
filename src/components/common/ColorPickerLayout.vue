<template>
  <div class="animate-fade-in">
    <!-- 面包屑 -->
    <el-breadcrumb class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/category/${tool.category}` }">
        {{ categoryName }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ tool.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 工具卡片 -->
    <div class="card rounded-2xl p-6">
      <!-- 工具头部 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center"
            :style="{ backgroundColor: categoryColor + '20' }">
            <el-icon class="text-3xl" :style="{ color: categoryColor }">
              <component :is="tool.icon || 'Tools'" />
            </el-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ tool.name }}</h1>
            <p class="text-gray-600 dark:text-gray-400">{{ tool.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <el-button :type="isFavorite ? 'warning' : 'default'" @click="toggleFavorite">
            <el-icon class="mr-1">
              <StarFilled v-if="isFavorite" />
              <Star v-else />
            </el-icon>
            {{ isFavorite ? '已收藏' : '收藏' }}
          </el-button>
        </div>
      </div>

      <!-- 交互式颜色选择器 -->
      <ColorPicker v-model="selectedColor" class="mb-6" />

      <!-- 输出区域 -->
      <OutputArea :value="output" :loading="loading" @copy="copyOutput" @download="downloadOutput" />

      <!-- 预设颜色 -->
      <div class="mt-6">
        <span class="text-sm text-gray-500 dark:text-gray-400 mb-2 block">预设颜色：</span>
        <div class="flex flex-wrap gap-2">
          <div v-for="preset in presetColors" :key="preset.hex" class="preset-color" :style="{ backgroundColor: preset.hex }"
            :title="preset.name" @click="selectPreset(preset.hex)">
          </div>
        </div>
      </div>

      <!-- 历史记录 -->
      <HistoryPanel v-if="history.length > 0" :history="history" :format-time="formatTime"
        @use-item="useHistoryItem" @clear="clearHistory" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import type { ToolDefinition } from '@/tools/types'
import { getCategory } from '@/tools'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistory } from '@/composables/useHistory'
import { useClipboard } from '@/composables/useClipboard'
import ColorPicker from './ColorPicker.vue'
import OutputArea from './OutputArea.vue'
import HistoryPanel from './HistoryPanel.vue'

const props = defineProps<{
  tool: ToolDefinition
}>()

const favoritesStore = useFavoritesStore()
const { copy } = useClipboard()
const { history, addHistory, clearHistory, formatTime } = useHistory(props.tool.id)

// 预设颜色
const presetColors = [
  { name: '红色', hex: '#EF4444' },
  { name: '橙色', hex: '#F97316' },
  { name: '黄色', hex: '#EAB308' },
  { name: '绿色', hex: '#22C55E' },
  { name: '青色', hex: '#06B6D4' },
  { name: '蓝色', hex: '#3B82F6' },
  { name: '紫色', hex: '#8B5CF6' },
  { name: '粉色', hex: '#EC4899' },
  { name: '灰色', hex: '#6B7280' },
  { name: '黑色', hex: '#1F2937' },
  { name: '白色', hex: '#FFFFFF' },
  { name: '天蓝', hex: '#0EA5E9' },
  { name: '翠绿', hex: '#10B981' },
  { name: '琥珀', hex: '#F59E0B' },
  { name: '玫瑰', hex: '#F43F5E' },
  { name: '靛蓝', hex: '#6366F1' },
]

// 状态
const selectedColor = ref('#3B82F6')
const output = ref('')
const loading = ref(false)

// 计算属性
const categoryInfo = computed(() => getCategory(props.tool.category))
const categoryName = computed(() => categoryInfo.value?.name || '未分类')
const categoryColor = computed(() => categoryInfo.value?.color || '#3b82f6')
const isFavorite = computed(() => favoritesStore.isFavorite(props.tool.id))

// 方法
function toggleFavorite() {
  favoritesStore.toggleFavorite(props.tool.id)
}

function selectPreset(hex: string) {
  selectedColor.value = hex
}

async function generateOutput() {
  loading.value = true
  try {
    const result = await Promise.resolve(
      props.tool.execute(selectedColor.value, {})
    )
    output.value = result as string
    addHistory(selectedColor.value, result as string, {})
  } catch (err) {
    output.value = `错误: ${(err as Error).message}`
  } finally {
    loading.value = false
  }
}

async function copyOutput() {
  if (output.value) {
    await copy(output.value)
  }
}

function downloadOutput() {
  if (!output.value) return

  const blob = new Blob([output.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.tool.id}-output.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function useHistoryItem(item: { input: string; metadata?: Record<string, unknown> }) {
  selectedColor.value = item.input
}

// 监听颜色变化
watch(selectedColor, () => {
  generateOutput()
}, { immediate: true })

// 初始化
generateOutput()
</script>

<style scoped>
.preset-color {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.preset-color:hover {
  transform: scale(1.1);
  border-color: #3B82F6;
}
</style>
