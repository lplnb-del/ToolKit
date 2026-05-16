/**
 * 文本处理工具
 * 支持大小写转换、去除空白、文本统计等功能
 */

import type { ToolDefinition } from '../types'

/**
 * 转换为大写
 */
function toUpperCase(text: string): string {
  return text.toUpperCase()
}

/**
 * 转换为小写
 */
function toLowerCase(text: string): string {
  return text.toLowerCase()
}

/**
 * 转换为驼峰命名
 */
function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

/**
 * 转换为帕斯卡命名
 */
function toPascalCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/\s+/g, '')
}

/**
 * 转换为下划线命名
 */
function toSnakeCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * 转换为短横线命名
 */
function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * 去除多余空白
 */
function removeExtraWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * 去除所有空白
 */
function removeAllWhitespace(text: string): string {
  return text.replace(/\s+/g, '')
}

/**
 * 去除空行
 */
function removeEmptyLines(text: string): string {
  return text.split('\n').filter(line => line.trim()).join('\n')
}

/**
 * 文本反转
 */
function reverseText(text: string): string {
  return text.split('').reverse().join('')
}

/**
 * 统计文本信息
 */
function analyzeText(text: string): string {
  const lines = text.split('\n').length
  const characters = text.length
  const charactersNoSpace = text.replace(/\s/g, '').length
  const words = text.trim().split(/\s+/).filter(w => w).length
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = (text.match(/[a-zA-Z]/g) || []).length
  const numbers = (text.match(/\d/g) || []).length

  return `📊 文本统计结果：

基本信息：
• 总行数: ${lines}
• 总字符数: ${characters}
• 非空字符数: ${charactersNoSpace}
• 单词数: ${words}

字符分布：
• 中文字符: ${chinese} (${(chinese / characters * 100).toFixed(1)}%)
• 英文字符: ${english} (${(english / characters * 100).toFixed(1)}%)
• 数字字符: ${numbers} (${(numbers / characters * 100).toFixed(1)}%)
• 其他字符: ${characters - chinese - english - numbers} (${((characters - chinese - english - numbers) / characters * 100).toFixed(1)}%)`
}

/**
 * 文本处理工具定义
 */
export const textProcessorTool: ToolDefinition = {
  id: 'text-processor',
  name: '文本处理',
  description: '大小写转换、命名格式转换、空白处理、文本统计',
  category: 'data',
  icon: 'Document',
  priority: 76,

  options: [
    {
      name: 'operation',
      type: 'select',
      label: '操作类型',
      defaultValue: 'upper',
      options: [
        { label: '转大写', value: 'upper' },
        { label: '转小写', value: 'lower' },
        { label: '驼峰命名 (camelCase)', value: 'camel' },
        { label: '帕斯卡命名 (PascalCase)', value: 'pascal' },
        { label: '下划线命名 (snake_case)', value: 'snake' },
        { label: '短横线命名 (kebab-case)', value: 'kebab' },
        { label: '去除多余空白', value: 'trim' },
        { label: '去除所有空白', value: 'trimAll' },
        { label: '去除空行', value: 'removeEmpty' },
        { label: '文本反转', value: 'reverse' },
        { label: '文本统计', value: 'analyze' }
      ]
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(input: string, options?: Record<string, any>): string {
    if (!input.trim()) {
      return ''
    }

    const operation = options?.operation || 'upper'

    try {
      switch (operation) {
        case 'upper':
          return toUpperCase(input)
        case 'lower':
          return toLowerCase(input)
        case 'camel':
          return toCamelCase(input)
        case 'pascal':
          return toPascalCase(input)
        case 'snake':
          return toSnakeCase(input)
        case 'kebab':
          return toKebabCase(input)
        case 'trim':
          return removeExtraWhitespace(input)
        case 'trimAll':
          return removeAllWhitespace(input)
        case 'removeEmpty':
          return removeEmptyLines(input)
        case 'reverse':
          return reverseText(input)
        case 'analyze':
          return analyzeText(input)
        default:
          return input
      }
    } catch (error) {
      return `错误: ${(error as Error).message}`
    }
  },

  examples: [
    {
      input: 'Hello World',
      output: 'HELLO WORLD',
      description: '转大写示例'
    },
    {
      input: 'hello world',
      output: 'helloWorld',
      description: '驼峰命名示例'
    }
  ]
}
