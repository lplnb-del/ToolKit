<template>
  <footer class="border-t mt-12 py-8 transition-colors duration-300"
    :style="{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- 版权信息 -->
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span class="font-semibold">ToolKit</span>
          <span class="text-sm">© 2026</span>
          <span class="text-sm text-gray-400 dark:text-gray-500">|</span>
          <span class="text-sm">纯静态工具集合</span>
        </div>

        <!-- 链接 -->
        <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <router-link to="/about" class="hover:text-blue-500 transition-colors">
            关于
          </router-link>
          <a href="#" class="hover:text-blue-500 transition-colors">
            更新日志
          </a>
          <a href="https://github.com" target="_blank" class="hover:text-blue-500 transition-colors flex items-center gap-1">
            <svg viewBox="0 0 24 24" width="1em" height="1em" class="inline-block">
              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            GitHub
          </a>
          <a href="#" class="hover:text-blue-500 transition-colors">
            反馈建议
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 底部组件
</script>
