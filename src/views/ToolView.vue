<template>
  <div v-if="tool" class="animate-fade-in">
    <!-- 颜色选择器工具使用 ColorPickerLayout -->
    <ColorPickerLayout v-if="isColorPickerTool" :tool="tool" />
    <!-- 图片类工具使用 ImageUploadLayout -->
    <ImageUploadLayout v-else-if="isImageTool" :tool="tool" />
    <!-- 二维码生成器使用 QRCodeLayout -->
    <QRCodeLayout v-else-if="isQRCodeTool" :tool="tool" />
    <!-- 生成类工具使用 GeneratorLayout -->
    <GeneratorLayout v-else-if="isGeneratorTool" :tool="tool" />
    <!-- 普通工具使用 ToolLayout -->
    <ToolLayout v-else :tool="tool" />
  </div>

  <el-empty v-else description="工具不存在" class="py-20">
    <template #description>
      <p class="text-gray-500 dark:text-gray-400 mb-4">工具不存在</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">该工具可能已被移除或链接错误</p>
    </template>
    <router-link to="/">
      <el-button type="primary">返回首页</el-button>
    </router-link>
  </el-empty>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getTool } from '@/tools'
import { useRecentStore } from '@/stores/recent'
import ToolLayout from '@/components/common/ToolLayout.vue'
import GeneratorLayout from '@/components/common/GeneratorLayout.vue'
import ImageUploadLayout from '@/components/common/ImageUploadLayout.vue'
import ColorPickerLayout from '@/components/common/ColorPickerLayout.vue'
import QRCodeLayout from '@/components/common/QRCodeLayout.vue'

const route = useRoute()
const recentStore = useRecentStore()

const toolId = computed(() => route.params.id as string)
const tool = computed(() => {
  const t = getTool(toolId.value)
  if (t) {
    // 记录最近使用
    recentStore.addRecent(toolId.value)
  }
  return t
})

// 判断是否为图片类工具（需要上传图片文件）
const isImageTool = computed(() => {
  if (!tool.value) return false
  return ['image-compressor', 'qr-code-reader', 'image-to-base64'].includes(tool.value.id)
})

// 判断是否为生成类工具（没有输入，只有选项和生成按钮）
const isGeneratorTool = computed(() => {
  if (!tool.value) return false
  // 包含CSS生成器和数据生成器（不含二维码，它有专门的布局）
  return ['uuid', 'password', 'lorem-ipsum', 'box-shadow-generator', 'border-radius-generator', 'gradient-generator'].includes(tool.value.id)
})

// 判断是否为颜色选择器工具
const isColorPickerTool = computed(() => {
  if (!tool.value) return false
  return ['color-picker'].includes(tool.value.id)
})

// 判断是否为二维码生成器
const isQRCodeTool = computed(() => {
  if (!tool.value) return false
  return ['qr-code'].includes(tool.value.id)
})
</script>
