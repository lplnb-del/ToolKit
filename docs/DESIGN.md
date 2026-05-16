# ToolKit - 设计规范文档

## 1. 设计原则

### 1.1 设计理念
- **简洁高效**：界面清爽，功能直达
- **一致性**：统一的视觉语言和交互模式
- **可访问性**：支持键盘操作和屏幕阅读器
- **响应式**：适配桌面端和移动端

### 1.2 设计目标
- 减少认知负担，让用户专注于工具使用
- 提供清晰的视觉层级和反馈
- 支持亮色/暗色主题切换

---

## 2. 色彩系统

### 2.1 主色调
```css
/* 品牌色 */
--color-primary: #3b82f6;        /* 蓝色 - 主品牌色 */
--color-primary-light: #60a5fa;  /* 浅蓝 - 悬停状态 */
--color-primary-dark: #2563eb;   /* 深蓝 - 激活状态 */

/* 功能色 */
--color-success: #22c55e;        /* 绿色 - 成功 */
--color-warning: #f59e0b;        /* 橙色 - 警告 */
--color-error: #ef4444;          /* 红色 - 错误 */
--color-info: #3b82f6;           /* 蓝色 - 信息 */
```

### 2.2 中性色（亮色主题）
```css
/* 背景色 */
--bg-primary: #ffffff;           /* 主背景 */
--bg-secondary: #f8fafc;         /* 次级背景 */
--bg-tertiary: #f1f5f9;          /* 第三层背景 */
--bg-hover: #e2e8f0;             /* 悬停背景 */

/* 文字色 */
--text-primary: #0f172a;         /* 主文字 */
--text-secondary: #475569;       /* 次级文字 */
--text-tertiary: #94a3b8;        /* 辅助文字 */
--text-inverse: #ffffff;         /* 反色文字 */

/* 边框色 */
--border-primary: #e2e8f0;       /* 主边框 */
--border-secondary: #cbd5e1;     /* 次级边框 */
```

### 2.3 中性色（暗色主题）
```css
/* 背景色 */
--bg-primary: #0f172a;           /* 主背景 */
--bg-secondary: #1e293b;         /* 次级背景 */
--bg-tertiary: #334155;          /* 第三层背景 */
--bg-hover: #475569;             /* 悬停背景 */

/* 文字色 */
--text-primary: #f8fafc;         /* 主文字 */
--text-secondary: #cbd5e1;       /* 次级文字 */
--text-tertiary: #64748b;        /* 辅助文字 */
--text-inverse: #0f172a;         /* 反色文字 */

/* 边框色 */
--border-primary: #334155;       /* 主边框 */
--border-secondary: #475569;     /* 次级边框 */
```

### 2.4 分类颜色
```css
/* 工具分类色 */
--cat-encoder: #3b82f6;          /* 编码加密 - 蓝 */
--cat-developer: #8b5cf6;        /* 开发辅助 - 紫 */
--cat-css: #06b6d4;              /* CSS设计 - 青 */
--cat-generator: #10b981;        /* 生成工具 - 绿 */
--cat-formatter: #f59e0b;        /* 格式化 - 橙 */
--cat-data: #ec4899;             /* 数据处理 - 粉 */
--cat-image: #f97316;            /* 图片工具 - 橙红 */
--cat-network: #6366f1;          /* 网络工具 - 靛蓝 */
--cat-calculator: #14b8a6;       /* 计算换算 -  teal */
```

---

## 3. 字体系统

### 3.1 字体栈
```css
/* 中文 */
--font-cn: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;

/* 代码 */
--font-mono: "JetBrains Mono", "Fira Code", "SF Mono", Consolas, Monaco, monospace;
```

### 3.2 字号规范
| 级别 | 大小 | 行高 | 字重 | 用途 |
|-----|------|------|-----|------|
| H1 | 32px | 40px | 700 | 页面标题 |
| H2 | 24px | 32px | 600 | 区块标题 |
| H3 | 20px | 28px | 600 | 卡片标题 |
| H4 | 16px | 24px | 600 | 小标题 |
| Body | 14px | 22px | 400 | 正文 |
| Small | 12px | 18px | 400 | 辅助文字 |
| Code | 13px | 20px | 400 | 代码 |

---

## 4. 间距系统

### 4.1 基础间距
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### 4.2 布局间距
- **页面内边距**: 24px (桌面) / 16px (移动)
- **卡片间距**: 16px
- **组件间距**: 12px
- **元素间距**: 8px

---

## 5. 圆角系统

```css
--radius-sm: 4px;     /* 小元素：标签、徽章 */
--radius-md: 8px;     /* 默认：按钮、输入框 */
--radius-lg: 12px;    /* 卡片、弹窗 */
--radius-xl: 16px;    /* 大卡片、模态框 */
--radius-full: 9999px; /* 圆形、胶囊 */
```

---

## 6. 阴影系统

### 6.1 亮色主题阴影
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

### 6.2 暗色主题阴影
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
```

---

## 7. 组件规范

### 7.1 按钮 (Button)

#### 类型
| 类型 | 背景 | 文字 | 用途 |
|-----|------|-----|------|
| Primary | --color-primary | white | 主要操作 |
| Secondary | --bg-tertiary | --text-primary | 次要操作 |
| Ghost | transparent | --color-primary | 幽灵按钮 |
| Danger | --color-error | white | 危险操作 |

#### 尺寸
| 尺寸 | 高度 | 内边距 | 字号 |
|-----|------|--------|-----|
| Small | 28px | 8px 12px | 12px |
| Medium | 36px | 10px 16px | 14px |
| Large | 44px | 12px 24px | 16px |

### 7.2 输入框 (Input)

```css
/* 基础样式 */
height: 40px;
padding: 0 12px;
border: 1px solid var(--border-primary);
border-radius: var(--radius-md);
background: var(--bg-primary);
color: var(--text-primary);

/* 状态 */
&:hover { border-color: var(--border-secondary); }
&:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
&:disabled { background: var(--bg-secondary); opacity: 0.6; }
```

### 7.3 卡片 (Card)

```css
/* 基础卡片 */
padding: 20px;
border-radius: var(--radius-lg);
background: var(--bg-primary);
border: 1px solid var(--border-primary);

/* 可悬停卡片 */
&:hover {
  border-color: var(--border-secondary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
```

### 7.4 工具卡片 (Tool Card)

```
┌─────────────────────────────┐
│  [Icon]  工具名称            │
│                             │
│  工具描述文字...             │
│                             │
│  [分类标签]          [收藏⭐] │
└─────────────────────────────┘
```

- 尺寸: 固定高度 120px
- 图标: 40x40px，分类色背景
- 悬停: 上浮 + 阴影增强

### 7.5 文本域 (Textarea)

```css
min-height: 200px;
padding: 12px;
border: 1px solid var(--border-primary);
border-radius: var(--radius-md);
background: var(--bg-primary);
font-family: var(--font-mono);
font-size: 14px;
line-height: 1.6;
resize: vertical;
```

---

## 8. 布局规范

### 8.1 整体布局

```
┌─────────────────────────────────────────────────────┐
│ Header (64px)                                       │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Main Content                            │
│ (240px)  │  (calc(100% - 240px))                    │
│          │                                          │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│ Footer (48px)                                       │
└─────────────────────────────────────────────────────┘
```

### 8.2 响应式断点
| 断点 | 宽度 | 布局变化 |
|-----|------|---------|
| Mobile | < 768px | 侧边栏隐藏，底部导航 |
| Tablet | 768px - 1024px | 侧边栏折叠 |
| Desktop | > 1024px | 完整布局 |

### 8.3 工具页面布局

```
┌─────────────────────────────────────────────────────┐
│ 面包屑: 首页 > 编码加密 > Base64 编解码              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │   输入区域        │  │   输出区域        │        │
│  │                  │  │                  │        │
│  │   [文本域]        │  │   [文本域]        │        │
│  │                  │  │                  │        │
│  │   [操作按钮]      │→ │   [复制/下载]     │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  历史记录 / 使用说明                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 9. 图标系统

### 9.1 图标库
使用 **Lucide Vue** 图标库，风格统一、支持 Tree Shaking。

### 9.2 图标尺寸
| 尺寸 | 用途 |
|-----|------|
| 16px | 按钮内、行内 |
| 20px | 导航项、列表项 |
| 24px | 工具卡片图标 |
| 32px | 空状态、提示 |
| 40px | 分类图标（带背景） |

### 9.3 分类图标映射
| 分类 | 图标 |
|-----|------|
| 编码加密 | Lock / Unlock |
| 开发辅助 | Code / Terminal |
| CSS设计 | Palette / Paintbrush |
| 生成工具 | Sparkles / Wand |
| 格式化 | AlignLeft / Indent |
| 数据处理 | Database / Table |
| 图片工具 | Image / Camera |
| 网络工具 | Globe / Wifi |
| 计算换算 | Calculator / Scale |

---

## 10. 动画规范

### 10.1 过渡时间
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

### 10.2 缓动函数
```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 10.3 常用动画
```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 滑入 */
@keyframes slideIn {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 脉冲（用于提示） */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 旋转（加载中） */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 11. 暗色主题切换

### 11.1 切换方式
- 跟随系统偏好（默认）
- 手动切换（顶部导航栏）
- 保存用户偏好到 LocalStorage

### 11.2 实现方式
```html
<html class="dark">
  <!-- 暗色主题样式 -->
</html>
```

```css
/* 使用 CSS 变量，通过 class 切换 */
html.dark {
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  /* ... */
}
```

---

## 12. 设计检查清单

### 12.1 视觉检查
- [ ] 色彩对比度符合 WCAG AA 标准
- [ ] 文字清晰可读，字号不小于 12px
- [ ] 按钮和可点击区域不小于 44x44px
- [ ] 图标风格统一，尺寸规范

### 12.2 交互检查
- [ ] 所有交互元素有悬停状态
- [ ] 操作有明确的反馈（Toast、动画）
- [ ] 支持键盘导航和操作
- [ ] 加载状态有提示

### 12.3 响应式检查
- [ ] 移动端布局正确
- [ ] 触摸目标足够大
- [ ] 横竖屏切换正常

---

**文档版本**: v1.0  
**创建日期**: 2026-04-10  
**最后更新**: 2026-04-10
