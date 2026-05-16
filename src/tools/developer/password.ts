/**
 * 随机密码生成器
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export interface PasswordOptions {
  length: number
  uppercase?: boolean
  lowercase?: boolean
  numbers?: boolean
  symbols?: boolean
  count?: number
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

/**
 * 生成随机密码
 */
function generatePassword(options: PasswordOptions): string {
  let charset = ''
  
  if (options.uppercase) charset += CHAR_SETS.uppercase
  if (options.lowercase) charset += CHAR_SETS.lowercase
  if (options.numbers) charset += CHAR_SETS.numbers
  if (options.symbols) charset += CHAR_SETS.symbols
  
  if (charset === '') {
    throw new Error('请至少选择一种字符类型')
  }
  
  let password = ''
  const length = options.length || 16
  
  // 确保每种选中的字符类型至少出现一次
  if (options.uppercase) password += getRandomChar(CHAR_SETS.uppercase)
  if (options.lowercase) password += getRandomChar(CHAR_SETS.lowercase)
  if (options.numbers) password += getRandomChar(CHAR_SETS.numbers)
  if (options.symbols) password += getRandomChar(CHAR_SETS.symbols)
  
  // 填充剩余长度
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charset)
  }
  
  // 打乱密码字符顺序
  return shuffleString(password)
}

/**
 * 获取随机字符
 */
function getRandomChar(charset: string): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return charset[array[0]! % charset.length]!
}

/**
 * 打乱字符串顺序
 */
function shuffleString(str: string): string {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const j = array[0]! % (i + 1)
    const temp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = temp
  }
  return arr.join('')
}

/**
 * 计算密码强度
 */
function calculateStrength(password: string): { score: number; label: string } {
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  
  const labels = ['极弱', '弱', '一般', '强', '极强', '完美']
  return { score, label: labels[Math.min(score, 5)]! }
}

export const passwordTool: ToolDefinition = {
  id: 'password',
  name: '随机密码生成',
  description: '生成强密码，支持自定义规则和批量生成',
  category: 'developer',
  icon: 'Key',
  priority: 85,
  
  execute(_input: string, options?: ToolExecuteOptions): string {
    const passwordOptions = options as PasswordOptions
    const count = passwordOptions.count || 1
    const passwords: string[] = []

    for (let i = 0; i < count; i++) {
      passwords.push(generatePassword(passwordOptions))
    }

    return passwords.join('\n')
  },
  
  options: [
    {
      name: 'length',
      type: 'number',
      label: '密码长度',
      defaultValue: 16
    },
    {
      name: 'uppercase',
      type: 'checkbox',
      label: '大写字母 (A-Z)',
      defaultValue: true
    },
    {
      name: 'lowercase',
      type: 'checkbox',
      label: '小写字母 (a-z)',
      defaultValue: true
    },
    {
      name: 'numbers',
      type: 'checkbox',
      label: '数字 (0-9)',
      defaultValue: true
    },
    {
      name: 'symbols',
      type: 'checkbox',
      label: '特殊符号 (!@#$...)',
      defaultValue: true
    },
    {
      name: 'count',
      type: 'number',
      label: '生成数量',
      defaultValue: 1
    }
  ],
  
  examples: [
    {
      input: '',
      output: 'Kx9#mP2$vL5@nQ8',
      description: '生成 16 位强密码'
    }
  ]
}

export { calculateStrength }
