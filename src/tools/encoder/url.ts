/**
 * URL 编解码工具
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export interface UrlOptions {
  mode: 'encode' | 'decode'
  component?: boolean
}

/**
 * URL 编码
 */
function urlEncode(input: string, component: boolean = false): string {
  if (component) {
    return encodeURIComponent(input)
  }
  return encodeURI(input)
}

/**
 * URL 解码
 */
function urlDecode(input: string, component: boolean = false): string {
  try {
    if (component) {
      return decodeURIComponent(input)
    }
    return decodeURI(input)
  } catch {
    throw new Error('解码失败：无效的 URL 编码字符串')
  }
}

export const urlTool: ToolDefinition = {
  id: 'url',
  name: 'URL 编解码',
  description: 'URL 编码与解码，支持完整 URL 或组件模式',
  category: 'encoder',
  icon: 'Link',
  priority: 95,
  
  execute(input: string, options?: ToolExecuteOptions): string {
    const urlOptions = options as UrlOptions
    if (!input.trim()) {
      return ''
    }

    if (urlOptions.mode === 'encode') {
      return urlEncode(input, urlOptions.component)
    } else {
      return urlDecode(input, urlOptions.component)
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
      name: 'component',
      type: 'checkbox',
      label: '组件模式（编码更多特殊字符）',
      defaultValue: false
    }
  ],
  
  examples: [
    {
      input: 'https://example.com/search?q=hello world',
      output: 'https://example.com/search?q=hello%20world',
      description: 'URL 编码'
    },
    {
      input: 'name=value&test=hello world',
      output: 'name%3Dvalue%26test%3Dhello%20world',
      description: '组件模式编码'
    },
    {
      input: '你好世界',
      output: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C',
      description: '中文编码'
    }
  ]
}
