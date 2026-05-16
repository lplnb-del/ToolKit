# ToolKit - 开发计划文档

## 1. 技术栈确认

### 1.1 核心技术
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| TypeScript | 5.0+ | 类型系统 |
| Vite | 5.0+ | 构建工具 |

### 1.2 UI 与样式
| 技术 | 用途 |
|------|------|
| Element Plus | UI 组件库 |
| UnoCSS | 原子化 CSS |
| Lucide Vue | 图标库 |

### 1.3 状态与工具
| 技术 | 用途 |
|------|------|
| Pinia | 状态管理 |
| VueUse | 组合式函数 |
| Vue Router | 路由管理 |

### 1.4 工具库
| 技术 | 用途 |
|------|------|
| Day.js | 日期处理 |
| Lodash-es | 工具函数 |
| js-base64 | Base64 编解码 |
| crypto-js | 加密哈希 |
| qrcode | 二维码生成 |
| jsqr | 二维码识别 |
| pako | 压缩解压 |
| file-saver | 文件下载 |
| highlight.js | 代码高亮 |

### 1.5 开发工具
| 技术 | 用途 |
|------|------|
| ESLint | 代码检查 |
| Prettier | 代码格式化 |
| Vitest | 单元测试 |

---

## 2. 项目结构

```
toolkit/
├── public/                          # 静态资源
│   ├── favicon.ico
│   └── icons/
├── src/
│   ├── assets/                      # 资源文件
│   │   ├── styles/                  # 全局样式
│   │   │   ├── variables.css        # CSS 变量
│   │   │   ├── main.css             # 主样式
│   │   │   └── markdown.css         # Markdown 样式
│   │   └── icons/                   # 自定义图标
│   │
│   ├── components/                  # 公共组件
│   │   ├── common/                  # 通用组件
│   │   │   ├── AppHeader.vue        # 顶部导航
│   │   │   ├── AppSidebar.vue       # 侧边栏
│   │   │   ├── AppFooter.vue        # 底部
│   │   │   ├── ToolCard.vue         # 工具卡片
│   │   │   ├── ToolLayout.vue       # 工具页面布局
│   │   │   ├── InputArea.vue        # 输入区域
│   │   │   ├── OutputArea.vue       # 输出区域
│   │   │   ├── CopyButton.vue       # 复制按钮
│   │   │   └── ThemeToggle.vue      # 主题切换
│   │   │
│   │   └── tools/                   # 工具专用组件
│   │       ├── encoder/
│   │       ├── converter/
│   │       ├── generator/
│   │       ├── formatter/
│   │       ├── css/
│   │       ├── image/
│   │       ├── text/
│   │       └── data/
│   │
│   ├── composables/                 # 组合式函数
│   │   ├── useClipboard.ts          # 剪贴板
│   │   ├── useLocalStorage.ts       # 本地存储
│   │   ├── useFileReader.ts         # 文件读取
│   │   ├── useHistory.ts            # 历史记录
│   │   ├── useTheme.ts              # 主题
│   │   └── useTool.ts               # 工具通用
│   │
│   ├── layouts/                     # 布局组件
│   │   └── DefaultLayout.vue
│   │
│   ├── router/                      # 路由
│   │   └── index.ts
│   │
│   ├── stores/                      # Pinia 状态
│   │   ├── app.ts                   # 应用状态
│   │   ├── history.ts               # 历史记录
│   │   └── favorites.ts             # 收藏
│   │
│   ├── tools/                       # 工具实现
│   │   ├── index.ts                 # 工具注册中心
│   │   ├── types.ts                 # 工具类型定义
│   │   │
│   │   ├── encoder/                 # 编码加密
│   │   │   ├── base64.ts            # Base64 编解码
│   │   │   ├── url.ts               # URL 编解码
│   │   │   ├── hash.ts              # 哈希计算
│   │   │   └── aes.ts               # AES 加密
│   │   │
│   │   ├── converter/               # 转换工具
│   │   │   ├── timestamp.ts         # 时间戳转换
│   │   │   ├── color.ts             # 颜色转换
│   │   │   └── numberBase.ts        # 进制转换
│   │   │
│   │   ├── generator/               # 生成工具
│   │   │   ├── uuid.ts              # UUID 生成
│   │   │   ├── password.ts          # 密码生成
│   │   │   └── qrcode.ts            # 二维码生成
│   │   │
│   │   ├── formatter/               # 格式化
│   │   │   ├── json.ts              # JSON 格式化
│   │   │   └── sql.ts               # SQL 格式化
│   │   │
│   │   ├── css/                     # CSS 工具
│   │   │   ├── colorConverter.ts    # 颜色转换
│   │   │   └── gradient.ts          # 渐变生成
│   │   │
│   │   ├── image/                   # 图片工具
│   │   │   └── compress.ts          # 图片压缩
│   │   │
│   │   ├── text/                    # 文本工具
│   │   │   └── diff.ts              # 文本对比
│   │   │
│   │   └── data/                    # 数据处理
│   │       ├── csvJson.ts           # CSV/JSON 互转
│   │       └── textProcess.ts       # 文本处理
│   │
│   ├── types/                       # 类型定义
│   │   └── index.ts
│   │
│   ├── utils/                       # 工具函数
│   │   ├── crypto.ts                # 加密相关
│   │   ├── file.ts                  # 文件处理
│   │   ├── validators.ts            # 验证函数
│   │   ├── formatters.ts            # 格式化函数
│   │   └── helpers.ts               # 辅助函数
│   │
│   ├── views/                       # 页面视图
│   │   ├── HomeView.vue             # 首页
│   │   ├── ToolView.vue             # 工具页面
│   │   ├── FavoritesView.vue        # 收藏页
│   │   └── AboutView.vue            # 关于页
│   │
│   ├── App.vue
│   └── main.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── uno.config.ts                    # UnoCSS 配置
├── eslint.config.js
└── prettier.config.js
```

---

## 3. 开发阶段规划

### Phase 1: 基础架构 (Week 1)

#### 3.1.1 项目初始化
- [ ] 使用 `npm create vue@latest` 创建项目
- [ ] 配置 TypeScript 严格模式
- [ ] 安装并配置 Vite 插件
- [ ] 配置路径别名 `@`

#### 3.1.2 依赖安装
```bash
# UI 组件库
npm install element-plus

# 样式工具
npm install -D unocss @unocss/preset-uno @unocss/preset-attributify

# 图标
npm install lucide-vue-next

# 状态管理
npm install pinia
npm install @vueuse/core

# 路由
npm install vue-router@4

# 工具库
npm install dayjs lodash-es js-base64 crypto-js qrcode jsqr pako file-saver highlight.js

# 开发工具
npm install -D vitest @vue/test-utils jsdom
npm install -D eslint prettier eslint-plugin-vue
```

#### 3.1.3 基础配置
- [ ] 配置 UnoCSS（原子化 CSS）
- [ ] 配置 Element Plus（按需导入）
- [ ] 配置 Vue Router
- [ ] 配置 Pinia
- [ ] 配置 ESLint + Prettier

#### 3.1.4 基础组件
- [ ] AppHeader - 顶部导航
- [ ] AppSidebar - 侧边栏菜单
- [ ] AppFooter - 底部
- [ ] ThemeToggle - 主题切换
- [ ] DefaultLayout - 默认布局

#### 3.1.5 组合式函数
- [ ] useTheme - 主题管理
- [ ] useClipboard - 剪贴板操作
- [ ] useLocalStorage - 本地存储

---

### Phase 2: 核心工具实现 (Week 2-3)

#### 3.2.1 编码加密类 (P0)
| 工具 | 功能点 | 预计时间 |
|-----|--------|---------|
| Base64 编解码 | 文本/Base64 互转、文件转 Base64 | 4h |
| URL 编解码 | 编码/解码、全编码/部分编码 | 2h |
| 哈希计算 | MD5/SHA1/SHA256/SHA512、文件哈希 | 4h |

#### 3.2.2 开发辅助类 (P0)
| 工具 | 功能点 | 预计时间 |
|-----|--------|---------|
| JSON 格式化 | 美化/压缩/验证/转义、树形查看 | 6h |
| 时间戳转换 | 当前时间、时间戳/日期互转 | 3h |
| 正则表达式测试 | 实时匹配、常用正则库、替换 | 6h |
| UUID 生成 | V4/V7、批量生成、格式选项 | 3h |
| 随机密码生成 | 长度、字符类型、批量生成 | 3h |
| 进制转换器 | 2/8/10/16 进制互转、浮点数 | 3h |

#### 3.2.3 CSS/设计类 (P0)
| 工具 | 功能点 | 预计时间 |
|-----|--------|---------|
| 颜色转换器 | HEX/RGB/HSL/HSV 互转、取色器 | 6h |
| 渐变生成器 | 线性/径向渐变、多色停止点 | 4h |

#### 3.2.4 生成工具类 (P0)
| 工具 | 功能点 | 预计时间 |
|-----|--------|---------|
| 二维码生成 | 文本/URL 转二维码、尺寸、Logo | 4h |
| 二维码识别 | 上传图片识别、摄像头识别 | 4h |

#### 3.2.5 图片工具类 (P0)
| 工具 | 功能点 | 预计时间 |
|-----|--------|---------|
| 图片压缩 | 智能压缩、批量、预览对比 | 6h |

---

### Phase 3: 工具页面完善 (Week 4)

#### 3.3.1 通用工具组件
- [ ] ToolLayout - 工具页面统一布局
- [ ] InputArea - 输入区域（支持文件上传）
- [ ] OutputArea - 输出区域（复制/下载）
- [ ] ToolCard - 工具卡片
- [ ] CopyButton - 复制按钮（带反馈）

#### 3.3.2 工具注册系统
- [ ] 设计工具配置数据结构
- [ ] 实现工具自动注册
- [ ] 实现工具分类管理

#### 3.3.3 首页开发
- [ ] 热门工具展示
- [ ] 最近使用记录
- [ ] 分类导航
- [ ] 搜索功能

#### 3.3.4 其他页面
- [ ] 收藏页
- [ ] 关于页
- [ ] 404 页面

---

### Phase 4: 功能增强 (Week 5)

#### 3.4.1 P1 级工具实现
| 分类 | 工具 | 预计时间 |
|-----|------|---------|
| 编码加密 | AES 加密解密 | 4h |
| 开发辅助 | 代码对比 | 4h |
| 格式化 | HTML/JS/SQL 格式化 | 6h |
| 数据处理 | CSV/JSON 互转 | 4h |
| 数据处理 | Markdown 表格 | 4h |
| 数据处理 | 文本处理（去重/统计） | 4h |
| 图片工具 | 图片转 Base64 | 2h |
| 网络工具 | IP 查询 | 2h |

#### 3.4.2 用户体验优化
- [ ] 历史记录功能（LocalStorage）
- [ ] 收藏功能
- [ ] 快捷键支持
- [ ] 操作反馈（Toast 提示）
- [ ] 加载状态

---

### Phase 5: 测试与优化 (Week 6)

#### 3.5.1 单元测试
- [ ] 工具函数测试
- [ ] 组件测试
- [ ] 组合式函数测试

#### 3.5.2 性能优化
- [ ] 路由懒加载
- [ ] 组件按需加载
- [ ] 大文件处理优化
- [ ] 构建优化

#### 3.5.3 兼容性测试
- [ ] Chrome/Firefox/Safari/Edge
- [ ] 移动端适配
- [ ] 暗色主题测试

#### 3.5.4 PWA 支持
- [ ] Service Worker
- [ ] Manifest 配置
- [ ] 离线缓存

---

## 4. 工具开发规范

### 4.1 工具模块结构
```typescript
// src/tools/encoder/base64.ts

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export interface Base64Options extends ToolExecuteOptions {
  mode: 'encode' | 'decode'
  urlSafe?: boolean
}

export const base64Tool: ToolDefinition = {
  // 基础信息
  id: 'base64',
  name: 'Base64 编解码',
  description: '文本与 Base64 格式互相转换',
  category: 'encoder',
  icon: 'Binary',
  
  // 功能实现
  execute: (input: string, options: Base64Options): string => {
    if (options.mode === 'encode') {
      return options.urlSafe 
        ? base64UrlSafeEncode(input)
        : base64Encode(input)
    }
    return base64Decode(input)
  },
  
  // 示例数据
  examples: [
    { input: 'Hello World', output: 'SGVsbG8gV29ybGQ=' }
  ]
}

// 辅助函数
function base64Encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)))
}

function base64Decode(input: string): string {
  return decodeURIComponent(escape(atob(input)))
}

function base64UrlSafeEncode(input: string): string {
  return base64Encode(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
```

### 4.2 工具类型定义
```typescript
// src/tools/types.ts

export interface ToolDefinition {
  // 唯一标识
  id: string
  
  // 显示信息
  name: string
  description: string
  category: ToolCategory
  icon: string
  tags?: string[]
  
  // 功能实现
  execute: (input: string, options?: ToolExecuteOptions) => string | Promise<string>
  
  // 配置
  options?: ToolOption[]
  
  // 示例
  examples?: ToolExample[]
  
  // 元数据
  priority?: number
  deprecated?: boolean
}

export type ToolCategory = 
  | 'encoder'      // 编码加密
  | 'developer'    // 开发辅助
  | 'converter'    // 转换工具
  | 'generator'    // 生成工具
  | 'formatter'    // 格式化
  | 'css'          // CSS 工具
  | 'image'        // 图片工具
  | 'text'         // 文本工具
  | 'data'         // 数据处理
  | 'network'      // 网络工具
  | 'calculator'   // 计算换算

export interface ToolExecuteOptions {
  [key: string]: any
}

export interface ToolOption {
  name: string
  type: 'select' | 'checkbox' | 'number' | 'text'
  label: string
  defaultValue: any
  options?: { label: string; value: any }[]
}

export interface ToolExample {
  input: string
  output: string
  description?: string
}
```

### 4.3 工具组件规范
```vue
<!-- src/components/tools/encoder/Base64Tool.vue -->
<template>
  <ToolLayout :tool="tool">
    <template #options>
      <el-radio-group v-model="mode">
        <el-radio-button label="encode">编码</el-radio-button>
        <el-radio-button label="decode">解码</el-radio-button>
      </el-radio-group>
      <el-checkbox v-model="urlSafe">URL 安全</el-checkbox>
    </template>
    
    <template #default>
      <InputArea 
        v-model="input" 
        placeholder="输入要处理的文本..."
        :examples="examples"
      />
      <OutputArea 
        :value="output" 
        :loading="loading"
        @copy="handleCopy"
      />
    </template>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useClipboard } from '@/composables/useClipboard'
import { base64Tool } from '@/tools/encoder/base64'
import ToolLayout from '@/components/common/ToolLayout.vue'
import InputArea from '@/components/common/InputArea.vue'
import OutputArea from '@/components/common/OutputArea.vue'

const tool = base64Tool
const { copy } = useClipboard()

// 状态
const input = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const urlSafe = ref(false)
const loading = ref(false)

// 计算输出
const output = computed(() => {
  if (!input.value) return ''
  try {
    return base64Tool.execute(input.value, {
      mode: mode.value,
      urlSafe: urlSafe.value
    })
  } catch (e) {
    return `错误: ${(e as Error).message}`
  }
})

// 示例
const examples = [
  { label: 'Hello World', value: 'Hello World' },
  { label: '中文测试', value: '中文测试' }
]

// 复制处理
const handleCopy = async () => {
  await copy(output.value)
}
</script>
```

---

## 5. 开发规范

### 5.1 代码规范
- 使用 Composition API + `<script setup>`
- 组件名使用 PascalCase
- 组合式函数使用 camelCase，前缀 `use`
- 工具函数使用 camelCase
- 类型定义使用 PascalCase

### 5.2 文件命名
- 组件: `PascalCase.vue`
- 组合式函数: `useFunctionName.ts`
- 工具模块: `camelCase.ts`
- 类型定义: `PascalCase.ts` 或 `types.ts`

### 5.3 注释规范
```typescript
/**
 * Base64 编码
 * @param input - 要编码的字符串
 * @param urlSafe - 是否使用 URL 安全字符
 * @returns 编码后的 Base64 字符串
 * @throws {Error} 当输入包含无效字符时抛出
 */
function base64Encode(input: string, urlSafe?: boolean): string {
  // 实现...
}
```

### 5.4 提交规范
```
feat: 新增 Base64 编解码工具
fix: 修复 JSON 格式化空值报错
refactor: 重构颜色转换器逻辑
docs: 更新开发计划文档
style: 调整工具卡片样式
test: 添加加密函数单元测试
chore: 更新依赖版本
```

---

## 6. 部署计划

### 6.1 构建配置
```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // 根据部署环境调整
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'crypto': ['crypto-js'],
          'qrcode': ['qrcode', 'jsqr']
        }
      }
    }
  }
})
```

### 6.2 部署平台
| 平台 | 配置 | 域名 |
|-----|------|------|
| Vercel | 自动部署 | toolkit.vercel.app |
| Netlify | 自动部署 | toolkit.netlify.app |
| GitHub Pages | GitHub Actions | username.github.io/toolkit |

---

## 7. 里程碑检查点

### Week 1 检查点
- [ ] 项目能正常启动
- [ ] 基础布局组件完成
- [ ] 主题切换功能正常

### Week 3 检查点
- [ ] 15 个 P0 工具全部可用
- [ ] 工具页面布局统一
- [ ] 复制功能正常

### Week 4 检查点
- [ ] 首页功能完整
- [ ] 搜索功能可用
- [ ] 收藏功能可用

### Week 6 检查点
- [ ] 所有 P1 工具完成
- [ ] 单元测试覆盖核心功能
- [ ] PWA 功能可用
- [ ] 生产环境部署成功

---

**文档版本**: v1.0  
**创建日期**: 2026-04-10  
**最后更新**: 2026-04-10
