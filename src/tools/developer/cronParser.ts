/**
 * Cron 表达式解析工具
 * 解析和验证 Cron 定时任务表达式
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

// Cron 字段说明
const FIELD_DESCRIPTIONS = [
  { name: '秒', range: '0-59', required: false },
  { name: '分', range: '0-59', required: true },
  { name: '时', range: '0-23', required: true },
  { name: '日', range: '1-31', required: true },
  { name: '月', range: '1-12', required: true },
  { name: '周', range: '0-6 (0=周日)', required: true },
]

const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
}

const WEEK_NAMES: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6
}

function parseField(field: string, min: number, max: number): number[] {
  const values = new Set<number>()

  field.split(',').forEach(part => {
    part = part.toLowerCase().trim()

    // 处理名称映射
    if (min === 1 && max === 12 && part in MONTH_NAMES) {
      part = String(MONTH_NAMES[part])
    }
    if ((min === 0 || min === 1) && max <= 6 && part in WEEK_NAMES) {
      part = String(WEEK_NAMES[part])
    }

    // 处理通配符
    if (part === '*') {
      for (let i = min; i <= max; i++) values.add(i)
      return
    }

    // 处理范围和步长
    if (part.includes('/')) {
      const [range, step] = part.split('/')
      if (!range || !step) return
      const stepVal = parseInt(step)
      if (range === '*') {
        for (let i = min; i <= max; i += stepVal) values.add(i)
      } else if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number)
        for (let i = start!; i <= end!; i += stepVal) values.add(i)
      }
      return
    }

    // 处理范围
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start!; i <= end!; i++) values.add(i)
      return
    }

    // 单个值
    const val = parseInt(part)
    if (!isNaN(val) && val >= min && val <= max) {
      values.add(val)
    }
  })

  return Array.from(values).sort((a, b) => a - b)
}

function getNextExecutions(cronParts: string[], count: number = 5): string[] {
  const now = new Date()
  const executions: string[] = []

  // 简化实现：只检查未来24小时内的执行时间
  const checkDate = new Date(now)
  let attempts = 0
  const maxAttempts = 100000

  while (executions.length < count && attempts < maxAttempts) {
    attempts++
    checkDate.setMinutes(checkDate.getMinutes() + 1)

    if (checkDate.getTime() > now.getTime() + 24 * 60 * 60 * 1000) break

    const sec = cronParts[0]
    const min = cronParts[1]
    const hour = cronParts[2]
    const day = cronParts[3]
    const month = cronParts[4]
    const weekDay = cronParts[5]

    const secs = parseField(sec !== undefined ? sec : '0', 0, 59)
    const mins = parseField(min || '0', 0, 59)
    const hours = parseField(hour || '0', 0, 23)
    const days = parseField(day || '*', 1, 31)
    const months = parseField(month || '*', 1, 12)
    const weekDays = parseField(weekDay || '*', 0, 6)

    if (
      secs.includes(checkDate.getSeconds()) &&
      mins.includes(checkDate.getMinutes()) &&
      hours.includes(checkDate.getHours()) &&
      months.includes(checkDate.getMonth() + 1) &&
      (days.includes(checkDate.getDate()) || weekDays.includes(checkDate.getDay()))
    ) {
      executions.push(checkDate.toLocaleString('zh-CN'))
    }
  }

  return executions
}

export const cronParserTool: ToolDefinition = {
  id: 'cron-parser',
  name: 'Cron 表达式解析',
  description: '解析和验证 Cron 定时任务表达式，展示执行计划',
  category: 'developer',
  icon: 'Clock',
  tags: ['cron', '定时任务', '调度', 'Linux'],
  priority: 9,
  options: [
    {
      name: 'showNext',
      label: '显示下次执行时间',
      type: 'switch',
      defaultValue: true
    },
    {
      name: 'nextCount',
      label: '显示次数',
      type: 'number',
      defaultValue: 5
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    const cronExpr = input.trim()
    if (!cronExpr) {
      throw new Error('请输入 Cron 表达式')
    }

      // 分割表达式
      const parts = cronExpr.split(/\s+/)

      // 判断是标准5字段还是扩展6字段
      const isExtended = parts.length === 6
      if (parts.length !== 5 && parts.length !== 6) {
        throw new Error('无效的 Cron 表达式格式\n标准格式: 分 时 日 月 周\n扩展格式: 秒 分 时 日 月 周')
      }

      const fields = isExtended ? parts : ['0', ...parts]

      // 解析每个字段
      const outputLines: string[] = [
        `📅 Cron 表达式: ${cronExpr}`,
        `📋 类型: ${isExtended ? '扩展 (含秒)' : '标准 (5字段)'}`,
        ''
      ]

      // 字段详情
      outputLines.push('=== 字段解析 ===')
      FIELD_DESCRIPTIONS.forEach((field, i) => {
        if (!field.required && !isExtended && i === 0) return

        const idx = isExtended ? i : i - 1
        const fieldValue = fields[idx]
        if (!fieldValue) return
        const rangeParts = field.range.split('-')
        const parsedValues = parseField(fieldValue, 
          parseInt(rangeParts[0]!),
          parseInt(rangeParts[1]!)
        )

        outputLines.push(`${field.name}: ${fieldValue} → ${parsedValues.join(', ')}`)
      })

      // 显示下次执行时间
      if (options?.showNext !== false) {
        const nextCount = Number(options?.nextCount) || 5
        outputLines.push('', '=== 下次执行时间 ===')

        try {
          const nextExecutions = getNextExecutions(fields, nextCount)
          if (nextExecutions.length > 0) {
            nextExecutions.forEach((time, i) => {
              outputLines.push(`${i + 1}. ${time}`)
            })
          } else {
            outputLines.push('在未来24小时内未找到执行时间')
          }
        } catch {
          outputLines.push('计算执行时间时出错')
        }
      }

      // 可读性描述
      outputLines.push('', '=== 说明 ===')
      outputLines.push('这是一个定时任务表达式，用于指定任务的执行周期。')

      return outputLines.join('\n')
  },

  examples: [
    {
      input: '0 9 * * *',
      output: '下次执行时间:',
      description: '每天早上9点执行'
    },
    {
      input: '*/15 * * * *',
      output: '下次执行时间:',
      description: '每15分钟执行一次'
    },
    {
      input: '0 0 1 * *',
      output: '下次执行时间:',
      description: '每月1号午夜执行'
    }
  ]
}
