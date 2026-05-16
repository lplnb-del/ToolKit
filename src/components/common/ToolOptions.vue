<template>
  <div class="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
    <template v-for="option in options" :key="option.name">
      <!-- 单选按钮组 -->
      <div v-if="option.type === 'radio'" class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ option.label }}：</span>
        <el-radio-group :model-value="modelValue[option.name]" @update:model-value="(val: string | number | boolean) => updateValue(option.name, val)" size="small">
          <el-radio-button v-for="opt in option.options" :key="opt.value" :label="opt.value">
            {{ opt.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 下拉选择 -->
      <div v-else-if="option.type === 'select'" class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ option.label }}：</span>
        <el-select :model-value="modelValue[option.name]" @update:model-value="(val: string | number | boolean) => updateValue(option.name, val)" size="small" style="width: 140px">
          <el-option v-for="opt in option.options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </div>

      <!-- 复选框 -->
      <div v-else-if="option.type === 'checkbox'" class="flex items-center">
        <el-checkbox :model-value="modelValue[option.name]" @update:model-value="(val: boolean) => updateValue(option.name, val)" size="small">
          {{ option.label }}
        </el-checkbox>
      </div>

      <!-- 数字输入 -->
      <div v-else-if="option.type === 'number'" class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ option.label }}：</span>
        <el-input-number :model-value="modelValue[option.name]" @update:model-value="(val: number) => updateValue(option.name, val)" :min="option.min" :max="option.max" size="small"
          style="width: 120px" />
      </div>

      <!-- 文本输入 -->
      <div v-else-if="option.type === 'text' || option.type === 'input'" class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ option.label }}：</span>
        <el-input :model-value="modelValue[option.name]" @update:model-value="(val: string) => updateValue(option.name, val)" :placeholder="option.placeholder" size="small"
          style="width: 180px" />
      </div>

      <!-- 开关 -->
      <div v-else-if="option.type === 'switch'" class="flex items-center">
        <el-switch :model-value="modelValue[option.name]" @update:model-value="(val: boolean) => updateValue(option.name, val)" size="small" />
        <span class="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">{{ option.label }}</span>
      </div>

      <!-- 滑块 -->
      <div v-else-if="option.type === 'slider'" class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ option.label }}：</span>
        <el-slider :model-value="modelValue[option.name]" @update:model-value="(val: number) => updateValue(option.name, val)" :min="option.min" :max="option.max" :step="option.step" style="width: 200px" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ToolOption } from '@/tools/types'

const props = defineProps<{
  options: ToolOption[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'update:modelValue': [value: Record<string, any>]
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateValue(name: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [name]: value })
}
</script>
