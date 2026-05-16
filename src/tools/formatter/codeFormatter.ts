/**
 * SQL/代码格式化工具
 * 支持 SQL、JSON、XML、HTML、CSS、JavaScript 的美化和压缩
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

function formatSql(sql: string): string {
  // 基本的 SQL 格式化（简化版）
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY',
    'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'INNER JOIN', 'OUTER JOIN', 'ON', 'IN', 'NOT IN', 'LIKE', 'BETWEEN',
    'IS NULL', 'IS NOT NULL', 'AS', 'DISTINCT', 'INSERT INTO', 'VALUES',
    'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'UNION', 'UNION ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'DEFAULT', 'NOT NULL',
    'AUTO_INCREMENT', 'INT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 'TIMESTAMP',
    'BOOLEAN', 'FLOAT', 'DOUBLE', 'DECIMAL'
  ]

  let formatted = sql
    .replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')

  keywords.sort((a, b) => b.length - a.length).forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formatted = formatted.replace(regex, `\n${keyword}`)
  })

  return formatted
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .replace(/^\s+/, '')
}

function formatXml(xml: string): string {
  let formatted = ''
  let indent = 0
  const nodes = xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/)

  nodes.forEach(node => {
    if (node.match(/^<\/\w/)) {
      // 结束标签
      indent--
    }

    if (node.match(/^<[\w]/)) {
      // 开始标签
      formatted += '\n' + '  '.repeat(indent) + node
      if (!node.match(/\/>/) && !node.match(/<\/\w/)) {
        indent++
      }
    } else if (node.match(/^<\/\w/)) {
      formatted += '\n' + '  '.repeat(indent) + node
    } else if (node.match(/<\?/)) {
      formatted += '\n' + '  '.repeat(indent) + node
    } else if (node.trim() !== '') {
      formatted += node
    }
  })

  return formatted.trim()
}

function formatCss(css: string): string {
  return css
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

function formatJs(js: string): string {
  // 简单的 JS 格式化（基于括号缩进）
  let result = ''
  let indent = 0
  let inString = false
  let stringChar = ''

  for (let i = 0; i < js.length; i++) {
    const char = js[i]
    const prevChar = i > 0 ? js[i - 1] : ''

    // 处理字符串
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true
        stringChar = char
      } else if (char === stringChar) {
        inString = false
      }
    }

    if (inString) {
      result += char
      continue
    }

    // 处理缩进
    if (char === '{') {
      result += char + '\n' + '  '.repeat(++indent)
    } else if (char === '}') {
      result += '\n' + '  '.repeat(--indent) + char
    } else if (char === ';') {
      result += char + '\n' + '  '.repeat(indent)
    } else if (char === ',') {
      // 检查是否在数组或对象中
      result += char + ' '
    } else {
      result += char
    }
  }

  return result
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
}

function compressCode(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
    .replace(/\/\/.*$/gm, '') // 移除单行注释
    .replace(/\s+/g, ' ') // 压缩空白
    .replace(/\s*([{};:,])\s*/g, '$1') // 压紧符号
    .trim()
}

export const codeFormatterTool: ToolDefinition = {
  id: 'code-formatter',
  name: '代码格式化/压缩',
  description: '支持 SQL、XML、CSS、JavaScript 的美化和压缩',
  category: 'formatter',
  icon: 'Document',
  tags: ['格式化', '美化', '压缩', 'SQL', 'XML', 'CSS', 'JS'],
  priority: 12,
  options: [
    {
      name: 'language',
      label: '语言类型',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: '自动检测', value: 'auto' },
        { label: 'SQL', value: 'sql' },
        { label: 'XML/HTML', value: 'xml' },
        { label: 'CSS', value: 'css' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'JSON', value: 'json' }
      ]
    },
    {
      name: 'action',
      label: '操作',
      type: 'select',
      defaultValue: 'format',
      options: [
        { label: '美化 (格式化)', value: 'format' },
        { label: '压缩 (Minify)', value: 'compress' }
      ]
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    if (!input.trim()) {
      throw new Error('请输入要处理的代码')
    }

    const language = options?.language || 'auto'
    const action = options?.action || 'format'

      // 自动检测语言
      let detectedLang = language
      if (language === 'auto') {
        const trimmed = input.trim().toLowerCase()
        if (trimmed.startsWith('select') || trimmed.startsWith('insert') ||
            trimmed.startsWith('update') || trimmed.startsWith('delete') ||
            trimmed.startsWith('create') || trimmed.startsWith('alter') ||
            trimmed.startsWith('drop')) {
          detectedLang = 'sql'
        } else if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
          detectedLang = 'xml'
        } else if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            JSON.parse(input)
            detectedLang = 'json'
          } catch {
            detectedLang = 'javascript'
          }
        } else if (trimmed.includes('{') && trimmed.includes(':') && trimmed.includes(';')) {
          detectedLang = 'css'
        } else {
          detectedLang = 'javascript'
        }
      }

      let result: string
      const originalSize = new Blob([input]).size

      if (action === 'compress') {
        result = compressCode(input)
        const compressedSize = new Blob([result]).size
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1)

        return `${detectedLang.toUpperCase()} 压缩完成，压缩率 ${ratio}% (${originalSize} → ${compressedSize} 字节)\n\n${result}`
      }

      switch (detectedLang) {
        case 'sql':
          result = formatSql(input)
          break
        case 'xml':
          result = formatXml(input)
          break
        case 'css':
          result = formatCss(input)
          break
        case 'javascript':
          result = formatJs(input)
          break
        case 'json':
          try {
            const parsed = JSON.parse(input)
            result = JSON.stringify(parsed, null, 2)
          } catch {
            throw new Error('无效的 JSON 格式')
          }
          break
        default:
          result = input
      }

      const formattedSize = new Blob([result]).size

      return `${detectedLang.toUpperCase()} 格式化完成 (${originalSize} → ${formattedSize} 字节)\n\n${result}`
  },

  examples: [
    {
      input: 'SELECT id,name,email FROM users WHERE active=1 ORDER BY created_at DESC LIMIT 10',
      options: { language: 'auto', action: 'format' },
      output: '格式化后的SQL',
      description: 'SQL 格式化示例'
    },
    {
      input: '{"name":"John","age":30,"active":true}',
      options: { language: 'auto', action: 'format' },
      output: '格式化后的JSON',
      description: 'JSON 格式化示例'
    },
    {
      input: '.card{padding:20px;margin:10px;background:#fff;border-radius:8px}',
      options: { language: 'auto', action: 'compress' },
      output: '压缩后的CSS',
      description: 'CSS 压缩示例'
    }
  ]
}
