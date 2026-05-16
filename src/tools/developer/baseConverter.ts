/**
 * 进制转换工具增强版
 * 支持 2/8/10/16/32/64 进制之间的相互转换
 */

import type { ToolDefinition } from '../types'

/**
 * 检测输入数字的进制
 */
function detectBase(input: string): { base: number; value: string } | null {
  const trimmed = input.trim()

  // 检测前缀
  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
    return { base: 16, value: trimmed.slice(2) }
  }
  if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) {
    return { base: 2, value: trimmed.slice(2) }
  }
  if (trimmed.startsWith('0o') || trimmed.startsWith('0O')) {
    return { base: 8, value: trimmed.slice(2) }
  }

  // 检测是否为纯二进制
  if (/^[01]+$/i.test(trimmed)) {
    return { base: 2, value: trimmed }
  }

  // 检测是否为八进制
  if (/^[0-7]+$/i.test(trimmed)) {
    return { base: 8, value: trimmed }
  }

  // 检测是否为十进制
  if (/^\d+$/i.test(trimmed)) {
    return { base: 10, value: trimmed }
  }

  // 检测是否为十六进制
  if (/^[0-9a-fA-F]+$/i.test(trimmed)) {
    return { base: 16, value: trimmed }
  }

  return null
}

/**
 * 字符到数值
 */
function charToValue(c: string): number {
  const code = c.charCodeAt(0)
  if (code >= 48 && code <= 57) return code - 48 // 0-9
  if (code >= 65 && code <= 90) return code - 55 // A-Z
  if (code >= 97 && code <= 122) return code - 87 // a-z
  return -1
}

/**
 * 数值到字符
 */
function valueToChar(v: number): string {
  if (v >= 0 && v <= 9) return String(v)
  return String.fromCharCode(v + 55)
}

/**
 * 任意进制转换
 */
function convertBase(input: string, fromBase: number, toBase: number): string {
  // 将输入转换为十进制数
  let decimal = 0n

  for (let i = 0; i < input.length; i++) {
    const char = input[i]!
    const value = charToValue(char)
    if (value < 0 || value >= fromBase) {
      throw new Error(`无效字符 '${char}'，该字符不在进制 ${fromBase} 的有效范围内`)
    }
    decimal = decimal * BigInt(fromBase) + BigInt(value)
  }

  // 将十进制数转换为目标进制
  if (decimal === 0n) return '0'

  let result = ''
  while (decimal > 0n) {
    const remainder = Number(decimal % BigInt(toBase))
    result = valueToChar(remainder) + result
    decimal = decimal / BigInt(toBase)
  }

  return result
}

/**
 * 格式化二进制（每 4 位一组）
 */
function formatBinary(binary: string): string {
  return binary.padStart(Math.ceil(binary.length / 4) * 4, '0')
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

/**
 * 进制转换工具定义
 */
export const baseConverterTool: ToolDefinition = {
  id: 'base-converter',
  name: '进制转换',
  description: '2/8/10/16/32/64 进制之间的相互转换',
  category: 'developer',
  icon: 'Sort',
  priority: 82,

  options: [
    {
      name: 'fromBase',
      type: 'select',
      label: '源进制',
      defaultValue: 'auto',
      options: [
        { label: '自动检测', value: 'auto' },
        { label: '二进制 (2)', value: '2' },
        { label: '八进制 (8)', value: '8' },
        { label: '十进制 (10)', value: '10' },
        { label: '十六进制 (16)', value: '16' },
        { label: '三十二进制 (32)', value: '32' },
        { label: '六十四进制 (64)', value: '64' }
      ]
    },
    {
      name: 'toBase',
      type: 'select',
      label: '目标进制',
      defaultValue: '10',
      options: [
        { label: '二进制 (2)', value: '2' },
        { label: '八进制 (8)', value: '8' },
        { label: '十进制 (10)', value: '10' },
        { label: '十六进制 (16)', value: '16' },
        { label: '三十二进制 (32)', value: '32' },
        { label: '六十四进制 (64)', value: '64' }
      ]
    },
    {
      name: 'showDetails',
      type: 'select',
      label: '显示详细信息',
      defaultValue: 'true',
      options: [
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ]
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(input: string, options?: Record<string, any>): string {
    if (!input.trim()) {
      return ''
    }

    const fromBaseOption = options?.fromBase || 'auto'
    const toBase = parseInt(options?.toBase || '10')
    const showDetails = options?.showDetails !== 'false'

    let fromBase: number
    let value: string

    // 自动检测或手动指定
    if (fromBaseOption === 'auto') {
      const detected = detectBase(input)
      if (!detected) {
        return `❌ 无法识别输入的进制：${input}\n\n支持的格式：\n• 二进制: 1010 或 0b1010\n• 八进制: 12 或 0o12\n• 十进制: 12345\n• 十六进制: 0xABC123`
      }
      fromBase = detected.base
      value = detected.value
    } else {
      fromBase = parseInt(fromBaseOption)
      // 移除前缀
      value = input.trim()
        .replace(/^0x/i, '')
        .replace(/^0b/i, '')
        .replace(/^0o/i, '')
    }

    if (isNaN(fromBase) || isNaN(toBase)) {
      return '错误: 无效的进制参数'
    }

    if (fromBase < 2 || fromBase > 64 || toBase < 2 || toBase > 64) {
      return '错误: 进制必须在 2-64 之间'
    }

    // 验证输入
    for (const char of value) {
      const charValue = charToValue(char)
      if (charValue < 0 || charValue >= fromBase) {
        return `❌ 无效字符 '${char}'\n\n在 ${fromBase} 进制中，有效字符为：\n${getValidChars(fromBase)}`
      }
    }

    try {
      const result = convertBase(value, fromBase, toBase)

      if (!showDetails) {
        return result
      }

      // 构建详细信息
      let output = `🔢 进制转换结果\n\n`
      output += `📥 原始输入: ${input.trim()}\n`
      output += `📊 检测源进制: ${fromBase === 2 ? '二进制' : fromBase === 8 ? '八进制' : fromBase === 10 ? '十进制' : fromBase === 16 ? '十六进制' : `${fromBase} 进制`}\n\n`
      output += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

      // 各进制转换结果
      const bases = [2, 8, 10, 16, 32, 64]
      output += `📤 转换结果 (目标: ${toBase} 进制):\n`
      output += `${'═'.repeat(40)}\n`

      bases.forEach(base => {
        try {
          const converted = convertBase(value, fromBase, base)
          const prefix = base === 2 ? '0b' : base === 8 ? '0o' : base === 16 ? '0x' : ''
          const label = base === 2 ? 'BIN' : base === 8 ? 'OCT' : base === 10 ? 'DEC' : base === 16 ? 'HEX' : `BASE${base}`
          const marker = base === toBase ? ' →' : ''

          if (base <= 16 || base === toBase) {
            output += `${label.padEnd(6)}: ${prefix}${converted}${marker}\n`
          }
        } catch {
          // 忽略错误
        }
      })

      output += `${'═'.repeat(40)}\n\n`

      // 二进制详细显示
      if (toBase === 2 || fromBase === 2) {
        output += `📋 二进制详情:\n`
        const binary = convertBase(value, fromBase, 2)
        output += `${formatBinary(binary)}\n`
        output += `(每 4 位一组，便于阅读)\n\n`
      }

      // 数值范围信息
      output += `📐 数值范围:\n`
      const maxDigits = value.length
      output += `• 当前数值最多需要 ${maxDigits} 个 ${fromBase} 进制字符\n`
      output += `• 十进制范围: 0 ~ ${convertBase('F'.repeat(maxDigits), 16, 10)} (假设全 F)\n\n`

      // 使用建议
      output += `💡 使用提示:\n`
      output += `• 点击示例可快速测试\n`
      output += `• 支持带前缀格式: 0x(十六进制)、0b(二进制)、0o(八进制)\n`
      output += `• 切换「显示详细信息」可查看完整转换表`

      return output
    } catch (error) {
      return `❌ 转换失败: ${(error as Error).message}`
    }
  },

  examples: [
    {
      input: '255',
      output: '🔢 进制转换结果...',
      description: '十进制 255 转其他进制'
    },
    {
      input: '0xFF',
      output: '🔢 进制转换结果...',
      description: '十六进制 FF 转其他进制'
    },
    {
      input: '0b1010',
      output: '🔢 进制转换结果...',
      description: '二进制 1010 转其他进制'
    }
  ]
}

/**
 * 获取某进制的有效字符
 */
function getValidChars(base: number): string {
  let chars = ''
  for (let i = 0; i < base; i++) {
    chars += valueToChar(i)
  }
  return chars.slice(0, 62) + '...' // 限制长度
}
