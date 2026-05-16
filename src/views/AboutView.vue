<template>
  <div class="animate-fade-in max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">关于 ToolKit</h1>
      <p class="text-gray-600 dark:text-gray-400">纯静态、开源的开发者工具集合</p>
    </div>

    <div class="card rounded-2xl p-8 space-y-8">
      <!-- 项目介绍 -->
      <section>
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <el-icon>
            <InfoFilled />
          </el-icon>
          项目介绍
        </h2>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
          ToolKit 是一个纯静态的在线工具集合网站，专为开发者和日常办公人员设计。
          所有工具均在浏览器端运行，无需后端服务器，确保您的数据隐私安全。
        </p>
      </section>

      <!-- 核心特性 -->
      <section>
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <el-icon>
            <StarFilled />
          </el-icon>
          核心特性
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <div class="flex items-center gap-2 mb-2">
              <el-icon class="text-blue-500 text-xl">
                <Lock />
              </el-icon>
              <h3 class="font-semibold text-gray-900 dark:text-white">隐私安全</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">所有数据处理在本地完成，不上传服务器</p>
          </div>
          <div class="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
            <div class="flex items-center gap-2 mb-2">
              <el-icon class="text-green-500 text-xl">
                <Lightning />
              </el-icon>
              <h3 class="font-semibold text-gray-900 dark:text-white">即用即走</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">无需注册登录，打开即可使用</p>
          </div>
          <div class="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <div class="flex items-center gap-2 mb-2">
              <el-icon class="text-purple-500 text-xl">
                <Open />
              </el-icon>
              <h3 class="font-semibold text-gray-900 dark:text-white">开源免费</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">代码完全开源，永久免费使用</p>
          </div>
          <div class="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
            <div class="flex items-center gap-2 mb-2">
              <el-icon class="text-orange-500 text-xl">
                <Moon />
              </el-icon>
              <h3 class="font-semibold text-gray-900 dark:text-white">暗色主题</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">支持亮色/暗色主题切换</p>
          </div>
        </div>
      </section>

      <!-- 技术栈 -->
      <section>
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <el-icon>
            <Cpu />
          </el-icon>
          技术栈
        </h2>
        <div class="flex flex-wrap gap-2">
          <el-tag v-for="tech in techStack" :key="tech" type="info" effect="plain" size="large">
            {{ tech }}
          </el-tag>
        </div>
      </section>

      <!-- 更新日志 -->
      <section>
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <el-icon>
            <Timer />
          </el-icon>
          更新日志
        </h2>
        <el-timeline>
          <el-timeline-item v-for="log in updateLogs" :key="log.version" :type="log.type"
            :timestamp="log.date">
            <h4 class="font-semibold text-gray-900 dark:text-white">{{ log.version }}</h4>
            <ul class="mt-2 space-y-1">
              <li v-for="item in log.changes" :key="item" class="text-sm text-gray-600 dark:text-gray-400">
                • {{ item }}
              </li>
            </ul>
          </el-timeline-item>
        </el-timeline>
      </section>

      <!-- 联系我们 -->
      <section>
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <el-icon>
            <Message />
          </el-icon>
          联系我们
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          如有问题或建议，欢迎通过以下方式联系我们：
        </p>
        <div class="flex gap-4">
          <el-button type="primary" tag="a" href="https://github.com" target="_blank">
            <svg viewBox="0 0 24 24" width="1em" height="1em" class="mr-1">
              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            GitHub
          </el-button>
          <el-button>
            <el-icon class="mr-1">
              <Message />
            </el-icon>
            提交反馈
          </el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InfoFilled, StarFilled, Lock, Lightning, Open, Moon, Cpu, Timer, Message } from '@element-plus/icons-vue'

const techStack = [
  'Vue 3', 'TypeScript', 'Vite', 'Element Plus',
  'UnoCSS', 'Pinia', 'Vue Router', 'VueUse'
]

const updateLogs = [
  {
    version: 'v1.0.0',
    date: '2026-04-10',
    type: 'primary',
    changes: [
      '项目初始化',
      '基础架构搭建',
      'UI 设计完成'
    ]
  }
]
</script>
