/**
 * URL 解析工具
 * 解析 URL 各部分，提取协议、域名、路径、参数等信息
 */

import type { ToolDefinition } from '../types'

/**
 * 解析 URL
 */
function parseURL(url: string): string {
  if (!url.trim()) {
    return ''
  }

  // 如果没有协议，添加 http://
  let targetUrl = url.trim()
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'http://' + targetUrl
  }

  try {
    const urlObj = new URL(targetUrl)

    // 解析查询参数
    let queryParamsStr = ''
    if (urlObj.search) {
      const params = new URLSearchParams(urlObj.search)
      const paramsObj: Record<string, string> = {}
      params.forEach((value, key) => {
        paramsObj[key] = value
      })
      if (Object.keys(paramsObj).length > 0) {
        queryParamsStr = JSON.stringify(paramsObj, null, 2)
      }
    }

    const result = {
      '完整 URL': urlObj.href,
      '协议': urlObj.protocol.replace(':', ''),
      '认证信息': urlObj.username ? `${urlObj.username}:${urlObj.password ? '***' : ''}` : '(无)',
      '主机名': urlObj.hostname,
      '端口': urlObj.port || '(默认)',
      '路径': urlObj.pathname || '/',
      '查询参数': urlObj.search || '(无)',
      '锚点': urlObj.hash || '(无)',
      '域名': extractDomain(urlObj.hostname),
      '子域名': extractSubdomain(urlObj.hostname),
      '查询参数解析': queryParamsStr
    }

    // 构建结果
    let output = '🔗 URL 解析结果：\n\n'
    for (const [key, value] of Object.entries(result)) {
      if (value && value !== '(无)' && value !== '(默认)' && value !== '') {
        output += `${key}: ${value}\n`
      }
    }

    // 额外信息
    output += '\n📊 额外信息：\n'
    output += `字符总数: ${urlObj.href.length}\n`
    output += `路径层级: ${urlObj.pathname.split('/').filter(Boolean).length}\n`

    return output
  } catch (error) {
    return `❌ 无效的 URL 格式：${(error as Error).message}\n\n请确保 URL 格式正确，例如：\n• https://www.example.com\n• http://localhost:3000\n• www.example.com/path?query=value`
  }
}

/**
 * 提取域名（不含子域名）
 */
function extractDomain(hostname: string): string {
  const parts = hostname.split('.')
  if (parts.length >= 2) {
    return parts.slice(-2).join('.')
  }
  return hostname
}

/**
 * 提取子域名
 */
function extractSubdomain(hostname: string): string {
  const domain = extractDomain(hostname)
  if (hostname === domain) {
    return '(无)'
  }
  return hostname.replace(`.${domain}`, '')
}

/**
 * URL 解析工具定义
 */
export const urlParserTool: ToolDefinition = {
  id: 'url-parser',
  name: 'URL 解析',
  description: '解析 URL 各部分，提取协议、域名、路径、参数等信息',
  category: 'network',
  icon: 'Connection',
  priority: 80,
  outputType: 'text',

  options: [
    {
      name: 'autoAddProtocol',
      type: 'select',
      label: '自动添加协议',
      defaultValue: 'true',
      options: [
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ]
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(input: string, _options?: Record<string, any>): string {
    if (!input.trim()) {
      return ''
    }
    return parseURL(input)
  },

  examples: [
    {
      input: 'https://www.example.com/path?query=value&page=1#section',
      output: '🔗 URL 解析结果...',
      description: 'URL 解析示例'
    }
  ]
}
