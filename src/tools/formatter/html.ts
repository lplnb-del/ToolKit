/**
 * HTML 格式化工具
 * 支持 HTML 美化、压缩、转义等功能
 */

import type { ToolDefinition } from '../types'

/**
 * 美化 HTML
 */
function beautifyHTML(html: string, indentSize: number = 2): string {
  let formatted = ''
  let indent = 0
  const indentStr = ' '.repeat(indentSize)

  // 移除多余的空白字符
  html = html.replace(/>\s+</g, '><').trim()

  // 处理标签
  const tokens = html.split(/(<[^>]+>)/g).filter(token => token.trim())

  for (const token of tokens) {
    if (token.match(/^<\/\w/)) {
      // 结束标签，减少缩进
      indent = Math.max(0, indent - 1)
      formatted += indentStr.repeat(indent) + token + '\n'
    } else if (token.match(/^<\w[^>]*[^/]>$/)) {
      // 开始标签，增加缩进
      formatted += indentStr.repeat(indent) + token + '\n'
      indent++
    } else if (token.match(/^<\w[^>]*\/>$/)) {
      // 自闭合标签，不增加缩进
      formatted += indentStr.repeat(indent) + token + '\n'
    } else if (token.match(/^<\w/)) {
      // 开始标签（可能有属性）
      formatted += indentStr.repeat(indent) + token + '\n'
      if (!token.match(/\/>$/)) {
        indent++
      }
    } else {
      // 文本内容
      const trimmed = token.trim()
      if (trimmed) {
        formatted += indentStr.repeat(indent) + trimmed + '\n'
      }
    }
  }

  return formatted.trim()
}

/**
 * 压缩 HTML
 */
function minifyHTML(html: string): string {
  return html
    .replace(/\s+/g, ' ') // 合并多个空白
    .replace(/>\s+</g, '><') // 移除标签间空白
    .replace(/\s+>/g, '>') // 移除标签前空白
    .replace(/>\s+/g, '>') // 移除标签后空白
    .replace(/<!--[\s\S]*?-->/g, '') // 移除注释
    .trim()
}

/**
 * HTML 实体编码
 */
function escapeHTML(html: string): string {
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return html.replace(/[&<>"']/g, char => entityMap[char] || char)
}

/**
 * HTML 实体解码
 */
function unescapeHTML(html: string): string {
  const entityMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#60;': '<',
    '&#62;': '>',
    '&#47;': '/'
  }
  return html.replace(/&(?:amp|lt|gt|quot|#(?:39|x27|x2F|60|62|47));/g, entity => entityMap[entity] || entity)
}

/**
 * HTML 格式化工具定义
 */
export const htmlFormatterTool: ToolDefinition = {
  id: 'html-formatter',
  name: 'HTML 格式化',
  description: 'HTML 美化、压缩、转义等格式化工具',
  category: 'formatter',
  icon: 'Document',
  priority: 80,

  options: [
    {
      name: 'operation',
      type: 'select',
      label: '操作类型',
      defaultValue: 'beautify',
      options: [
        { label: '美化', value: 'beautify' },
        { label: '压缩', value: 'minify' },
        { label: 'HTML 转义', value: 'escape' },
        { label: 'HTML 反转义', value: 'unescape' }
      ]
    },
    {
      name: 'indentSize',
      type: 'number',
      label: '缩进空格数',
      defaultValue: 2,
      min: 1,
      max: 8
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(input: string, options?: Record<string, any>): string {
    if (!input.trim()) {
      return ''
    }

    const operation = options?.operation || 'beautify'

    try {
      switch (operation) {
        case 'beautify': {
          const indentSize = options?.indentSize || 2
          return beautifyHTML(input, indentSize)
        }
        case 'minify':
          return minifyHTML(input)
        case 'escape':
          return escapeHTML(input)
        case 'unescape':
          return unescapeHTML(input)
        default:
          return input
      }
    } catch (error) {
      return `错误: ${(error as Error).message}`
    }
  },

  examples: [
    {
      input: '<div><p>Hello</p></div>',
      output: '<div>\n  <p>Hello</p>\n</div>',
      description: 'HTML 美化示例'
    },
    {
      input: '<div>\n  <p>Hello</p>\n</div>',
      output: '<div><p>Hello</p></div>',
      description: 'HTML 压缩示例'
    }
  ]
}
