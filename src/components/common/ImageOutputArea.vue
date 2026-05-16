<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">输出结果</span>
      <div class="flex items-center gap-1">
        <el-tooltip content="复制图片数据">
          <el-button text size="small" :disabled="!imageData" @click="$emit('copy')">
            <el-icon>
              <CopyDocument />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="下载图片">
          <el-button text size="small" :disabled="!imageData" @click="$emit('download')">
            <el-icon>
              <Download />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 min-h-[280px] flex items-center justify-center">
      <!-- 图片预览 -->
      <img
        v-if="imageData && !loading"
        :src="imageData"
        alt="输出结果"
        class="max-w-full max-h-[260px] object-contain"
      />

      <!-- 空状态 -->
      <div v-else-if="!loading && !imageData" class="text-center text-gray-400">
        <el-icon class="text-4xl mb-2">
          <Picture />
        </el-icon>
        <p class="text-sm">处理后的图片将显示在这里</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-800/90">
        <el-icon class="text-3xl text-blue-500 animate-spin mb-2">
          <Loading />
        </el-icon>
        <span class="text-sm text-gray-500">处理中...</span>
      </div>
    </div>

    <!-- 附加信息 -->
    <div v-if="info && !loading" class="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <slot name="info">
        <div class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ info }}</div>
      </slot>
    </div>

    <!-- 复制成功提示 -->
    <div v-if="copied" class="mt-2 text-xs text-green-500 text-center">
      已复制到剪贴板
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CopyDocument, Download, Loading, Picture } from '@element-plus/icons-vue'

const props = defineProps<{
  imageData: string
  info?: string
  loading?: boolean
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  'copy': []
  'download': []
}>()

const copied = ref(false)

// 监听变化重置复制状态
watch(() => props.imageData, () => {
  copied.value = false
})

// 暴露方法给父组件
defineExpose({
  showCopied() {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
})
</script>
