<template>
  <div class="card p-5 cursor-pointer animate-fade-in group" @click="navigateToTool">
    <div class="flex items-start gap-4">
      <!-- 图标 -->
      <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
        :style="{ backgroundColor: categoryColor + '20' }">
        <el-icon class="text-2xl" :style="{ color: categoryColor }">
          <component :is="tool.icon || 'Tools'" />
        </el-icon>
      </div>

      <!-- 内容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-semibold truncate text-gray-900 dark:text-white">
            {{ tool.name }}
          </h3>
          <span class="favorite-icon ml-auto" @click.stop="toggleFavorite">
            <el-icon :style="isFavorite ? { color: '#ef4444' } : {}" :class="isFavorite ? '' : 'text-gray-400 dark:text-gray-500'">
              <StarFilled v-if="isFavorite" />
              <Star v-else />
            </el-icon>
          </span>
        </div>
        <p class="text-sm mb-3 line-clamp-2 text-gray-500 dark:text-gray-400">
          {{ tool.description }}
        </p>
        <span class="category-badge" :class="`cat-${tool.category}`">
          {{ categoryName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Star, StarFilled } from '@element-plus/icons-vue'
import type { ToolDefinition } from '@/tools/types'

const props = defineProps<{
  tool: ToolDefinition
  isFavorite?: boolean
}>()

const emit = defineEmits<{
  toggleFavorite: [toolId: string]
}>()

const router = useRouter()

// 分类颜色映射
const categoryColors: Record<string, string> = {
  encoder: '#3b82f6',
  developer: '#8b5cf6',
  css: '#06b6d4',
  generator: '#10b981',
  formatter: '#f59e0b',
  data: '#ec4899',
  image: '#f97316',
  network: '#6366f1',
  calculator: '#14b8a6',
}

// 分类名称映射
const categoryNames: Record<string, string> = {
  encoder: '编码加密',
  developer: '开发辅助',
  css: 'CSS 设计',
  generator: '生成工具',
  formatter: '格式化',
  data: '数据处理',
  image: '图片工具',
  network: '网络工具',
  calculator: '计算换算',
}

const categoryColor = computed(() => categoryColors[props.tool.category] || '#3b82f6')
const categoryName = computed(() => categoryNames[props.tool.category] || '其他')

function navigateToTool() {
  router.push(`/tool/${props.tool.category}/${props.tool.id}`)
}

function toggleFavorite() {
  emit('toggleFavorite', props.tool.id)
}
</script>

<style scoped>
.category-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 500;
}

.cat-encoder {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.cat-developer {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.cat-css {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.cat-generator {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.cat-formatter {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.cat-data {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.cat-image {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.cat-network {
  background-color: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.cat-calculator {
  background-color: rgba(20, 184, 166, 0.1);
  color: #14b8a6;
}

/* 收藏图标样式 - 无背景、无边框 */
.favorite-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
}

.favorite-icon:hover .el-icon {
  transform: scale(1.1);
}

.favorite-icon .el-icon {
  font-size: 18px;
  transition: transform 0.2s ease, color 0.2s ease;
}
</style>
