<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">输入</span>
      <div class="flex items-center gap-1">
        <el-tooltip content="清空">
          <el-button text size="small" @click="$emit('clear')">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="粘贴">
          <el-button text size="small" @click="paste">
            <el-icon>
              <DocumentCopy />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <el-input v-model="modelValue" type="textarea" :rows="8" resize="none" class="font-mono"
      placeholder="在此输入..." />

    <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
      <span>字符数: {{ modelValue.length }}</span>
      <span v-if="byteLength > 0">字节数: {{ byteLength }}</span>
    </div>

    <!-- 快速示例 -->
    <div v-if="examples && examples.length > 0" class="mt-4">
      <span class="text-xs text-gray-500 dark:text-gray-400 mb-2 block">快速示例：</span>
      <div class="flex flex-wrap gap-2">
        <el-button v-for="(example, index) in examples" :key="index" size="small" text type="primary"
          @click="$emit('useExample', example)">
          {{ example.description || `示例 ${index + 1}` }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Delete, DocumentCopy } from '@element-plus/icons-vue'
import type { ToolExample } from '@/tools/types'

const props = defineProps<{
  modelValue: string
  examples?: ToolExample[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear': []
  'useExample': [example: ToolExample]
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 计算字节长度（UTF-8）
const byteLength = computed(() => {
  return new Blob([props.modelValue]).size
})

async function paste() {
  try {
    const text = await navigator.clipboard.readText()
    modelValue.value = text
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}
</script>
