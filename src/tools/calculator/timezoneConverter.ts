/**
 * 时区转换工具
 * 支持不同时区之间的日期时间转换
 */

import type { ToolDefinition } from '../types'

// 常用时区列表
const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: '北京时间 (UTC+8)', value: 'Asia/Shanghai' },
  { label: '东京时间 (UTC+9)', value: 'Asia/Tokyo' },
  { label: '首尔时间 (UTC+9)', value: 'Asia/Seoul' },
  { label: '新加坡时间 (UTC+8)', value: 'Asia/Singapore' },
  { label: '伦敦时间 (UTC+0)', value: 'Europe/London' },
  { label: '巴黎时间 (UTC+1)', value: 'Europe/Paris' },
  { label: '柏林时间 (UTC+1)', value: 'Europe/Berlin' },
  { label: '莫斯科时间 (UTC+3)', value: 'Europe/Moscow' },
  { label: '纽约时间 (UTC-5)', value: 'America/New_York' },
  { label: '洛杉矶时间 (UTC-8)', value: 'America/Los_Angeles' },
  { label: '芝加哥时间 (UTC-6)', value: 'America/Chicago' },
  { label: '旧金山时间 (UTC-8)', value: 'America/Los_Angeles' },
  { label: '悉尼时间 (UTC+11)', value: 'Australia/Sydney' },
  { label: '东京时间 (UTC+9)', value: 'Asia/Tokyo' },
  { label: '香港时间 (UTC+8)', value: 'Asia/Hong_Kong' },
  { label: '迪拜时间 (UTC+4)', value: 'Asia/Dubai' },
  { label: '孟买时间 (UTC+5:30)', value: 'Asia/Kolkata' }
]

/**
 * 格式化日期时间
 */
function formatDateTime(date: Date, timeZone: string): string {
  return date.toLocaleString('zh-CN', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * 获取时区的 UTC 偏移量字符串
 */
function getTimezoneOffset(timezone: string): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset'
  })
  const parts = formatter.formatToParts(now)
  const offsetPart = parts.find(p => p.type === 'timeZoneName')
  return offsetPart?.value || ''
}

/**
 * 时区转换
 */
function convertTimezone(
  input: string,
  fromTimezone: string,
  toTimezone: string
): string {
  if (!input.trim()) {
    return ''
  }

  // 解析输入时间
  const now = new Date()
  let inputDate: Date

  // 如果输入是空，使用当前时间
  if (input.trim() === 'now' || input.trim() === 'now()') {
    inputDate = now
  } else {
    // 尝试解析输入的时间字符串
    inputDate = new Date(input)
    if (isNaN(inputDate.getTime())) {
      return `❌ 无法解析时间：${input}\n\n请输入有效的时间格式，例如：\n• 2024-01-15 10:30:00\n• 2024/01/15 10:30\n• now（当前时间）`
    }
  }

  const fromOffset = getTimezoneOffset(fromTimezone)
  const toOffset = getTimezoneOffset(toTimezone)

  let output = `🌍 时区转换结果\n\n`
  output += `📥 原始时间 (${fromTimezone})：\n`
  output += `${formatDateTime(inputDate, fromTimezone)} ${fromOffset}\n\n`
  output += `📤 转换结果 (${toTimezone})：\n`
  output += `${formatDateTime(inputDate, toTimezone)} ${toOffset}\n\n`

  // 额外常用时区
  output += `📋 其他时区对照：\n`
  const commonTimezones = ['UTC', 'Asia/Shanghai', 'America/New_York', 'Europe/London', 'Asia/Tokyo']
  commonTimezones.forEach(tz => {
    if (tz !== fromTimezone && tz !== toTimezone) {
      output += `• ${tz}: ${formatDateTime(inputDate, tz)} ${getTimezoneOffset(tz)}\n`
    }
  })

  // 时间差计算
  output += `\n⏱️ 时差信息：\n`
  const fromDate = new Date(inputDate.toLocaleString('en-US', { timeZone: fromTimezone }))
  const toDate = new Date(inputDate.toLocaleString('en-US', { timeZone: toTimezone }))
  const diffHours = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60)
  output += `与 ${fromTimezone} 的时差: ${diffHours >= 0 ? '+' : ''}${diffHours} 小时`

  return output
}

/**
 * 时区转换工具定义
 */
export const timezoneConverterTool: ToolDefinition = {
  id: 'timezone-converter',
  name: '时区转换',
  description: '不同时区之间的日期时间转换',
  category: 'calculator',
  icon: 'Clock',
  priority: 75,
  outputType: 'text',

  options: [
    {
      name: 'fromTimezone',
      type: 'select',
      label: '源时区',
      defaultValue: 'Asia/Shanghai',
      options: TIMEZONES
    },
    {
      name: 'toTimezone',
      type: 'select',
      label: '目标时区',
      defaultValue: 'America/New_York',
      options: TIMEZONES
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(input: string, options?: Record<string, any>): string {
    const fromTimezone = options?.fromTimezone || 'Asia/Shanghai'
    const toTimezone = options?.toTimezone || 'America/New_York'
    return convertTimezone(input, fromTimezone, toTimezone)
  },

  examples: [
    {
      input: 'now',
      output: '🌍 时区转换结果...',
      description: '当前时间转换'
    }
  ]
}
