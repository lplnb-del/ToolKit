# ToolKit - 在线工具箱

[English](./README.md) | 简体中文

一款纯静态的在线工具集合网站，专为开发者和日常办公人员设计。所有工具均在浏览器端运行，无需后端服务器，确保您的数据隐私安全。

## ✨ 特性

- 🔒 **隐私安全** - 所有数据处理在本地完成，不上传服务器
- ⚡ **即用即走** - 无需注册登录，打开即可使用
- 🌈 **美观界面** - 采用 Vue 3 + Element Plus 构建现代化 UI
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌓 **暗色模式** - 支持亮色/暗色主题自动切换
- 🔍 **工具搜索** - 支持按名称、描述和标签搜索
- ⭐ **收藏功能** - 支持收藏常用工具
- 📜 **历史记录** - 自动保存操作历史

## 🛠️ 工具分类

目前包含 **35+ 款工具**，涵盖以下分类：

### 🔐 编码加密
- Base64 编解码
- URL 编解码
- 哈希计算（MD5、SHA1、SHA256、SHA512）
- AES 加密/解密
- 摩斯密码
- Base32/Base58 编码
- ROT13/ROT47 加密

### 💻 开发辅助
- JSON 格式化/压缩
- 时间戳转换
- UUID 生成
- 随机密码生成
- 进制转换器
- 正则表达式测试
- Cron 表达式解析

### 🎨 CSS 设计
- 颜色格式转换（HEX、RGB、HSL、HSB）
- CSS 渐变生成器
- 取色器
- 阴影生成器
- 圆角生成器

### ✨ 生成工具
- 二维码生成（支持文本、URL、WiFi、邮箱、名片等）
- Lorem Ipsum 文本生成

### 🖼️ 图片工具
- 图片压缩
- 二维码识别
- 图片转 Base64

### 📝 格式化
- HTML 格式化/压缩
- 代码格式化

### 📊 数据处理
- CSV/JSON 互转
- 文本处理（大小写、排序、去重、行号）
- 数据校验（邮箱、手机号、身份证、IP、URL 等）

### 🌐 网络工具
- URL 解析
- HTTP 状态码查询

### 🔢 计算换算
- 时区转换
- 单位换算（长度、重量、温度、面积、速度、时间）
- 日期计算

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0
- pnpm >= 8.0.0（推荐）或 npm >= 10.0.0

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

访问 http://localhost:5173 即可看到项目。

### 构建生产版本

```bash
# 构建项目
pnpm build

# 预览生产版本
pnpm preview
```

### 代码检查

```bash
# 运行所有检查
pnpm lint

# 运行 TypeScript 类型检查
pnpm type-check

# 格式化代码
pnpm format
```

## 📁 项目结构

```
toolkit/
├── src/
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   │   └── common/       # 通用组件
│   ├── composables/      # 组合式函数
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── tools/           # 工具定义
│   └── views/           # 页面视图
├── public/              # 公共资源
├── docs/                # 项目文档
├── index.html
├── vite.config.ts       # Vite 配置
├── uno.config.ts        # UnoCSS 配置
├── package.json
└── tsconfig.json        # TypeScript 配置
```

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型支持
- **Vite** - 新一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue.js 的状态管理库
- **Element Plus** - 基于 Vue 3 的组件库
- **UnoCSS** - 原子化 CSS 引擎
- **VueUse** - Vue 组合式工具集

## 📝 添加新工具

### 1. 创建工具文件

在 `src/tools/<category>/` 目录下创建新的工具文件，例如 `src/tools/encoder/myTool.ts`：

```typescript
import type { ToolDefinition } from '../types'

export const myToolTool: ToolDefinition = {
  id: 'my-tool',
  name: '我的工具',
  description: '工具描述',
  category: 'encoder',
  icon: 'Tools',
  tags: ['标签1', '标签2'],
  priority: 10,
  options: [
    {
      name: 'optionName',
      label: '选项名称',
      type: 'select',
      defaultValue: 'value1',
      options: [
        { label: '选项1', value: 'value1' },
        { label: '选项2', value: 'value2' }
      ]
    }
  ],
  execute: (input: string, options) => {
    // 工具逻辑
    return `处理结果: ${input}`
  },
  examples: [
    {
      input: '示例输入',
      output: '示例输出',
      description: '示例说明',
      options: { optionName: 'value1' }
    }
  ]
}
```

### 2. 注册工具

在对应分类的 `index.ts` 中导出：

```typescript
export { myToolTool } from './myTool'
```

然后在 `src/tools/index.ts` 中导入并注册：

```typescript
import { myToolTool } from './encoder'

// 在 initTools() 函数中注册
registerTool(myToolTool)
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [UnoCSS](https://unocss.dev/) - 原子化 CSS 引擎
