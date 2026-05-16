/**
 * 哈希计算工具
 * 支持 MD5、SHA1、SHA256、SHA512
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'
import CryptoJS from 'crypto-js'

export interface HashOptions {
  algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512'
  uppercase?: boolean
}

/**
 * 计算哈希值
 */
function calculateHash(input: string, algorithm: string): string {
  switch (algorithm) {
    case 'md5':
      return CryptoJS.MD5(input).toString()
    case 'sha1':
      return CryptoJS.SHA1(input).toString()
    case 'sha256':
      return CryptoJS.SHA256(input).toString()
    case 'sha512':
      return CryptoJS.SHA512(input).toString()
    default:
      throw new Error(`不支持的算法: ${algorithm}`)
  }
}

export const hashTool: ToolDefinition = {
  id: 'hash',
  name: '哈希计算',
  description: 'MD5、SHA1、SHA256、SHA512 哈希计算',
  category: 'encoder',
  icon: 'Lock',
  priority: 90,
  
  execute(input: string, options?: ToolExecuteOptions): string {
    const hashOptions = options as HashOptions
    if (!input.trim()) {
      return ''
    }

    const result = calculateHash(input, hashOptions.algorithm)

    return hashOptions.uppercase ? result.toUpperCase() : result.toLowerCase()
  },
  
  options: [
    {
      name: 'algorithm',
      type: 'select',
      label: '算法',
      defaultValue: 'md5',
      options: [
        { label: 'MD5', value: 'md5' },
        { label: 'SHA1', value: 'sha1' },
        { label: 'SHA256', value: 'sha256' },
        { label: 'SHA512', value: 'sha512' }
      ]
    },
    {
      name: 'uppercase',
      type: 'checkbox',
      label: '大写字母',
      defaultValue: false
    }
  ],
  
  examples: [
    {
      input: 'hello',
      output: '5d41402abc4b2a76b9719d911017c592',
      description: 'MD5 哈希'
    },
    {
      input: 'hello',
      output: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      description: 'SHA256 哈希'
    }
  ]
}
