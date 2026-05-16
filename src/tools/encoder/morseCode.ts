/**
 * 摩斯密码编解码工具
 * 支持国际摩斯电码的加密和解密
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

// 摩斯密码映射表
const MORSE_CODE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
}

const REVERSE_MORSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([k, v]) => [v, k])
)

export const morseCodeTool: ToolDefinition = {
  id: 'morse-code',
  name: '摩斯密码',
  description: '摩斯电码编解码，支持字母数字和常用符号',
  category: 'encoder',
  icon: 'Connection',
  tags: ['摩斯', '电码', '编码', '加密'],
  priority: 3,
  options: [
    {
      name: 'mode',
      label: '操作模式',
      type: 'select',
      defaultValue: 'encode',
      options: [
        { label: '文本 → 摩斯码', value: 'encode' },
        { label: '摩斯码 → 文本', value: 'decode' }
      ]
    },
    {
      name: 'separator',
      label: '字符分隔符',
      type: 'input',
      defaultValue: ' ',
      placeholder: '默认空格'
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      if (!input.trim()) {
        return '错误: 请输入要处理的内容'
      }

      const mode = options?.mode || 'encode'
      const separator = options?.separator || ' '

      if (mode === 'encode') {
        const result = input.toUpperCase().split('').map(char => {
          return MORSE_CODE_MAP[char] || char
        }).join(separator)

        return result
      } else {
        const words = input.trim().split(/\s{3,}/)
        const decodedWords = words.map(word => {
          const chars = word.split(separator).filter(c => c)
          return chars.map(char => REVERSE_MORSE_MAP[char] || char).join('')
        })

        const result = decodedWords.join(' ')
        return result
      }
    } catch (error) {
      return `错误: 处理失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: 'SOS',
      output: '... --- ...',
      description: '文本 → 摩斯码 (编码模式)'
    },
    {
      input: '... --- ...',
      output: 'SOS',
      description: '摩斯码 → 文本 (解码模式)'
    },
    {
      input: 'HELLO 123',
      output: '.... . .-.. .-.. --- / .---- ..--- ...--',
      description: '包含数字的编码'
    }
  ]
}
