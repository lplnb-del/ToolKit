/**
 * 颜色选择器工具
 * 交互式颜色选择器，支持多种颜色格式输出
 */

import type { ToolDefinition } from '../types'

/**
 * 颜色选择器工具定义
 */
export const colorPickerTool: ToolDefinition = {
  id: 'color-picker',
  name: '颜色选择器',
  description: '交互式颜色选择器，支持 HEX、RGB、HSL、HSV 格式',
  category: 'css',
  icon: 'BrushFilled',
  priority: 90,
  outputType: 'text',

  options: [
    {
      name: 'defaultColor',
      type: 'text',
      label: '默认颜色',
      defaultValue: '#3B82F6'
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(input: string, options?: Record<string, any>): string {
    const color = input.trim() || options?.defaultColor || '#3B82F6'

    // 如果输入是有效的颜色，则输出格式化的颜色信息
    if (color.match(/^#[0-9A-Fa-f]{6}$/) || color.match(/^#[0-9A-Fa-f]{3}$/)) {
      return formatColorInfo(color)
    }

    // 如果输入为空，返回使用说明
    return `🎨 颜色选择器

请在左侧输入框中输入颜色值（支持 HEX 格式），或使用颜色选择器。

支持的输入格式：
• #RGB
• #RRGGBB

支持的输出格式：
• HEX
• RGB
• HSL
• HSV
• CMYK
• CSS rgba()
• CSS hsla()`
  },

  examples: [
    {
      input: '#3B82F6',
      output: '🎨 颜色信息',
      description: '蓝色'
    },
    {
      input: '#FF5733',
      output: '🎨 颜色信息',
      description: '橙色'
    }
  ]
}

/**
 * 格式化颜色信息
 */
function formatColorInfo(hex: string): string {
  // 扩展 3 位 HEX 为 6 位
  let fullHex = hex
  if (hex.length === 4) {
    fullHex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  // 解析 RGB
  const r = parseInt(fullHex.slice(1, 3), 16)
  const g = parseInt(fullHex.slice(3, 5), 16)
  const b = parseInt(fullHex.slice(5, 7), 16)

  // RGB 转 HSL
  const hsl = rgbToHsl(r, g, b)

  // RGB 转 HSV
  const hsv = rgbToHsv(r, g, b)

  // RGB 转 CMYK
  const cmyk = rgbToCmyk(r, g, b)

  // 构建输出
  const output = `🎨 颜色信息

━━━━━━━━━━━ 颜色预览 ━━━━━━━━━━━
🖌️   <span style="background-color: ${fullHex}; padding: 10px 30px; border-radius: 8px; font-size: 18px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${fullHex.toUpperCase()}</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━ 格式输出 ━━━━━━━━━━━

🔤 HEX
   • ${fullHex.toUpperCase()}
   • ${fullHex.toLowerCase()}

📐 RGB
   • rgb(${r}, ${g}, ${b})
   • rgba(${r}, ${g}, ${b}, 1)

📊 HSL
   • hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)
   • hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, 1)

🎯 HSV
   • hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)

🖨️ CMYK
   • cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 颜色通道值

R: ${r} (${decToHex(r)})
G: ${g} (${decToHex(g)})
B: ${b} (${decToHex(b)})

亮度: ${Math.round(hsl.l)}%
饱和度: ${Math.round(hsl.s)}%
色调: ${Math.round(hsl.h)}°`

  return output
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
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
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
  let h = 0
  const v = max
  const d = max - min
  const s = max === 0 ? 0 : d / max

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    v: v * 100
  }
}

/**
 * RGB 转 CMYK
 */
function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  r /= 255
  g /= 255
  b /= 255

  const k = 1 - Math.max(r, g, b)
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }

  return {
    c: (1 - r - k) / (1 - k) * 100,
    m: (1 - g - k) / (1 - k) * 100,
    y: (1 - b - k) / (1 - k) * 100,
    k: k * 100
  }
}

/**
 * 十进制转十六进制（带填充）
 */
function decToHex(n: number): string {
  return n.toString(16).padStart(2, '0').toUpperCase()
}
