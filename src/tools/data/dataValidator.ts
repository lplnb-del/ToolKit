/**
 * 数据校验工具
 * 校验邮箱、手机号、身份证号、IP地址等格式
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

interface ValidationResult {
  field: string
  value: string
  isValid: boolean
  message: string
}

// 验证规则
const VALIDATORS: Record<string, { pattern: RegExp; message: string }> = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '邮箱地址格式不正确'
  },
  phone_cn: {
    pattern: /^1[3-9]\d{9}$/,
    message: '中国大陆手机号格式不正确（11位数字，以1开头）'
  },
  phone_intl: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: '国际电话号码格式不正确（E.164格式）'
  },
  id_card: {
    pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
    message: '中国大陆身份证号格式不正确（18位）'
  },
  ip_v4: {
    pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    message: 'IPv4 地址格式不正确'
  },
  ip_v6: {
    pattern: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/,
    message: 'IPv6 地址格式不正确'
  },
  url: {
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    message: 'URL 格式不正确（需要包含 http:// 或 https://）'
  },
  date_iso: {
    pattern: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/,
    message: 'ISO 日期格式不正确（YYYY-MM-DD 或 YYYY-MM-DDTHH:mm:ss）'
  },
  hex_color: {
    pattern: /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$/,
    message: '十六进制颜色值格式不正确（#RGB、#RRGGBB 或 #RRGGBBAA）'
  },
  base64: {
    pattern: /^[A-Za-z0-9+/]*={0,2}$/,
    message: 'Base64 字符串格式不正确'
  },
  uuid: {
    pattern: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    message: 'UUID 格式不正确（xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）'
  },
  mac_address: {
    pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4}$/,
    message: 'MAC 地址格式不正确（XX:XX:XX:XX:XX:XX 或 XX-XX-XX-XX-XX-XX）'
  },
  strong_password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: '密码强度不足（至少8位，包含大小写字母、数字和特殊字符）'
  },
  chinese_name: {
    pattern: /^[\u4e00-\u9fa5]{2,4}$/,
    message: '中文姓名格式不正确（2-4个汉字）'
  },
  postal_code: {
    pattern: /^\d{6}$/,
    message: '邮政编码格式不正确（6位数字）'
  }
}

function validateValue(type: string, value: string): ValidationResult {
  const validator = VALIDATORS[type]
  if (!validator) {
    return {
      field: type,
      value,
      isValid: false,
      message: `未知的验证类型: ${type}`
    }
  }

  const isValid = validator.pattern.test(value)
  return {
    field: type,
    value,
    isValid,
    message: isValid ? '✅ 格式正确' : `❌ ${validator.message}`
  }
}

export const dataValidatorTool: ToolDefinition = {
  id: 'data-validator',
  name: '数据校验器',
  description: '校验邮箱、手机号、身份证号、IP地址等多种数据格式',
  category: 'data',
  icon: 'DataAnalysis',
  tags: ['校验', '验证', '格式', '正则'],
  priority: 10,
  options: [
    {
      name: 'validationType',
      label: '验证类型',
      type: 'select',
      defaultValue: 'email',
      options: [
        { label: '📧 邮箱地址', value: 'email' },
        { label: '📱 中国大陆手机号', value: 'phone_cn' },
        { label: '🌍 国际电话号码', value: 'phone_intl' },
        { label: '🆔 身份证号', value: 'id_card' },
        { label: '🌐 IPv4 地址', value: 'ip_v4' },
        { label: '🌐 IPv6 地址', value: 'ip_v6' },
        { label: '🔗 URL 地址', value: 'url' },
        { label: '📅 ISO 日期', value: 'date_iso' },
        { label: '🎨 十六进制颜色', value: 'hex_color' },
        { label: '📝 Base64 字符串', value: 'base64' },
        { label: '🔑 UUID', value: 'uuid' },
        { label: '💻 MAC 地址', value: 'mac_address' },
        { label: '🔒 强密码检测', value: 'strong_password' },
        { label: '👤 中文姓名', value: 'chinese_name' },
        { label: '📮 邮政编码', value: 'postal_code' }
      ]
    },
    {
      name: 'batchMode',
      label: '批量模式（每行一个）',
      type: 'switch',
      defaultValue: false
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    const validationType = options?.validationType || 'email'
    const batchMode = Boolean(options?.batchMode)

    if (!input.trim()) {
      throw new Error('请输入要校验的内容')
    }

    if (batchMode) {
      // 批量模式：每行一个值
      const lines = input.split('\n').filter(line => line.trim())
      const results: ValidationResult[] = lines.map(line =>
        validateValue(validationType, line.trim())
      )

      const validCount = results.filter(r => r.isValid).length

      return [
        `批量校验结果 (${validCount}/${results.length} 通过)\n`,
        ...results.map(r =>
          `${r.isValid ? '✅' : '❌'} ${r.value}${r.isValid ? '' : ' - ' + r.message.replace(/^[❌✅]\s*/, '')}`
        ),
        '',
        validCount === results.length
          ? '🎉 所有数据格式正确！'
          : `⚠️ ${results.length - validCount} 个数据格式不正确`
      ].join('\n')
    }

    // 单个校验
    const result = validateValue(validationType, input.trim())

    return [
      `字段类型: ${result.field}`,
      `输入值: ${result.value}`,
      ``,
      result.message,
      ``,
      `验证规则: ${VALIDATORS[validationType]?.pattern || 'N/A'}`
    ].join('\n')
  },

  examples: [
    {
      input: 'user@example.com',
      options: { validationType: 'email', batchMode: false },
      output: '✅ 格式正确',
      description: '邮箱格式校验 - 正确'
    },
    {
      input: 'invalid-email',
      options: { validationType: 'email', batchMode: false },
      output: '❌ 格式错误',
      description: '邮箱格式校验 - 错误格式'
    },
    {
      input: '13812345678',
      options: { validationType: 'phone_cn', batchMode: false },
      output: '✅ 格式正确',
      description: '中国大陆手机号校验'
    },
    {
      input: '110101199001011234',
      options: { validationType: 'id_card', batchMode: false },
      output: '✅ 格式正确',
      description: '身份证号校验'
    }
  ]
}
