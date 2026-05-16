/**
 * 时间戳转换工具
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'
import dayjs from 'dayjs'

export interface TimestampOptions {
  mode: 'timestamp-to-date' | 'date-to-timestamp'
  unit?: 'ms' | 's'
  format?: string
}

/**
 * 时间戳转日期
 */
function timestampToDate(timestamp: string, unit: 'ms' | 's' = 'ms', format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  let ts = parseInt(timestamp.trim())
  
  if (isNaN(ts)) {
    throw new Error('无效的时间戳')
  }
  
  // 秒转毫秒
  if (unit === 's') {
    ts *= 1000
  }
  
  return dayjs(ts).format(format)
}

/**
 * 日期转时间戳
 */
function dateToTimestamp(dateStr: string, unit: 'ms' | 's' = 'ms'): string {
  const date = dayjs(dateStr)
  
  if (!date.isValid()) {
    throw new Error('无效的日期格式')
  }
  
  const timestamp = date.valueOf()
  
  if (unit === 's') {
    return Math.floor(timestamp / 1000).toString()
  }
  
  return timestamp.toString()
}

/**
 * 获取当前时间戳
 */
function getCurrentTimestamp(unit: 'ms' | 's' = 'ms'): string {
  const now = Date.now()
  if (unit === 's') {
    return Math.floor(now / 1000).toString()
  }
  return now.toString()
}

/**
 * 获取当前日期时间
 */
function getCurrentDate(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs().format(format)
}

export const timestampTool: ToolDefinition = {
  id: 'timestamp',
  name: '时间戳转换',
  description: 'Unix 时间戳与日期时间互相转换',
  category: 'developer',
  icon: 'Clock',
  priority: 95,
  
  execute(input: string, options?: ToolExecuteOptions): string {
    const timestampOptions = options as TimestampOptions
    if (timestampOptions.mode === 'timestamp-to-date') {
      if (!input.trim()) {
        // 如果没有输入，返回当前时间
        return getCurrentDate(timestampOptions.format)
      }
      return timestampToDate(input, timestampOptions.unit, timestampOptions.format)
    } else {
      if (!input.trim()) {
        // 如果没有输入，返回当前时间戳
        return getCurrentTimestamp(timestampOptions.unit)
      }
      return dateToTimestamp(input, timestampOptions.unit)
    }
  },
  
  options: [
    {
      name: 'mode',
      type: 'radio',
      label: '模式',
      defaultValue: 'timestamp-to-date',
      options: [
        { label: '时间戳 → 日期', value: 'timestamp-to-date' },
        { label: '日期 → 时间戳', value: 'date-to-timestamp' }
      ]
    },
    {
      name: 'unit',
      type: 'radio',
      label: '单位',
      defaultValue: 'ms',
      options: [
        { label: '毫秒 (ms)', value: 'ms' },
        { label: '秒 (s)', value: 's' }
      ]
    },
    {
      name: 'format',
      type: 'select',
      label: '日期格式',
      defaultValue: 'YYYY-MM-DD HH:mm:ss',
      options: [
        { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
        { label: 'HH:mm:ss', value: 'HH:mm:ss' },
        { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' }
      ]
    }
  ],
  
  examples: [
    {
      input: '1704067200000',
      output: '2024-01-01 00:00:00',
      description: '毫秒时间戳转日期'
    },
    {
      input: '2024-01-01 00:00:00',
      output: '1704067200000',
      description: '日期转毫秒时间戳'
    }
  ]
}

export { getCurrentTimestamp, getCurrentDate }
