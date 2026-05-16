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

      <!-- 输入输出区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 输入 -->
        <InputArea v-model="input" :examples="tool.examples" @use-example="useExample" @clear="clearInput" />

        <!-- 输出 - 根据输出类型选择组件 -->
        <template v-if="isImageOutput">
          <ImageOutputArea
            :image-data="imageOutput.dataUrl"
            :info="imageOutput.info"
            :loading="loading"
            @copy="copyImageOutput"
            @download="downloadImageOutput"
          />
        </template>
        <template v-else>
          <OutputArea :value="textOutput" :loading="loading" @copy="copyOutput" @download="downloadOutput" />
        </template>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center mt-6">
        <el-button type="primary" size="large" :loading="loading" @click="execute">
          <el-icon class="mr-2">
            <Switch />
          </el-icon>
          转换
        </el-button>
      </div>

      <!-- 历史记录 -->
      <HistoryPanel v-if="history.length > 0" :history="history" :format-time="formatTime"
        @use-item="useHistoryItem" @clear="clearHistory" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Star, StarFilled, Switch } from '@element-plus/icons-vue'
import type { ToolDefinition, ImageOutputResult } from '@/tools/types'
import { getCategory } from '@/tools'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistory } from '@/composables/useHistory'
import { useClipboard } from '@/composables/useClipboard'
import ToolOptions from './ToolOptions.vue'
import InputArea from './InputArea.vue'
import OutputArea from './OutputArea.vue'
import ImageOutputArea from './ImageOutputArea.vue'
import HistoryPanel from './HistoryPanel.vue'

const props = defineProps<{
  tool: ToolDefinition
}>()

const favoritesStore = useFavoritesStore()
const { copy } = useClipboard()
const { history, addHistory, clearHistory, formatTime } = useHistory(props.tool.id)

// 状态
const input = ref('')
const textOutput = ref('')
const imageOutput = ref<ImageOutputResult>({ type: 'image', dataUrl: '', info: '', fileName: '' })
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
const isImageOutput = computed(() => props.tool.outputType === 'image')

// 方法
function toggleFavorite() {
  favoritesStore.toggleFavorite(props.tool.id)
}

function useExample(example: { input: string; options?: Record<string, unknown> }) {
  input.value = example.input
  if (example.options) {
    options.value = { ...options.value, ...example.options }
  }
  execute()
}

function clearInput() {
  input.value = ''
  textOutput.value = ''
  imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
}

async function execute() {
  loading.value = true
  try {
    const result = await Promise.resolve(
      props.tool.execute(input.value, options.value)
    )

    // 判断返回类型
    if (typeof result === 'object' && result !== null && result.type === 'image') {
      imageOutput.value = result as ImageOutputResult
      textOutput.value = ''
    } else if (typeof result === 'string') {
      textOutput.value = result
      imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
    } else {
      // 处理其他类型（如对象转字符串）
      textOutput.value = String(result)
      imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
    }

    // 添加到历史记录
    addHistory(input.value, typeof result === 'string' ? result : result.info, options.value)
  } catch (err) {
    textOutput.value = `错误: ${(err as Error).message}`
    imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
  } finally {
    loading.value = false
  }
}

async function copyOutput() {
  if (textOutput.value) {
    await copy(textOutput.value)
  }
}

async function copyImageOutput() {
  if (imageOutput.value.dataUrl) {
    await copy(imageOutput.value.dataUrl)
  }
}

function downloadOutput() {
  if (!textOutput.value) return

  const blob = new Blob([textOutput.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.tool.id}-output.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadImageOutput() {
  if (!imageOutput.value.dataUrl) return

  const a = document.createElement('a')
  a.href = imageOutput.value.dataUrl
  a.download = imageOutput.value.fileName || `${props.tool.id}-output.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function useHistoryItem(item: { input: string; metadata?: Record<string, unknown> }) {
  input.value = item.input
  if (item.metadata) {
    options.value = { ...options.value, ...item.metadata }
  }
}

// 监听输入变化，自动执行（可选）
watch([input, options], () => {
  if (input.value.trim()) {
    // 可以在这里添加防抖自动执行
  }
}, { deep: true })
</script>
