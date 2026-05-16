/**
 * AES 加密解密工具
 * 支持 AES-128/192/256 加密解密
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'
import CryptoJS from 'crypto-js'

/**
 * AES 选项
 */
export interface AESOptions {
  mode: 'encrypt' | 'decrypt'
  keySize: 128 | 192 | 256
  modeType: 'CBC' | 'ECB' | 'CFB' | 'OFB' | 'CTR'
  padding: 'Pkcs7' | 'Iso97971' | 'AnsiX923' | 'Iso10126' | 'ZeroPadding' | 'NoPadding'
  key: string
  iv?: string
}

/**
 * 获取填充方式
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPadding(padding: string): any {
  switch (padding) {
    case 'Iso97971':
      return CryptoJS.pad.Iso97971
    case 'AnsiX923':
      return CryptoJS.pad.AnsiX923
    case 'Iso10126':
      return CryptoJS.pad.Iso10126
    case 'ZeroPadding':
      return CryptoJS.pad.ZeroPadding
    case 'NoPadding':
      return CryptoJS.pad.NoPadding
    default:
      return CryptoJS.pad.Pkcs7
  }
}

/**
 * 获取模式
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMode(mode: string): any {
  switch (mode) {
    case 'ECB':
      return CryptoJS.mode.ECB
    case 'CFB':
      return CryptoJS.mode.CFB
    case 'OFB':
      return CryptoJS.mode.OFB
    case 'CTR':
      return CryptoJS.mode.CTR
    default:
      return CryptoJS.mode.CBC
  }
}

/**
 * AES 加密
 */
 
 
function encryptAES(
  input: string,
  key: string,
  iv: string,
  keySize: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mode: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  padding: any
): string {
  // 根据密钥长度处理密钥
  const keyWordArray = CryptoJS.enc.Utf8.parse(key)
  const ivWordArray = iv ? CryptoJS.enc.Utf8.parse(iv) : undefined

  const encrypted = CryptoJS.AES.encrypt(input, keyWordArray, {
    iv: ivWordArray,
    mode,
    padding,
    keySize: keySize / 32 // CryptoJS 使用 32 位字长
  })

  return encrypted.toString()
}

/**
 * AES 解密
 */
 
 
function decryptAES(
  input: string,
  key: string,
  iv: string,
  keySize: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mode: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  padding: any
): string {
  try {
    const keyWordArray = CryptoJS.enc.Utf8.parse(key)
    const ivWordArray = iv ? CryptoJS.enc.Utf8.parse(iv) : undefined

    const decrypted = CryptoJS.AES.decrypt(input, keyWordArray, {
      iv: ivWordArray,
      mode,
      padding,
      keySize: keySize / 32
    })

    const result = decrypted.toString(CryptoJS.enc.Utf8)
    if (!result) {
      throw new Error('解密失败，请检查密钥和密文')
    }
    return result
  } catch {
    throw new Error('解密失败，请检查密钥、IV 和密文格式')
  }
}

/**
 * AES 加密解密工具定义
 */
export const aesTool: ToolDefinition = {
  id: 'aes',
  name: 'AES 加密解密',
  description: 'AES-128/192/256 对称加密解密，支持多种模式',
  category: 'encoder',
  icon: 'Lock',
  priority: 85,

  options: [
    {
      name: 'mode',
      type: 'select',
      label: '操作模式',
      defaultValue: 'encrypt',
      options: [
        { label: '加密', value: 'encrypt' },
        { label: '解密', value: 'decrypt' }
      ]
    },
    {
      name: 'keySize',
      type: 'select',
      label: '密钥长度',
      defaultValue: 256,
      options: [
        { label: 'AES-128', value: 128 },
        { label: 'AES-192', value: 192 },
        { label: 'AES-256', value: 256 }
      ]
    },
    {
      name: 'modeType',
      type: 'select',
      label: '加密模式',
      defaultValue: 'CBC',
      options: [
        { label: 'CBC', value: 'CBC' },
        { label: 'ECB', value: 'ECB' },
        { label: 'CFB', value: 'CFB' },
        { label: 'OFB', value: 'OFB' },
        { label: 'CTR', value: 'CTR' }
      ]
    },
    {
      name: 'padding',
      type: 'select',
      label: '填充方式',
      defaultValue: 'Pkcs7',
      options: [
        { label: 'Pkcs7', value: 'Pkcs7' },
        { label: 'Iso97971', value: 'Iso97971' },
        { label: 'AnsiX923', value: 'AnsiX923' },
        { label: 'Iso10126', value: 'Iso10126' },
        { label: 'ZeroPadding', value: 'ZeroPadding' },
        { label: 'NoPadding', value: 'NoPadding' }
      ]
    },
    {
      name: 'key',
      type: 'text',
      label: '密钥',
      defaultValue: ''
    },
    {
      name: 'iv',
      type: 'text',
      label: '初始向量 (IV)',
      defaultValue: ''
    }
  ],

  execute(input: string, options?: ToolExecuteOptions): string {
    const aesOptions = options as AESOptions
    if (!input.trim()) {
      return ''
    }

    if (!aesOptions.key) {
      return '错误: 请输入密钥'
    }

    // 检查密钥长度
    const keyLength = aesOptions.key.length
    const requiredLength = aesOptions.keySize / 8
    if (keyLength < requiredLength) {
      return `错误: 密钥长度不足，${aesOptions.keySize} 位加密需要至少 ${requiredLength} 个字符的密钥`
    }

    // 非 ECB 模式需要 IV
    if (aesOptions.modeType !== 'ECB' && !aesOptions.iv) {
      return '错误: CBC/CFB/OFB/CTR 模式需要初始向量 (IV)'
    }

    const mode = getMode(aesOptions.modeType)
    const padding = getPadding(aesOptions.padding)

    try {
      if (aesOptions.mode === 'encrypt') {
        return encryptAES(input, aesOptions.key, aesOptions.iv || '', aesOptions.keySize, mode, padding)
      } else {
        return decryptAES(input, aesOptions.key, aesOptions.iv || '', aesOptions.keySize, mode, padding)
      }
    } catch {
      return '解密失败，请检查密钥、IV 和密文格式'
    }
  },

  examples: [
    {
      input: 'Hello World',
      output: 'U2FsdGVkX1+...',
      description: 'AES 加密示例'
    }
  ]
}
