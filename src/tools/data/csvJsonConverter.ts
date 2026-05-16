/**
 * CSV/JSON 互转工具
 * 支持 CSV 与 JSON 格式互相转换
 */

import type { ToolDefinition } from '../types'

/**
 * 解析 CSV
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCSV(csv: string, delimiter: string = ',', hasHeader: boolean = true): any[] {
  const lines = csv.trim().split('\n')
  if (lines.length === 0) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = []

  // 处理引号内的分隔符
  const parseLine = (line: string): string[] => {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // 跳过下一个引号
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    return values
  }

  const headers = hasHeader && lines[0] ? parseLine(lines[0]) : null
  const startIndex = hasHeader ? 1 : 0

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    const values = parseLine(line)

    if (hasHeader && headers) {
      const obj: Record<string, string> = {}
      headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })
      result.push(obj)
    } else {
      result.push(values)
    }
  }

  return result
}

/**
 * 转换为 CSV
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCSV(data: any[], delimiter: string = ',', includeHeader: boolean = true): string {
  if (!Array.isArray(data) || data.length === 0) {
    return ''
  }

  const escapeValue = (value: string): string => {
    const str = String(value)
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"'
    }
    return str
  }

  const lines: string[] = []

  // 获取所有可能的键（用于对象数组）
  const keys = new Set<string>()
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => keys.add(key))
    }
  })
  const headerKeys = Array.from(keys)

  // 添加表头
  if (includeHeader && headerKeys.length > 0) {
    lines.push(headerKeys.map(escapeValue).join(delimiter))
  }

  // 添加数据行
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      const values = headerKeys.map(key => escapeValue(item[key] || ''))
      lines.push(values.join(delimiter))
    } else if (Array.isArray(item)) {
      lines.push(item.map(escapeValue).join(delimiter))
    } else {
      lines.push(escapeValue(String(item)))
    }
  })

  return lines.join('\n')
}

/**
 * CSV/JSON 互转工具定义
 */
export const csvJsonConverterTool: ToolDefinition = {
  id: 'csv-json-converter',
  name: 'CSV/JSON 互转',
  description: 'CSV 与 JSON 格式互相转换',
  category: 'data',
  icon: 'DataAnalysis',
  priority: 78,

  options: [
    {
      name: 'direction',
      type: 'select',
      label: '转换方向',
      defaultValue: 'csv-to-json',
      options: [
        { label: 'CSV → JSON', value: 'csv-to-json' },
        { label: 'JSON → CSV', value: 'json-to-csv' }
      ]
    },
    {
      name: 'delimiter',
      type: 'select',
      label: '分隔符',
      defaultValue: ',',
      options: [
        { label: '逗号 (,)', value: ',' },
        { label: '分号 (;)', value: ';' },
        { label: '制表符 (Tab)', value: '\t' },
        { label: '竖线 (|)', value: '|' }
      ]
    },
    {
      name: 'hasHeader',
      type: 'select',
      label: 'CSV 包含表头',
      defaultValue: 'true',
      options: [
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ]
    },
    {
      name: 'indent',
      type: 'number',
      label: 'JSON 缩进',
      defaultValue: 2,
      min: 0,
      max: 8
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(input: string, options?: Record<string, any>): string {
    if (!input.trim()) {
      return ''
    }

    const direction = options?.direction || 'csv-to-json'
    const delimiter = options?.delimiter || ','
    const hasHeader = options?.hasHeader !== 'false'
    const indent = options?.indent || 2

    try {
      if (direction === 'csv-to-json') {
        const result = parseCSV(input, delimiter, hasHeader)
        return JSON.stringify(result, null, indent)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any[]
        try {
          data = JSON.parse(input)
          if (!Array.isArray(data)) {
            // 如果不是数组，尝试包装成数组
            if (typeof data === 'object') {
              data = [data]
            } else {
              return '错误: JSON 必须是对象数组或对象'
            }
          }
        } catch {
          return '错误: 无效的 JSON 格式'
        }

        return toCSV(data, delimiter, hasHeader)
      }
    } catch (error) {
      return `错误: ${(error as Error).message}`
    }
  },

  examples: [
    {
      input: 'name,age,city\n张三,25,北京\n李四,30,上海',
      output: '[\n  {\n    "name": "张三",\n    "age": "25",\n    "city": "北京"\n  },\n  {\n    "name": "李四",\n    "age": "30",\n    "city": "上海"\n  }\n]',
      description: 'CSV 转 JSON 示例'
    }
  ]
}
