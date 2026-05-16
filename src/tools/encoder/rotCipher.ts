/**
 * ROT13/ROT47 编解码工具
 * 简单的字符替换加密算法
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

function rot13(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0)
    // 大写字母 A-Z
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + 13) % 26) + 65)
    }
    // 小写字母 a-z
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + 13) % 26) + 97)
    }
    return char
  }).join('')
}

function rot47(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0)
    // ASCII 可打印字符范围 33-126
    if (code >= 33 && code <= 126) {
      return String.fromCharCode(((code - 33 + 47) % 94) + 33)
    }
    return char
  }).join('')
}

export const rotTool: ToolDefinition = {
  id: 'rot-cipher',
  name: 'ROT13/ROT47 加密',
  description: 'ROT13 和 ROT47 简单替换加密解密',
  category: 'encoder',
  icon: 'Lock',
  tags: ['ROT13', 'ROT47', '凯撒', '加密'],
  priority: 1,
  options: [
    {
      name: 'algorithm',
      label: '算法类型',
      type: 'select',
      defaultValue: 'rot13',
      options: [
        { label: 'ROT13 (仅字母)', value: 'rot13' },
        { label: 'ROT47 (可打印字符)', value: 'rot47' }
      ]
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      if (!input.trim()) {
        return '错误: 请输入要处理的内容'
      }

      const algorithm = options?.algorithm || 'rot13'
      const result = algorithm === 'rot13' ? rot13(input) : rot47(input)

      return result
    } catch (error) {
      return `错误: 处理失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: 'Hello World',
      output: 'Uryyb Jbeyq',
      description: 'ROT13 加密 (再次执行可解密)'
    },
    {
      input: 'Uryyb Jbeyq',
      output: 'Hello World',
      description: 'ROT13 解密示例'
    }
  ]
}
