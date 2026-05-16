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

      <!-- 输入区域 -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            输入内容
            <el-tooltip :content="inputHint" placement="top">
              <el-icon class="ml-1 text-gray-400 cursor-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </div>
        <el-input
          v-model="input"
          type="textarea"
          :rows="4"
          :placeholder="inputPlaceholder"
          class="w-full"
        />
      </div>

      <!-- 选项配置 -->
      <ToolOptions v-if="tool.options" v-model="options" :options="tool.options" class="mb-6" />

      <!-- 生成按钮 -->
      <div class="flex justify-center mb-6">
        <el-button type="primary" size="large" :loading="loading" @click="generate">
          <el-icon class="mr-2">
            <MagicStick />
          </el-icon>
          生成二维码
        </el-button>
      </div>

      <!-- 图片输出区域 -->
      <ImageOutputArea
        v-if="imageOutput.dataUrl"
        :image-data="imageOutput.dataUrl"
        :info="imageOutput.info"
        :loading="loading"
        @copy="copyImage"
        @download="downloadImage"
        class="mb-6"
      />

      <!-- 历史记录 -->
      <HistoryPanel v-if="history.length > 0" :history="history" :format-time="formatTime"
        @use-item="useHistoryItem" @clear="clearHistory" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Star, StarFilled, MagicStick, QuestionFilled } from '@element-plus/icons-vue'
import type { ToolDefinition, ImageOutputResult } from '@/tools/types'
import { getCategory } from '@/tools'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistory } from '@/composables/useHistory'
import { useClipboard } from '@/composables/useClipboard'
import { ElMessage } from 'element-plus'
import ToolOptions from './ToolOptions.vue'
import ImageOutputArea from './ImageOutputArea.vue'
import HistoryPanel from './HistoryPanel.vue'

const props = defineProps<{
  tool: ToolDefinition
}>()

const favoritesStore = useFavoritesStore()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { copy: _copyUnused } = useClipboard()
const { history, addHistory, clearHistory, formatTime } = useHistory(props.tool.id)

// 状态
const input = ref('')
const imageOutput = ref<ImageOutputResult>({
  type: 'image',
  dataUrl: '',
  info: '',
  fileName: ''
})
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

const qrType = computed(() => options.value.type || 'text')

const inputPlaceholder = computed(() => {
  switch (qrType.value) {
    case 'wifi':
      return 'WiFi名称\n密码\n加密类型(WPA/WPA2/WEP，可选)'
    case 'vcard':
      return '姓名\n电话\n邮箱(可选)\n公司(可选)\n职位(可选)'
    case 'email':
      return '邮箱地址\n主题(可选)\n正文(可选)'
    case 'tel':
      return '电话号码'
    case 'sms':
      return '电话号码\n短信内容(可选)'
    default:
      return '输入文本或URL...'
  }
})

const inputHint = computed(() => {
  switch (qrType.value) {
    case 'wifi':
      return '格式：WiFi名称(必填)\n密码(必填)\n加密类型(可选，默认WPA)'
    case 'vcard':
      return '格式：姓名(必填)\n电话(必填)\n邮箱\n公司\n职位'
    case 'email':
      return '格式：邮箱地址(必填)\n主题\n正文'
    case 'tel':
      return '格式：电话号码(必填)'
    case 'sms':
      return '格式：电话号码(必填)\n短信内容'
    default:
      return '直接输入文本或URL即可'
  }
})

// 方法
function toggleFavorite() {
  favoritesStore.toggleFavorite(props.tool.id)
}

async function generate() {
  if (!input.value.trim()) {
    ElMessage.warning('请输入要生成二维码的内容')
    return
  }

  loading.value = true
  try {
    console.log('Generating QR code with input:', input.value)
    console.log('Options:', options.value)

    const result = await Promise.resolve(
      props.tool.execute(input.value, options.value)
    )

    console.log('QR code result:', result)

    // 检查是否为图片输出
    if (result && typeof result === 'object' && result.type === 'image') {
      imageOutput.value = result as ImageOutputResult
      // 添加到历史记录
      addHistory(input.value, result.info || '二维码', options.value)
      ElMessage.success('二维码生成成功')
    } else {
      console.error('Invalid result format:', result)
      ElMessage.error('生成失败：返回格式不正确')
    }
  } catch (err) {
    console.error('QR code generation error:', err)
    ElMessage.error(`生成失败: ${(err as Error).message}`)
  } finally {
    loading.value = false
  }
}

async function copyImage() {
  if (imageOutput.value.dataUrl) {
    try {
      const response = await fetch(imageOutput.value.dataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
      ElMessage.success('图片已复制到剪贴板')
    } catch {
      ElMessage.error('复制失败，请尝试下载')
    }
  }
}

function downloadImage() {
  if (!imageOutput.value.dataUrl) return

  const a = document.createElement('a')
  a.href = imageOutput.value.dataUrl
  a.download = imageOutput.value.fileName || `qrcode_${Date.now()}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function useHistoryItem(item: { input: string; metadata?: Record<string, unknown> }) {
  input.value = item.input
  if (item.metadata) {
    options.value = { ...options.value, ...item.metadata }
  }
  generate()
}

// 监听类型变化，清空输入
watch(() => options.value.type, () => {
  input.value = ''
})
</script>
