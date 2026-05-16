<template>
  <header class="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 app-header"
    :class="{ 'dark': isDark }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <el-icon class="text-white text-xl">
              <Tools />
            </el-icon>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">ToolKit</span>
        </router-link>

        <!-- Search -->
        <div class="flex-1 max-w-md mx-8 hidden md:block">
          <el-input v-model="searchQuery" placeholder="搜索工具..." clearable class="w-full"
            :prefix-icon="Search" @keyup.enter="handleSearch" />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- 主题切换 -->
          <el-tooltip content="切换主题">
            <el-button circle @click="toggleTheme">
              <el-icon v-if="isDark" class="text-lg">
                <Moon />
              </el-icon>
              <el-icon v-else class="text-lg">
                <Sunny />
              </el-icon>
            </el-button>
          </el-tooltip>

          <!-- GitHub -->
          <el-tooltip content="GitHub">
            <el-button circle tag="a" href="https://github.com" target="_blank">
              <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="text-gray-700 dark:text-gray-300">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Tools, Moon, Sunny } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/', query: { search: searchQuery.value } })
  }
}
</script>

<style scoped>
.app-header {
  background-color: rgba(255, 255, 255, 0.85);
  border-color: var(--border-primary);
}

.app-header.dark {
  background-color: rgba(15, 23, 42, 0.85);
}

:deep(.el-input__wrapper) {
  background-color: var(--bg-tertiary);
  box-shadow: 0 0 0 1px var(--border-primary) inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--border-secondary) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}
</style>
