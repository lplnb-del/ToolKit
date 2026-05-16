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

      <!-- 上传输出区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 上传区域 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">图片上传</span>
            <div class="flex items-center gap-1">
              <el-tooltip content="清空">
                <el-button text size="small" @click="clearImage">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>

          <!-- 拖拽上传区域 -->
          <div
            ref="dropZoneRef"
            class="relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 min-h-[280px] flex flex-col items-center justify-center"
            :class="[
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary/50'
            ]"
            @dragenter.prevent="handleDragEnter"
            @dragleave.prevent="handleDragLeave"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />

            <!-- 未上传状态 -->
            <template v-if="!imageData">
              <el-icon class="text-6xl mb-4" :class="isDragging ? 'text-primary' : 'text-gray-400'">
                <Upload />
              </el-icon>
              <p class="text-gray-600 dark:text-gray-400 text-center mb-2">
                <span class="font-medium text-primary">点击上传</span> 或拖拽图片到此处
              </p>
              <p class="text-xs text-gray-400 text-center">
                支持 JPEG、PNG、WebP 格式
              </p>
            </template>

            <!-- 已上传预览 -->
            <template v-else>
              <img
                :src="imageData"
                alt="预览"
                class="max-w-full max-h-[200px] object-contain rounded-lg shadow-md"
              />
              <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {{ fileName }}
                <span class="text-gray-400">({{ formatFileSize(fileSize) }})</span>
              </p>
              <p class="mt-1 text-xs text-gray-400">点击图片重新选择</p>
            </template>
          </div>

          <!-- 文件信息 -->
          <div v-if="imageInfo" class="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-500 dark:text-gray-400">原始尺寸:</div>
              <div class="text-gray-900 dark:text-gray-100">{{ imageInfo.width }} × {{ imageInfo.height }} px</div>
              <div class="text-gray-500 dark:text-gray-400">文件大小:</div>
              <div class="text-gray-900 dark:text-gray-100">{{ formatFileSize(fileSize) }}</div>
            </div>
          </div>
        </div>

        <!-- 输出区域：根据工具输出类型选择组件 -->
        <template v-if="isTextOutput">
          <OutputArea :value="textOutput" :loading="loading" @copy="copyTextOutput" @download="downloadTextOutput" />
        </template>
        <template v-else>
          <ImageOutputArea
            :image-data="imageOutput.dataUrl"
            :info="imageOutput.info"
            :loading="loading"
            @copy="copyImageOutput"
            @download="downloadImageOutput"
          />
        </template>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center mt-6">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          :disabled="!imageData"
          @click="execute"
        >
          <el-icon class="mr-2">
            <Switch />
          </el-icon>
          {{ loading ? '处理中...' : buttonText }}
        </el-button>
      </div>

      <!-- 历史记录 -->
      <HistoryPanel
        v-if="history.length > 0"
        :history="history"
        :format-time="formatTime"
        @use-item="useHistoryItem"
        @clear="clearHistory"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, StarFilled, Switch, Delete, Upload } from '@element-plus/icons-vue'
import type { ToolDefinition, ImageOutputResult } from '@/tools/types'
import { getCategory } from '@/tools'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistory } from '@/composables/useHistory'
import { useClipboard } from '@/composables/useClipboard'
import ToolOptions from './ToolOptions.vue'
import ImageOutputArea from './ImageOutputArea.vue'
import OutputArea from './OutputArea.vue'
import HistoryPanel from './HistoryPanel.vue'

const props = defineProps<{
  tool: ToolDefinition
}>()

const favoritesStore = useFavoritesStore()
const { copy } = useClipboard()
const { history, addHistory, clearHistory, formatTime } = useHistory(props.tool.id)

// 状态
const imageData = ref('')
const fileName = ref('')
const fileSize = ref(0)
const imageInfo = ref<{ width: number; height: number } | null>(null)
const imageOutput = ref<ImageOutputResult>({ type: 'image', dataUrl: '', info: '', fileName: '' })
const textOutput = ref('')
const loading = ref(false)
const options = ref<Record<string, unknown>>({})
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const dropZoneRef = ref<HTMLElement | null>(null)

// 计算属性
const isTextOutput = computed(() => props.tool.outputType === 'text')
const buttonText = computed(() => {
  if (props.tool.id === 'qr-code-reader') return '开始识别'
  if (props.tool.id === 'image-compressor') return '开始压缩'
  return '开始处理'
})

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

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleDragEnter() {
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  // 确保是离开整个区域而不是子元素
  const rect = dropZoneRef.value?.getBoundingClientRect()
  if (rect) {
    const { clientX, clientY } = e
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      isDragging.value = false
    }
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0 && files[0]) {
    processFile(files[0])
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0 && files[0]) {
    processFile(files[0])
  }
}

function processFile(file: File) {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择有效的图片文件')
    return
  }

  fileName.value = file.name
  fileSize.value = file.size

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    imageData.value = result

    // 获取图片尺寸
    const img = new Image()
    img.onload = () => {
      imageInfo.value = {
        width: img.width,
        height: img.height
      }
    }
    img.src = result
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  imageData.value = ''
  fileName.value = ''
  fileSize.value = 0
  imageInfo.value = null
  imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
  textOutput.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function execute() {
  if (!imageData.value) {
    return
  }

  loading.value = true
  try {
    const result = await Promise.resolve(
      props.tool.execute(imageData.value, options.value)
    )

    // 判断返回类型
    if (typeof result === 'object' && result !== null && result.type === 'image') {
      imageOutput.value = result as ImageOutputResult
      textOutput.value = ''
    } else if (typeof result === 'string') {
      // 字符串结果
      textOutput.value = result
      imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
    } else {
      // 处理其他类型（如对象转字符串）
      textOutput.value = String(result)
      imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
    }

    // 添加到历史记录
    const outputText = typeof result === 'string' ? result : result.info
    addHistory(fileName.value || '图片文件', outputText || '处理完成', options.value)
  } catch (err) {
    textOutput.value = `错误：${(err as Error).message}`
    imageOutput.value = { type: 'image', dataUrl: '', info: '', fileName: '' }
  } finally {
    loading.value = false
  }
}

async function copyTextOutput() {
  if (textOutput.value) {
    await copy(textOutput.value)
  }
}

function downloadTextOutput() {
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

async function copyImageOutput() {
  if (imageOutput.value.dataUrl) {
    await copy(imageOutput.value.dataUrl)
  }
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
  // 历史记录中的图片无法恢复，提示用户重新上传
  alert('请重新上传图片文件')
  if (item.metadata) {
    options.value = { ...options.value, ...item.metadata }
  }
}
</script>

<style scoped>
.border-primary {
  border-color: var(--el-color-primary);
}

.bg-primary\/5 {
  background-color: var(--el-color-primary-light-9);
}

.text-primary {
  color: var(--el-color-primary);
}
</style>
