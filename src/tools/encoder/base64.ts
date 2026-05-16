/**
 * Base64 编解码工具
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export interface Base64Options {
  mode: 'encode' | 'decode'
  urlSafe?: boolean
}

/**
 * Base64 编码（支持中文）
 */
function base64Encode(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)))
  } catch {
    throw new Error('编码失败：输入包含无效字符')
  }
}

/**
 * Base64 解码（支持中文）
 */
function base64Decode(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input)))
  } catch {
    throw new Error('解码失败：无效的 Base64 字符串')
  }
}

/**
 * URL 安全 Base64 编码
 */
function base64UrlSafeEncode(input: string): string {
  return base64Encode(input)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * URL 安全 Base64 解码
 */
function base64UrlSafeDecode(input: string): string {
  // 还原 URL 安全字符
  let normalized = input
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  // 补充填充字符
  const padding = 4 - (normalized.length % 4)
  if (padding !== 4) {
    normalized += '='.repeat(padding)
  }
  
  return base64Decode(normalized)
}

export const base64Tool: ToolDefinition = {
  id: 'base64',
  name: 'Base64 编解码',
  description: '文本与 Base64 格式互相转换，支持 URL 安全模式',
  category: 'encoder',
  icon: 'Lock',
  priority: 100,
  
  execute(input: string, options?: ToolExecuteOptions): string {
    const base64Options = options as Base64Options
    if (!input.trim()) {
      return ''
    }

    if (base64Options.mode === 'encode') {
      return base64Options.urlSafe
        ? base64UrlSafeEncode(input)
        : base64Encode(input)
    } else {
      return base64Options.urlSafe
        ? base64UrlSafeDecode(input)
        : base64Decode(input)
    }
  },
  
  options: [
    {
      name: 'mode',
      type: 'radio',
      label: '模式',
      defaultValue: 'encode',
      options: [
        { label: '编码', value: 'encode' },
        { label: '解码', value: 'decode' }
      ]
    },
    {
      name: 'urlSafe',
      type: 'checkbox',
      label: 'URL 安全（使用 - 和 _ 替换 + 和 /）',
      defaultValue: false
    }
  ],
  
  examples: [
    {
      input: 'Hello World',
      output: 'SGVsbG8gV29ybGQ=',
      description: '英文编码'
    },
    {
      input: '你好，世界！',
      output: '5L2g5aW95ZWK44CC',
      description: '中文编码'
    },
    {
      input: '{"name":"test","value":123}',
      output: 'eyJuYW1lIjoidGVzdCIsInZhbHVlIjoxMjN9',
      description: 'JSON 编码'
    }
  ]
}
