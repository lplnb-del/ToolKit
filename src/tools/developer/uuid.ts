/**
 * UUID 生成工具
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export interface UuidOptions {
  version: 'v4' | 'v7'
  uppercase?: boolean
  count?: number
  format?: 'standard' | 'compact' | 'braces'
}

/**
 * 生成 UUID v4
 */
function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 生成 UUID v7（基于时间戳）
 */
function generateUuidV7(): string {
  const timestamp = Date.now()
  const timeHex = timestamp.toString(16).padStart(12, '0')
  
  const randomPart = 'xxxxxxxxxxxx'.replace(/x/g, function() {
    return (Math.random() * 16 | 0).toString(16)
  })
  
  // UUID v7 格式: tttttttt-tttt-7xxx-yxxx-xxxxxxxxxxxx
  const uuid = `${timeHex.slice(0, 8)}-${timeHex.slice(8)}-7${randomPart.slice(0, 3)}-${(parseInt(randomPart.slice(3, 4), 16) & 0x3 | 0x8).toString(16)}${randomPart.slice(4, 15)}`
  
  return uuid
}

/**
 * 格式化 UUID
 */
function formatUuid(uuid: string, format: string): string {
  switch (format) {
    case 'compact':
      return uuid.replace(/-/g, '')
    case 'braces':
      return `{${uuid}}`
    case 'standard':
    default:
      return uuid
  }
}

/**
 * 批量生成 UUID
 */
function generateMultipleUuids(count: number, version: 'v4' | 'v7', format: string): string {
  const uuids: string[] = []
  
  for (let i = 0; i < count; i++) {
    const uuid = version === 'v4' ? generateUuidV4() : generateUuidV7()
    uuids.push(formatUuid(uuid, format))
  }
  
  return uuids.join('\n')
}

export const uuidTool: ToolDefinition = {
  id: 'uuid',
  name: 'UUID 生成器',
  description: '生成 UUID v4/v7，支持批量生成',
  category: 'developer',
  icon: 'Key',
  priority: 90,
  
  execute(_input: string, options?: ToolExecuteOptions): string {
    const uuidOptions = options as UuidOptions
    const count = uuidOptions.count || 1

    return generateMultipleUuids(count, uuidOptions.version, uuidOptions.format || 'standard')
  },
  
  options: [
    {
      name: 'version',
      type: 'radio',
      label: '版本',
      defaultValue: 'v4',
      options: [
        { label: 'UUID v4 (随机)', value: 'v4' },
        { label: 'UUID v7 (时间戳)', value: 'v7' }
      ]
    },
    {
      name: 'count',
      type: 'number',
      label: '生成数量',
      defaultValue: 1
    },
    {
      name: 'format',
      type: 'select',
      label: '格式',
      defaultValue: 'standard',
      options: [
        { label: '标准格式 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)', value: 'standard' },
        { label: '紧凑格式 (xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)', value: 'compact' },
        { label: '带花括号 ({xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx})', value: 'braces' }
      ]
    },
    {
      name: 'uppercase',
      type: 'checkbox',
      label: '大写字母',
      defaultValue: false
    }
  ],
  
  examples: [
    {
      input: '',
      output: '550e8400-e29b-41d4-a716-446655440000',
      description: '生成 UUID v4'
    }
  ]
}
