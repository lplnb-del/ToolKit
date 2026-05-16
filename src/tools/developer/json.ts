/**
 * JSON 格式化工具
 * 支持美化、压缩、转义、反转义、错误纠正
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export interface JsonOptions {
  operation: 'format' | 'compress' | 'escape' | 'unescape' | 'fix'
  indent?: number
}

/**
 * 格式化 JSON
 */
function formatJson(input: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, indent)
  } catch (e) {
    throw new Error(`JSON 格式错误: ${(e as Error).message}`)
  }
}

/**
 * 压缩 JSON
 */
function compressJson(input: string): string {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed)
  } catch (e) {
    throw new Error(`JSON 格式错误: ${(e as Error).message}`)
  }
}

/**
 * 转义 JSON 字符串
 */
function escapeJson(input: string): string {
  return JSON.stringify(input).slice(1, -1)
}

/**
 * 反转义 JSON 字符串
 */
function unescapeJson(input: string): string {
  try {
    return JSON.parse(`"${input}"`)
  } catch {
    throw new Error('反转义失败：无效的转义字符串')
  }
}

/**
 * 尝试修复常见的 JSON 格式错误
 */
function fixJson(input: string): string {
  let fixed = input.trim()

  // 1. 修复单引号为双引号
  fixed = fixed.replace(/'/g, '"')

  // 2. 修复没有引号的键名（简单匹配）
  // 匹配 {name: 或 ,name: 或 [name: 这样的情况
  fixed = fixed.replace(/([{,[]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

  // 3. 修复尾随逗号
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

  // 4. 修复多余的逗号
  fixed = fixed.replace(/,\s*,/g, ',')

  // 5. 修复未定义的值为 null
  fixed = fixed.replace(/:\s*undefined\s*([,}\]])/g, ':null$1')

  // 6. 修复 NaN 和 Infinity
  fixed = fixed.replace(/:\s*NaN\s*([,}\]])/g, ':null$1')
  fixed = fixed.replace(/:\s*Infinity\s*([,}\]])/g, ':null$1')
  fixed = fixed.replace(/:\s*-Infinity\s*([,}\]])/g, ':null$1')

  // 7. 尝试解析验证
  try {
    JSON.parse(fixed)
    return fixed
  } catch (e) {
    // 如果还是失败，返回原始错误
    throw new Error(`无法自动修复: ${(e as Error).message}\n\n尝试修复后的内容:\n${fixed}`)
  }
}

/**
 * 验证 JSON
 */
function validateJson(input: string): { valid: boolean; error?: string; fixed?: string } {
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (e) {
    // 尝试修复
    try {
      const fixed = fixJson(input)
      return { valid: false, error: (e as Error).message, fixed }
    } catch {
      return { valid: false, error: (e as Error).message }
    }
  }
}

export const jsonTool: ToolDefinition = {
  id: 'json',
  name: 'JSON 格式化',
  description: 'JSON 美化、压缩、验证、转义、错误纠正',
  category: 'developer',
  icon: 'Document',
  priority: 100,

  execute(input: string, options?: ToolExecuteOptions): string {
    const jsonOptions = options as JsonOptions
    if (!input.trim()) {
      return ''
    }

    switch (jsonOptions.operation) {
      case 'format':
        return formatJson(input, jsonOptions.indent)
      case 'compress':
        return compressJson(input)
      case 'escape':
        return escapeJson(input)
      case 'unescape':
        return unescapeJson(input)
      case 'fix':
        return fixJson(input)
      default:
        return formatJson(input, jsonOptions.indent)
    }
  },

  options: [
    {
      name: 'operation',
      type: 'select',
      label: '操作',
      defaultValue: 'format',
      options: [
        { label: '格式化（美化）', value: 'format' },
        { label: '压缩', value: 'compress' },
        { label: '转义', value: 'escape' },
        { label: '反转义', value: 'unescape' },
        { label: '错误纠正', value: 'fix' }
      ]
    },
    {
      name: 'indent',
      type: 'select',
      label: '缩进',
      defaultValue: 2,
      options: [
        { label: '2 空格', value: 2 },
        { label: '4 空格', value: 4 },
        { label: 'Tab', value: '\t' }
      ]
    }
  ],

  examples: [
    {
      input: '{"name":"test","value":123}',
      output: '{\n  "name": "test",\n  "value": 123\n}',
      description: '格式化 JSON'
    },
    {
      input: '{name:"test",value:123,}',
      output: '{"name":"test","value":123}',
      description: '纠正错误格式（单引号、无引号键、尾随逗号）'
    }
  ]
}

// 导出验证函数供组件使用
export { validateJson, fixJson }
