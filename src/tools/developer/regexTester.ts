/**
 * 正则表达式测试工具
 * 实时测试和调试正则表达式
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

interface RegexMatch {
  match: string
  index: number
  groups?: Record<string, string>
}

export const regexTesterTool: ToolDefinition = {
  id: 'regex-tester',
  name: '正则表达式测试',
  description: '实时测试正则表达式，显示匹配结果和捕获组',
  category: 'developer',
  icon: 'MagicStick',
  tags: ['正则', 'regex', '匹配', '测试'],
  priority: 10,
  options: [
    {
      name: 'flags',
      label: '标志位',
      type: 'checkbox',
      defaultValue: ['g'],
      options: [
        { label: '全局 (g)', value: 'g' },
        { label: '忽略大小写 (i)', value: 'i' },
        { label: '多行 (m)', value: 'm' },
        { label: '点号匹配换行 (s)', value: 's' }
      ]
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    // 输入格式：第一行为正则表达式，后面为测试文本
    const lines = input.split('\n')
    if (lines.length < 1 || !lines[0]?.trim()) {
      throw new Error('请输入正则表达式（第一行）')
    }

    const pattern = lines[0].trim()
    const testText = lines.slice(1).join('\n')

    if (!testText.trim()) {
      throw new Error('请输入测试文本（第二行起）')
    }

      // 解析标志位
      const flags = (options?.flags as string[]) || ['g']
      const flagStr = flags.join('')

      // 创建正则对象
      let regex: RegExp
      try {
        regex = new RegExp(pattern, flagStr)
      } catch (e) {
        throw new Error(`无效的正则表达式: ${e instanceof Error ? e.message : '语法错误'}`)
      }

      // 执行匹配
      const matches: RegexMatch[] = []
      let match: RegExpExecArray | null

      if (flagStr.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.length > 1 && match.groups ? Object.fromEntries(
              Object.entries(match.groups).map(([k, v]) => [k, v || ''])
            ) : undefined
          })
          // 防止无限循环
          if (match[0].length === 0) {
            regex.lastIndex++
          }
        }
      } else {
        match = regex.exec(testText)
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.groups ? { ...match.groups } : undefined
          })
        }
      }

      // 格式化输出结果
      const outputLines: string[] = [
        `正则表达式: /${pattern}/${flagStr}`,
        `测试文本长度: ${testText.length} 字符`,
        ``,
        `匹配结果 (${matches.length} 个):`,
        ...matches.map((m, i) => {
          let line = `${i + 1}. [${m.index}] "${m.match}"`
          if (m.groups && Object.keys(m.groups).length > 0) {
            line += `\n   捕获组: ${JSON.stringify(m.groups)}`
          }
          return line
        }),
        ``,
        matches.length === 0 ? '❌ 没有找到匹配项' : `✅ 找到 ${matches.length} 个匹配`
      ]

      return outputLines.join('\n')
  },

  examples: [
    {
      input: '\\d+\\.[a-z]+\\nHello World 123\nfoo bar 456',
      output: '匹配结果 (2 个)',
      description: '正则匹配数字和字母组合'
    },
    {
      input: '\\b\\w+@\\w+\\.\\w+\\b\nContact: admin@example.com and support@tool.com',
      output: '匹配结果 (2 个)',
      description: '匹配邮箱格式'
    }
  ]
}
