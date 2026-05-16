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

      <!-- 选项配置 -->
      <ToolOptions v-if="tool.options" v-model="options" :options="tool.options" class="mb-6" />

      <!-- 生成按钮 -->
      <div class="flex justify-center mb-6">
        <el-button type="primary" size="large" :loading="loading" @click="generate">
          <el-icon class="mr-2">
            <MagicStick />
          </el-icon>
          生成
        </el-button>
      </div>

      <!-- 输出区域 -->
      <OutputArea :value="output" :loading="loading" @copy="copyOutput" @download="downloadOutput" />

      <!-- 历史记录 -->
      <HistoryPanel v-if="history.length > 0" :history="history" :format-time="formatTime"
        @use-item="useHistoryItem" @clear="clearHistory" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, StarFilled, MagicStick } from '@element-plus/icons-vue'
import type { ToolDefinition } from '@/tools/types'
import { getCategory } from '@/tools'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistory } from '@/composables/useHistory'
import { useClipboard } from '@/composables/useClipboard'
import ToolOptions from './ToolOptions.vue'
import OutputArea from './OutputArea.vue'
import HistoryPanel from './HistoryPanel.vue'

const props = defineProps<{
  tool: ToolDefinition
}>()

const favoritesStore = useFavoritesStore()
const { copy } = useClipboard()
const { history, addHistory, clearHistory, formatTime } = useHistory(props.tool.id)

// 状态
const output = ref('')
const loading = ref(false)
const options = ref<Record<string, unknown>>({})

// 初始化选项默认值
if (props.tool.options) {
  props.tool.options.forEach(opt => {
    options.value[opt.name] = opt.defaultValue
  })
}

// 计算属性
const categoryInfo = computed(() => getCategory(props.tool.category))
const categoryName = computed(() => categoryInfo.value?.name || '未分类')
const categoryColor = computed(() => categoryInfo.value?.color || '#3b82f6')
const isFavorite = computed(() => favoritesStore.isFavorite(props.tool.id))

// 方法
function toggleFavorite() {
  favoritesStore.toggleFavorite(props.tool.id)
}

async function generate() {
  loading.value = true
  try {
    const result = await Promise.resolve(
      props.tool.execute('', options.value)
    )

    // 处理返回结果
    if (typeof result === 'string') {
      output.value = result
    } else if (result && typeof result === 'object') {
      // 如果是图片类型，使用 info 字段；否则转换为字符串
      if (result.type === 'image') {
        output.value = result.info || '图片已生成'
      } else {
        output.value = String(result)
      }
    } else {
      output.value = String(result)
    }

    // 添加到历史记录
    const historyOutput = typeof result === 'string' ? result : (result.info || String(result))
    addHistory((options.value.count as number) || 1, historyOutput, options.value)
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
  if (item.metadata) {
    options.value = { ...options.value, ...item.metadata }
  }
  generate()
}
</script>
