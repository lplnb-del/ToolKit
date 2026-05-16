<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">输出</span>
      <div class="flex items-center gap-1">
        <el-tooltip content="复制">
          <el-button text size="small" :disabled="!value" @click="$emit('copy')">
            <el-icon>
              <CopyDocument />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="下载">
          <el-button text size="small" :disabled="!value" @click="$emit('download')">
            <el-icon>
              <Download />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="relative">
      <el-input v-model="displayValue" type="textarea" :rows="8" resize="none" class="font-mono" readonly
        placeholder="输出结果..." />

      <!-- 加载状态 -->
      <div v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded">
        <el-icon class="text-2xl text-blue-500 animate-spin">
          <Loading />
        </el-icon>
      </div>
    </div>

    <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
      <span>字符数: {{ value.length }}</span>
      <span v-if="copied" class="text-green-500">已复制到剪贴板</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CopyDocument, Download, Loading } from '@element-plus/icons-vue'

const props = defineProps<{
  value: string
  loading?: boolean
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  'copy': []
  'download': []
}>()

const copied = ref(false)

const displayValue = computed({
  get: () => props.value,
  set: () => { } // 只读
})

// 监听复制成功提示
watch(() => props.value, () => {
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
