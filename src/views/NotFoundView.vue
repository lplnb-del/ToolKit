<template>
  <div class="animate-fade-in text-center py-20">
    <div class="mb-8">
      <el-icon class="text-9xl text-gray-300 dark:text-gray-700">
        <WarningFilled />
      </el-icon>
    </div>
    <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">页面不存在</p>
    <router-link to="/">
      <el-button type="primary" size="large">
        <el-icon class="mr-2">
          <HomeFilled />
        </el-icon>
        返回首页
      </el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { WarningFilled, HomeFilled } from '@element-plus/icons-vue'
</script>
