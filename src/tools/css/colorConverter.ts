/**
 * CSS 颜色转换器
 * 支持 HEX、RGB、HSL、HSV 等格式互转
 */

import type { ToolDefinition } from '../types'

/**
 * HEX 转 RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '')
  let r: number, g: number, b: number

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0]! + cleanHex[0]!, 16)
    g = parseInt(cleanHex[1]! + cleanHex[1]!, 16)
    b = parseInt(cleanHex[2]! + cleanHex[2]!, 16)
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16)
    g = parseInt(cleanHex.substring(2, 4), 16)
    b = parseInt(cleanHex.substring(4, 6), 16)
  } else {
    return null
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null
  }

  return { r, g, b }
}

/**
 * RGB 转 HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

/**
 * RGB 转 HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0; const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * HSL 转 RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * RGB 转 HSV
 */
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0; const v = max

  const d = max - min
  s = max === 0 ? 0 : d / max

  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

/**
 * 解析颜色输入
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseColor(input: string): { type: string; values: any } | null {
  const trimmed = input.trim()

  // HEX 格式
  if (trimmed.startsWith('#')) {
    const rgb = hexToRgb(trimmed)
    if (rgb) {
      return { type: 'hex', values: rgb }
    }
  }

  // RGB 格式: rgb(255, 128, 0) 或 rgba(255, 128, 0, 0.5)
  const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbMatch) {
    return {
      type: 'rgb',
      values: {
        r: parseInt(rgbMatch[1]!),
        g: parseInt(rgbMatch[2]!),
        b: parseInt(rgbMatch[3]!),
        a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
      }
    }
  }

  // HSL 格式: hsl(120, 50%, 50%)
  const hslMatch = trimmed.match(/hsla?\((\d+),\s*(\d+)%,?\s*(\d+)%(?:,\s*([\d.]+))?\)/)
  if (hslMatch) {
    return {
      type: 'hsl',
      values: {
        h: parseInt(hslMatch[1]!),
        s: parseInt(hslMatch[2]!),
        l: parseInt(hslMatch[3]!),
        a: hslMatch[4] ? parseFloat(hslMatch[4]) : 1
      }
    }
  }

  return null
}

/**
 * 转换颜色
 */
function convertColor(input: string, targetFormat: string): string {
  const parsed = parseColor(input)
  if (!parsed) {
    throw new Error('无法识别的颜色格式')
  }

  let rgb: { r: number; g: number; b: number }

  // 统一转换为 RGB
  switch (parsed.type) {
    case 'hex':
    case 'rgb':
      rgb = parsed.values
      break
    case 'hsl':
      rgb = hslToRgb(parsed.values.h, parsed.values.s, parsed.values.l)
      break
    default:
      throw new Error('不支持的颜色格式')
  }

  // 从 RGB 转换为目标格式
  switch (targetFormat) {
    case 'hex':
      return rgbToHex(rgb.r, rgb.g, rgb.b)
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    case 'rgba':
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
    case 'hsl': {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
    case 'hsla': {
      const hsla = rgbToHsl(rgb.r, rgb.g, rgb.b)
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, 1)`
    }
    case 'hsv': {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
    }
    default:
      throw new Error('不支持的目标格式')
  }
}

/**
 * 获取所有格式
 */
function getAllFormats(input: string): Record<string, string> {
  const parsed = parseColor(input)
  if (!parsed) {
    throw new Error('无法识别的颜色格式')
  }

  let rgb: { r: number; g: number; b: number }

  switch (parsed.type) {
    case 'hex':
    case 'rgb':
      rgb = parsed.values
      break
    case 'hsl':
      rgb = hslToRgb(parsed.values.h, parsed.values.s, parsed.values.l)
      break
    default:
      throw new Error('不支持的颜色格式')
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)

  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
  }
}

/**
 * 颜色转换器工具定义
 */
export const colorConverterTool: ToolDefinition = {
  id: 'color-converter',
  name: '颜色转换器',
  description: 'HEX、RGB、HSL、HSV 等颜色格式互转',
  category: 'css',
  icon: 'BrushFilled',
  tags: ['颜色', 'CSS', 'HEX', 'RGB', 'HSL', 'HSV'],
  priority: 90,

  options: [
    {
      name: 'mode',
      type: 'select',
      label: '转换模式',
      defaultValue: 'all',
      options: [
        { label: '显示所有格式', value: 'all' },
        { label: '转为 HEX', value: 'hex' },
        { label: '转为 RGB', value: 'rgb' },
        { label: '转为 HSL', value: 'hsl' },
        { label: '转为 HSV', value: 'hsv' }
      ]
    }
  ],

  execute: (input: string, options?: { mode?: string }): string => {
    if (!input.trim()) {
      return ''
    }

    const mode = options?.mode || 'all'

    try {
      if (mode === 'all') {
        const formats = getAllFormats(input)
        return Object.entries(formats)
          .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
          .join('\n')
      } else {
        return convertColor(input, mode)
      }
    } catch (error) {
      return `错误: ${(error as Error).message}`
    }
  },

  examples: [
    {
      input: '#FF5733',
      output: 'HEX: #FF5733\nRGB: rgb(255, 87, 51)\nRGBA: rgba(255, 87, 51, 1)\nHSL: hsl(9, 100%, 60%)\nHSLA: hsla(9, 100%, 60%, 1)\nHSV: hsv(9, 80%, 100%)',
      description: 'HEX 转其他格式'
    },
    {
      input: 'rgb(255, 87, 51)',
      output: 'HEX: #FF5733\nRGB: rgb(255, 87, 51)\nRGBA: rgba(255, 87, 51, 1)\nHSL: hsl(9, 100%, 60%)\nHSLA: hsla(9, 100%, 60%, 1)\nHSV: hsv(9, 80%, 100%)',
      description: 'RGB 转其他格式'
    },
    {
      input: 'hsl(9, 100%, 60%)',
      output: 'HEX: #FF5733\nRGB: rgb(255, 87, 51)\nRGBA: rgba(255, 87, 51, 1)\nHSL: hsl(9, 100%, 60%)\nHSLA: hsla(9, 100%, 60%, 1)\nHSV: hsv(9, 80%, 100%)',
      description: 'HSL 转其他格式'
    }
  ]
}
