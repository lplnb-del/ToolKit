/**
 * 日期计算器
 * 计算日期差值、加减天数、工作日计算等
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

function parseDate(dateStr: string): Date | null {
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/,
    /^(\d{4})\/(\d{2})\/(\d{2})$/,
    /^(\d{4})(\d{2})(\d{2})$/,
    /^(\d{2})-(\d{2})-(\d{4})$/,
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  ]

  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      let year: number, month: number, day: number

      if (format.source.includes('\\d{4}).*\\d{2}.*\\d{2}')) {
        [, year, month, day] = match.map(Number) as [string, number, number, number]
      } else {
        [, day, month, year] = match.map(Number) as [string, number, number, number]
      }

      const date = new Date(year, month - 1, day)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
  }

  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}-${month}-${day} (${weekDays[date.getDay()]})`
}

function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs(date2.getTime() - date1.getTime()) / oneDay)
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

function countWorkdays(startDate: Date, endDate: Date): number {
  let count = 0
  const current = new Date(startDate)

  while (current <= endDate) {
    if (!isWeekend(current)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

function getWeekOfYear(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1
}

export const dateCalculatorTool: ToolDefinition = {
  id: 'date-calculator',
  name: '日期计算器',
  description: '计算日期差值、加减日期、工作日统计、周数季度等',
  category: 'calculator',
  icon: 'Calendar',
  tags: ['日期', '计算', '差值', '工作日', '时间'],
  priority: 11,
  options: [
    {
      name: 'mode',
      label: '计算模式',
      type: 'select',
      defaultValue: 'diff',
      options: [
        { label: '📊 日期差值计算', value: 'diff' },
        { label: '➕ 日期加减', value: 'add' },
        { label: '💼 工作日计算', value: 'workdays' },
        { label: '📅 日期详情', value: 'details' }
      ]
    },
    {
      name: 'startDate',
      label: '开始日期 (YYYY-MM-DD)',
      type: 'input',
      defaultValue: ''
    },
    {
      name: 'endDate',
      label: '结束日期 (YYYY-MM-DD)',
      type: 'input',
      defaultValue: ''
    },
    {
      name: 'daysToAdd',
      label: '加减天数',
      type: 'number',
      defaultValue: 0
    },
    {
      name: 'includeWeekends',
      label: '工作日计算包含周末',
      type: 'switch',
      defaultValue: false
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      const mode = options?.mode || 'diff'

      if (mode === 'diff') {
        const startDateStr = options?.startDate || input.split('\n')[0]
        const endDateStr = options?.endDate || input.split('\n')[1] || startDateStr

        if (!startDateStr || !endDateStr) {
          return '错误: 请提供开始和结束日期（每行一个，或使用选项设置）'
        }

        const startDate = parseDate(startDateStr)
        const endDate = parseDate(endDateStr)

        if (!startDate || !endDate) {
          return '错误: 无法解析日期，请使用 YYYY-MM-DD 格式'
        }

        const daysBetween = getDaysBetween(startDate, endDate)
        const workdays = countWorkdays(
          startDate < endDate ? startDate : endDate,
          startDate < endDate ? endDate : startDate
        )
        const weeks = Math.floor(daysBetween / 7)
        const remainingDays = daysBetween % 7
        const isBefore = startDate < endDate

        return [
          `📅 日期差值计算结果`,
          ``,
          `开始日期: ${formatDate(startDate)}`,
          `结束日期: ${formatDate(endDate)}`,
          ``,
          `━━━ 计算结果 ━━━`,
          ``,
          `总天数: ${daysBetween} 天`,
          `总周数: ${weeks} 周 ${remainingDays} 天`,
          `工作日: ${workdays} 天 (不含周末)`,
          ``,
          isBefore
            ? `⏰ 距结束还有 ${daysBetween} 天`
            : `⏰ 已过去 ${daysBetween} 天`
        ].join('\n')
      }

      if (mode === 'add') {
        const baseDateStr = options?.startDate || input.trim()
        const daysToAdd = Number(options?.daysToAdd) || 0

        if (!baseDateStr) {
          return '错误: 请输入基准日期'
        }

        const baseDate = parseDate(baseDateStr)
        if (!baseDate) {
          return '错误: 无法解析日期'
        }

        const newDate = addDays(baseDate, daysToAdd)

        return [
          `📅 日期加减结果`,
          ``,
          `基准日期: ${formatDate(baseDate)}`,
          `${daysToAdd >= 0 ? '+' : ''}${daysToAdd} 天`,
          ``,
          `━━━ 结果 ━━━`,
          ``,
          `新日期: ${formatDate(newDate)}`,
          daysToAdd >= 0
            ? `\n📈 向后推算 ${Math.abs(daysToAdd)} 天`
            : `\n📉 向前回溯 ${Math.abs(daysToAdd)} 天`
        ].join('\n')
      }

      if (mode === 'workdays') {
        const startDateStr = options?.startDate || input.split('\n')[0]
        const endDateStr = options?.endDate || input.split('\n')[1]

        if (!startDateStr || !endDateStr) {
          return '错误: 请提供开始和结束日期'
        }

        const startDate = parseDate(startDateStr)
        const endDate = parseDate(endDateStr)

        if (!startDate || !endDate) {
          return '错误: 无法解析日期'
        }

        const totalDays = getDaysBetween(startDate, endDate)
        const workdays = countWorkdays(startDate, endDate)
        const weekendDays = totalDays - workdays

        return [
          `💼 工作日统计`,
          ``,
          `开始: ${formatDate(startDate)}`,
          `结束: ${formatDate(endDate)}`,
          ``,
          `━━━ 统计结果 ━━━`,
          ``,
          `总天数: ${totalDays} 天`,
          `工作日: ${workdays} 天`,
          `周末: ${weekendDays} 天`,
          ``,
          `工作日占比: ${(workdays / totalDays * 100).toFixed(1)}%`
        ].join('\n')
      }

      // details 模式
      const dateStr = options?.startDate || input.trim()
      const date = parseDate(dateStr)

      if (!date) {
        return '错误: 无法解析日期'
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dateOnly = new Date(date)
      dateOnly.setHours(0, 0, 0, 0)

      const diffFromToday = getDaysBetween(today, dateOnly)
      const year = date.getFullYear()
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
      const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate()
      const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1

      return [
        `📅 日期详细信息`,
        ``,
        `日期: ${formatDate(date)}`,
        ``,
        `━━━ 基本信息 ━━━`,
        ``,
        `年份: ${year} (${isLeapYear ? '闰年 ✨' : '平年'})`,
        `月份: ${date.getMonth() + 1} 月 (${daysInMonth} 天)`,
        `日期: ${date.getDate()} 日`,
        `星期: ${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}`,
        `季度: 第 ${getQuarter(date)} 季度`,
        `年第 ${getWeekOfYear(date)} 周`,
        `年中第 ${dayOfYear} 天`,
        ``,
        `━━━ 相对今天 ━━━`,
        ``,
        diffFromToday === 0
          ? '🎉 今天！'
          : diffFromToday > 0
            ? `📅 还有 ${diffFromToday} 天`
            : `📅 已过去 ${diffFromToday} 天`
      ].join('\n')
    } catch (error) {
      return `错误: 计算失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: '2025-01-01',
      options: { mode: 'diff', startDate: '2025-01-01', endDate: '2025-12-31' },
      output: '日期差值计算结果',
      description: '计算两个日期之间的天数'
    },
    {
      input: '2025-04-15',
      options: { mode: 'add', startDate: '2025-04-15', daysToAdd: 30 },
      output: '2025-05-15',
      description: '日期加30天'
    },
    {
      input: '2025-04-15',
      options: { mode: 'details', startDate: '2025-04-15' },
      output: '日期详细信息',
      description: '查看日期详情（星期、季度等）'
    }
  ]
}
