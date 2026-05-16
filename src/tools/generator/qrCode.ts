/**
 * 二维码生成器
 * 支持生成文本、URL、WiFi、名片等二维码
 */

import type { ToolDefinition } from '../types'
import QRCode from 'qrcode'

/**
 * 生成 WiFi 连接字符串
 */
function generateWiFiString(
  ssid: string,
  password: string,
  encryption: string = 'WPA',
  hidden: boolean = false
): string {
  return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`
}

/**
 * 生成名片 vCard 格式
 */
function generateVCard(
  name: string,
  phone: string,
  email: string = '',
  company: string = '',
  title: string = ''
): string {
  return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
${email ? `EMAIL:${email}\n` : ''}${company ? `ORG:${company}\n` : ''}${title ? `TITLE:${title}\n` : ''}END:VCARD`
}

/**
 * 生成邮件链接
 */
function generateEmailLink(
  email: string,
  subject: string = '',
  body: string = ''
): string {
  let link = `mailto:${email}`
  if (subject || body) {
    const params = new URLSearchParams()
    if (subject) params.append('subject', subject)
    if (body) params.append('body', body)
    link += `?${params.toString()}`
  }
  return link
}

/**
 * 生成电话号码链接
 */
function generateTelLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`
}

/**
 * 生成短信链接
 */
function generateSmsLink(phone: string, message: string = ''): string {
  return `sms:${phone.replace(/\s/g, '')}${message ? `?body=${encodeURIComponent(message)}` : ''}`
}

/**
 * 解析输入数据
 */
function parseInput(input: string, type: string): string {
  const lines = input.split('\n').map(line => line.trim())

  switch (type) {
    case 'wifi': {
      // 格式: SSID\n密码\n加密类型(可选)
      const ssid = lines[0] || ''
      const password = lines[1] || ''
      const encryption = lines[2] || 'WPA'
      if (!ssid) throw new Error('WiFi 名称不能为空')
      return generateWiFiString(ssid, password, encryption)
    }

    case 'vcard': {
      // 格式: 姓名\n电话\n邮箱(可选)\n公司(可选)\n职位(可选)
      const name = lines[0] || ''
      const phone = lines[1] || ''
      const email = lines[2] || ''
      const company = lines[3] || ''
      const title = lines[4] || ''
      if (!name || !phone) throw new Error('姓名和电话不能为空')
      return generateVCard(name, phone, email, company, title)
    }

    case 'email': {
      // 格式: 邮箱\n主题(可选)\n正文(可选)
      const email = lines[0] || ''
      const subject = lines[1] || ''
      const body = lines[2] || ''
      if (!email) throw new Error('邮箱地址不能为空')
      return generateEmailLink(email, subject, body)
    }

    case 'tel': {
      const phone = lines[0] || ''
      if (!phone) throw new Error('电话号码不能为空')
      return generateTelLink(phone)
    }

    case 'sms': {
      const phone = lines[0] || ''
      const message = lines[1] || ''
      if (!phone) throw new Error('电话号码不能为空')
      return generateSmsLink(phone, message)
    }

    default:
      return input
  }
}

/**
 * 生成二维码
 */
async function generateQRCode(
  data: string,
  options: {
    width?: number
    margin?: number
    colorDark?: string
    colorLight?: string
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  }
): Promise<string> {
  try {
    const qrOptions = {
      width: options.width || 256,
      margin: options.margin || 2,
      color: {
        dark: options.colorDark || '#000000',
        light: options.colorLight || '#FFFFFF'
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M'
    }

    // 生成 Data URL
    const dataUrl = await QRCode.toDataURL(data, qrOptions)
    return dataUrl
  } catch (error) {
    throw new Error(`二维码生成失败: ${(error as Error).message}`)
  }
}

/**
 * 二维码生成结果
 */
export interface QRCodeResult {
  type: 'image'
  dataUrl: string
  info: string
  fileName: string
}

/**
 * 二维码生成器工具定义
 */
export const qrCodeTool: ToolDefinition = {
  id: 'qr-code',
  name: '二维码生成器',
  description: '生成文本、URL、WiFi、名片等二维码',
  category: 'generator',
  icon: 'MagicStick',
  tags: ['二维码', 'QR Code', '生成器', '扫码'],
  priority: 88,
  outputType: 'image',

  options: [
    {
      name: 'type',
      type: 'select',
      label: '二维码类型',
      defaultValue: 'text',
      options: [
        { label: '📝 文本/URL', value: 'text' },
        { label: '📶 WiFi 连接', value: 'wifi' },
        { label: '👤 名片 (vCard)', value: 'vcard' },
        { label: '📧 发送邮件', value: 'email' },
        { label: '📞 拨打电话', value: 'tel' },
        { label: '💬 发送短信', value: 'sms' }
      ]
    },
    {
      name: 'width',
      type: 'number',
      label: '宽度 (像素)',
      defaultValue: 256,
      min: 128,
      max: 1024
    },
    {
      name: 'errorCorrectionLevel',
      type: 'select',
      label: '容错级别',
      defaultValue: 'M',
      options: [
        { label: '低 (7%)', value: 'L' },
        { label: '中 (15%)', value: 'M' },
        { label: '高 (25%)', value: 'Q' },
        { label: '最高 (30%)', value: 'H' }
      ]
    },
    {
      name: 'colorDark',
      type: 'text',
      label: '前景色',
      defaultValue: '#000000'
    },
    {
      name: 'colorLight',
      type: 'text',
      label: '背景色',
      defaultValue: '#FFFFFF'
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (input: string, options?: Record<string, any>): Promise<QRCodeResult> => {
    if (!input.trim()) {
      throw new Error('请输入要生成二维码的内容')
    }

    const type = options?.type || 'text'

    // 解析输入数据
    const data = parseInput(input, type)

    // 生成二维码
    const dataUrl = await generateQRCode(data, {
      width: options?.width || 256,
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      colorDark: options?.colorDark || '#000000',
      colorLight: options?.colorLight || '#FFFFFF'
    })

    const info = `📋 数据内容：
${data.substring(0, 100)}${data.length > 100 ? '...' : ''}

📐 尺寸: ${options?.width || 256} × ${options?.width || 256} 像素
🛡️ 容错级别: ${options?.errorCorrectionLevel || 'M'}`

    return {
      type: 'image',
      dataUrl,
      info,
      fileName: `qrcode_${Date.now()}.png`
    }
  },

  examples: [
    {
      input: 'https://www.example.com',
      output: '二维码已生成',
      description: '生成 URL 二维码'
    },
    {
      input: 'MyWiFiNetwork\nMyPassword123\nWPA',
      output: '二维码已生成',
      description: '生成 WiFi 二维码'
    },
    {
      input: '张三\n13800138000\nzhangsan@example.com\n某公司\n工程师',
      output: '二维码已生成',
      description: '生成名片二维码'
    }
  ]
}
