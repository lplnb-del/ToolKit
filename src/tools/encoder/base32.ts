/**
 * Base32/Base58 编解码工具
 * 支持多种 Base 变体的编码和解码
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

// Base32 字母表 (RFC 4648)
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567='

// Base58 字母表 (Bitcoin)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function textToBytes(text: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(text)
}

function bytesToText(bytes: Uint8Array): string {
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

function bytesToBase32(bytes: Uint8Array): string {
  let bits = ''
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i]!.toString(2).padStart(8, '0')
  }

  let result = ''
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    const index = parseInt(bits.substring(i, i + 5), 2)
    result += BASE32_ALPHABET[index]
  }

  // 填充
  const remaining = bits.length % 5
  if (remaining > 0) {
    const padding = 5 - remaining
    result += BASE32_ALPHABET[parseInt(bits.slice(-remaining).padEnd(5, '0'), 2)]
    result += '='.repeat(Math.ceil(padding / 5))
  }

  return result
}

function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.replace(/=/g, '').toUpperCase()
  let bits = ''

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]
    if (!char) continue
    const index = BASE32_ALPHABET.indexOf(char)
    if (index === -1) continue
    bits += index.toString(2).padStart(5, '0')
  }

  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2))
  }

  return new Uint8Array(bytes)
}

function bytesToBase58(bytes: Uint8Array): string {
  const digits: number[] = [0]

  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i]!
    for (let j = 0; j < digits.length; j++) {
      carry += (digits[j] || 0) << 8
      digits[j] = carry % 58
      carry = Math.floor(carry / 58)
    }
    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }

  let result = ''
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    result += BASE58_ALPHABET[0]
  }

  for (let i = digits.length - 1; i >= 0; i--) {
    result += BASE58_ALPHABET[digits[i]!]
  }

  return result
}

function base58ToBytes(base58: string): Uint8Array {
  const bytes: number[] = [0]

  for (let i = 0; i < base58.length; i++) {
    const char = base58[i]
    if (!char) continue
    const index = BASE58_ALPHABET.indexOf(char)
    if (index === -1) throw new Error(`Invalid Base58 character: ${base58[i]}`)

    let carry = index
    for (let j = 0; j < bytes.length; j++) {
      carry += (bytes[j] || 0) * 58
      bytes[j] = carry & 0xff
      carry >>= 8
    }
    while (carry > 0) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }

  for (let i = 0; i < base58.length && base58[i] === '1'; i++) {
    bytes.push(0)
  }

  return new Uint8Array(bytes.reverse())
}

export const base32Tool: ToolDefinition = {
  id: 'base32-base58',
  name: 'Base32/Base58 编解码',
  description: '支持 Base32 和 Base58 的编码与解码',
  category: 'encoder',
  icon: 'Lock',
  tags: ['Base32', 'Base58', '编码', '比特币'],
  priority: 2,
  options: [
    {
      name: 'encoding',
      label: '编码类型',
      type: 'select',
      defaultValue: 'base32',
      options: [
        { label: 'Base32', value: 'base32' },
        { label: 'Base58', value: 'base58' }
      ]
    },
    {
      name: 'mode',
      label: '操作模式',
      type: 'select',
      defaultValue: 'encode',
      options: [
        { label: '编码', value: 'encode' },
        { label: '解码', value: 'decode' }
      ]
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      if (!input.trim()) {
        return '错误: 请输入要处理的内容'
      }

      const encoding = options?.encoding || 'base32'
      const mode = options?.mode || 'encode'
      const bytes = textToBytes(input)

      let result: string
      if (encoding === 'base32') {
        result = mode === 'encode' ? bytesToBase32(bytes) : bytesToText(base32ToBytes(input))
      } else {
        result = mode === 'encode' ? bytesToBase58(bytes) : bytesToText(base58ToBytes(input))
      }

      return result
    } catch (error) {
      return `错误: 处理失败 - ${error instanceof Error ? error.message : '无效的输入格式'}`
    }
  },

  examples: [
    {
      input: 'Hello World',
      output: 'JBSWY3DPF4H3E4DIMRXGI===',
      description: 'Base32 编码示例'
    },
    {
      input: 'JBSWY3DPF4H3E4DIMRXGI===',
      output: 'Hello World',
      description: 'Base32 解码示例'
    },
    {
      input: 'Hello',
      output: 'JAQE========',
      description: 'Base58 编码示例'
    }
  ]
}
